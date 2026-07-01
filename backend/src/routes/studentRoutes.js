import express from "express";
import { supabase } from "../db/supabase.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateScores } from "../services/scoreService.js";

const router = express.Router();

const fetchTestDetails = async (testId) => {
  const { data: subjects, error: subjectError } = await supabase
    .from("subjects")
    .select("id,name")
    .eq("test_id", testId);
  if (subjectError) throw subjectError;

  const subjectIds = subjects.map((subject) => subject.id);
  const { data: questions, error: questionError } = await supabase
    .from("questions")
    .select("id,subject_id,question_text,question_image_url,explanation")
    .in("subject_id", subjectIds);
  if (questionError) throw questionError;

  const questionIds = questions.map((question) => question.id);
  const { data: options, error: optionError } = await supabase
    .from("options")
    .select("id,question_id,option_text,option_image_url,is_correct")
    .in("question_id", questionIds);
  if (optionError) throw optionError;

  return questions.map((question) => {
    const subject = subjects.find((item) => item.id === question.subject_id);
    return {
      ...question,
      subject_name: subject?.name || "Unknown",
      options: options.filter((option) => option.question_id === question.id),
    };
  });
};

router.get("/tests", async (req, res, next) => {
  try {
    const userId = req.query.userId;
    if (!userId) throw new ApiError(400, "userId is required");

    const { data: tests, error: testsError } = await supabase.from("tests").select("id,name,duration");
    if (testsError) throw testsError;

    const { data: attempts, error: attemptsError } = await supabase
      .from("attempts")
      .select("id,test_id,status,attempt_number")
      .eq("user_id", userId)
      .order("attempt_number", { ascending: false });
    if (attemptsError) throw attemptsError;

    const payload = tests.map((test) => {
      const testAttempts = attempts.filter((attempt) => attempt.test_id === test.id);
      const latestAttempt = testAttempts[0];
      const status = latestAttempt
        ? latestAttempt.status === "completed"
          ? "Completed"
          : "In Progress"
        : "Not Started";

      return {
        id: test.id,
        test_name: test.name,
        duration: test.duration,
        total_questions: 160,
        status,
      };
    });

    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.get("/test/:id", async (req, res, next) => {
  try {
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("id,name,duration")
      .eq("id", req.params.id)
      .single();
    if (testError) throw testError;

    const questions = await fetchTestDetails(req.params.id);
    res.json({ test, questions });
  } catch (error) {
    next(error);
  }
});

router.post("/start-test", async (req, res, next) => {
  try {
    const { userId, testId, mode } = req.body;
    if (!userId || !testId) throw new ApiError(400, "userId and testId are required");

    if (mode === "resume") {
      const { data: inProgressAttempt, error } = await supabase
        .from("attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("test_id", testId)
        .eq("status", "in_progress")
        .order("attempt_number", { ascending: false })
        .maybeSingle();
      if (error) throw error;
      if (!inProgressAttempt) throw new ApiError(404, "No in-progress attempt found");
      return res.json({ attempt: inProgressAttempt });
    }

    const { data: latestAttempt, error: latestError } = await supabase
      .from("attempts")
      .select("attempt_number")
      .eq("user_id", userId)
      .eq("test_id", testId)
      .order("attempt_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latestError) throw latestError;

    const nextAttemptNumber = (latestAttempt?.attempt_number || 0) + 1;
    const { data: newAttempt, error: createError } = await supabase
      .from("attempts")
      .insert({
        user_id: userId,
        test_id: testId,
        attempt_number: nextAttemptNumber,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .select("*")
      .single();
    if (createError) throw createError;

    res.status(201).json({ attempt: newAttempt });
  } catch (error) {
    next(error);
  }
});

router.post("/save-answer", async (req, res, next) => {
  try {
    const { attemptId, questionId, selectedOptionId } = req.body;
    if (!attemptId || !questionId) throw new ApiError(400, "attemptId and questionId are required");

    const { error } = await supabase.from("answers").upsert(
      {
        attempt_id: attemptId,
        question_id: questionId,
        selected_option_id: selectedOptionId || null,
      },
      { onConflict: "attempt_id,question_id" }
    );
    if (error) throw error;

    res.json({ message: "Answer saved" });
  } catch (error) {
    next(error);
  }
});

router.get("/attempt-answers/:attemptId", async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    if (!attemptId) throw new ApiError(400, "attemptId is required");

    const { data, error } = await supabase
      .from("answers")
      .select("question_id,selected_option_id")
      .eq("attempt_id", attemptId);

    if (error) throw error;

    res.json({ answers: data || [] });
  } catch (error) {
    next(error);
  }
});

router.post("/submit-test", async (req, res, next) => {
  try {
    const { attemptId, testId } = req.body;
    if (!attemptId || !testId) throw new ApiError(400, "attemptId and testId are required");

    const [questions, answersResponse] = await Promise.all([
      fetchTestDetails(testId),
      supabase.from("answers").select("question_id,selected_option_id").eq("attempt_id", attemptId),
    ]);

    if (answersResponse.error) throw answersResponse.error;
    const answerMap = Object.fromEntries(
      answersResponse.data.map((item) => [item.question_id, item.selected_option_id])
    );

    const scoreResult = calculateScores(questions, answerMap);

    const { error: updateError } = await supabase
      .from("attempts")
      .update({
        status: "completed",
        maths_score: scoreResult.subjectScores.Maths,
        physics_score: scoreResult.subjectScores.Physics,
        chemistry_score: scoreResult.subjectScores.Chemistry,
        total_score: scoreResult.total,
        completed_at: new Date().toISOString(),
      })
      .eq("id", attemptId);
    if (updateError) throw updateError;

    res.json({
      maths_score: scoreResult.subjectScores.Maths,
      physics_score: scoreResult.subjectScores.Physics,
      chemistry_score: scoreResult.subjectScores.Chemistry,
      total_score: scoreResult.total,
      detailed_results: scoreResult.detailedResults,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/performance", async (req, res, next) => {
  try {
    const userId = req.query.userId;
    if (!userId) throw new ApiError(400, "userId is required");

    const { data, error } = await supabase
      .from("attempts")
      .select("id,attempt_number,total_score,maths_score,physics_score,chemistry_score,completed_at,tests(name)")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false });
    if (error) throw error;

    res.json(
      data.map((row) => ({
        attempt_id: row.id,
        attempt_number: row.attempt_number,
        test_name: row.tests?.name,
        maths_score: row.maths_score,
        physics_score: row.physics_score,
        chemistry_score: row.chemistry_score,
        total_score: row.total_score,
        attempted_at: row.completed_at,
      }))
    );
  } catch (error) {
    next(error);
  }
});

router.get("/result/:attemptId", async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { data: attempt, error: attemptError } = await supabase
      .from("attempts")
      .select("id,test_id,total_score,maths_score,physics_score,chemistry_score")
      .eq("id", attemptId)
      .single();
    if (attemptError) throw attemptError;

    const [questions, answersResponse] = await Promise.all([
      fetchTestDetails(attempt.test_id),
      supabase.from("answers").select("question_id,selected_option_id").eq("attempt_id", attemptId),
    ]);
    if (answersResponse.error) throw answersResponse.error;

    const answerMap = Object.fromEntries(
      answersResponse.data.map((item) => [item.question_id, item.selected_option_id])
    );
    const scoreResult = calculateScores(questions, answerMap);

    res.json({
      maths_score: attempt.maths_score,
      physics_score: attempt.physics_score,
      chemistry_score: attempt.chemistry_score,
      total_score: attempt.total_score,
      detailed_results: scoreResult.detailedResults,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/student/save-prediction-data
 * Save college prediction data to Google Sheets via Apps Script
 */
router.post("/save-prediction-data", async (req, res, next) => {
  try {
    const { name, mobileNo, rank } = req.body;

    // Validate inputs
    if (!name || !mobileNo || !rank) {
      throw new ApiError(400, "Missing required fields: name, mobileNo, rank");
    }

    // Get Google Sheets Web App URL from environment
    const googleSheetWebAppUrl = process.env.GOOGLE_SHEET_WEB_APP_URL;
    
    if (!googleSheetWebAppUrl) {
      throw new ApiError(500, "Google Sheets integration not configured");
    }

    // Prepare data
    const payload = {
      name: String(name).trim(),
      mobileNo: String(mobileNo).trim(),
      rank: String(rank).trim(),
    };

    // console.log("Sending to Google Apps Script:", payload);
    // console.log("URL:", googleSheetWebAppUrl);

    // Send to Google Apps Script Web App
    const response = await fetch(googleSheetWebAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // console.log("Response Status:", response.status);
    const responseText = await response.text();
    // console.log("Response Text:", responseText);

    if (!response.ok) {
      // console.error("Google Apps Script Error:", response.status, responseText);
      throw new ApiError(500, `Google Sheets error (${response.status}): ${responseText}`);
    }

    res.status(200).json({
      success: true,
      message: "Data saved successfully to Google Sheets",
    });
  } catch (error) {
    // console.error("Save prediction data error:", error.message);
    next(error);
  }
});

export default router;
