
import express from "express";
import multer from "multer";
import { publishTestSchema, validateSingleCorrectOption } from "../validators/testJsonSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { supabase } from "../db/supabase.js";
import { uploadImageToCloudinary } from "../services/uploadService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Get all students' performance
router.get("/student-performance", async (req, res, next) => {
  try {
    // Get all attempts with user, test, and scores
    const { data: attempts, error: attemptsError } = await supabase
      .from("attempts")
      .select(`id, user_id, test_id, total_score, maths_score, physics_score, chemistry_score, attempt_number, tests(name), users(email)`);
    // console.log("[student-performance] attemptsError:", attemptsError);
    // console.log("[student-performance] attempts data:", attempts);
    if (attemptsError) throw attemptsError;
    if (!attempts) throw new Error("No attempts data returned from Supabase");

    // Aggregate by user, test, and count attempts
    const perfMap = {};
    for (const att of attempts) {
      const key = `${att.user_id}_${att.test_id}`;
      if (!perfMap[key]) {
        perfMap[key] = {
          email: att.users?.email || "",
          test_name: att.tests?.name || "",
          subject_scores: {
            Maths: typeof att.maths_score === "number" && !isNaN(att.maths_score) ? att.maths_score : 0,
            Physics: typeof att.physics_score === "number" && !isNaN(att.physics_score) ? att.physics_score : 0,
            Chemistry: typeof att.chemistry_score === "number" && !isNaN(att.chemistry_score) ? att.chemistry_score : 0,
          },
          total_score: att.total_score || 0,
          attempts: 1,
        };
      } else {
        perfMap[key].attempts += 1;
        // Optionally, keep highest total_score/subject_scores
        if ((att.total_score || 0) > perfMap[key].total_score) {
          perfMap[key].total_score = att.total_score || 0;
          perfMap[key].subject_scores = att.subject_scores || {};
        }
      }
    }
    const perfList = Object.values(perfMap);
    res.json(perfList);
  } catch (error) {
    console.error("[student-performance] error:", error);
    next(error);
  }
});

router.post("/upload-image", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No image file provided");
    }

    const url = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
    res.json({ url });
  } catch (error) {
    next(error);
  }
});

router.post("/parse-json", async (req, res, next) => {
  try {
    const payload = publishTestSchema.parse(req.body);
    if (!validateSingleCorrectOption(payload)) {
      throw new ApiError(400, "Each question must have exactly one correct option");
    }
    res.json({ preview: payload });
  } catch (error) {
    next(error);
  }
});

router.post("/publish-test", async (req, res, next) => {
  try {
    const payload = publishTestSchema.parse(req.body);
    if (!validateSingleCorrectOption(payload)) {
      throw new ApiError(400, "Each question must have exactly one correct option");
    }

    const { data: createdTest, error: testError } = await supabase
      .from("tests")
      .insert({
        name: payload.test_name,
        duration: payload.duration,
      })
      .select("id,name,duration")
      .single();
    if (testError) throw testError;

    for (const subject of payload.subjects) {
      const { data: createdSubject, error: subjectError } = await supabase
        .from("subjects")
        .insert({
          test_id: createdTest.id,
          name: subject.name,
        })
        .select("id")
        .single();
      if (subjectError) throw subjectError;

      for (const question of subject.questions) {
        const { data: createdQuestion, error: questionError } = await supabase
          .from("questions")
          .insert({
            subject_id: createdSubject.id,
            question_text: question.question_text || null,
            question_image_url: question.question_image_url || null,
            explanation: question.explanation,
          })
          .select("id")
          .single();
        if (questionError) throw questionError;

        const optionsPayload = question.options.map((option) => ({
          question_id: createdQuestion.id,
          option_text: option.text || null,
          option_image_url: option.image_url || null,
          is_correct: option.is_correct,
        }));

        const { error: optionError } = await supabase.from("options").insert(optionsPayload);
        if (optionError) throw optionError;
      }
    }

    res.status(201).json({ message: "Test published successfully", test: createdTest });
  } catch (error) {
    next(error);
  }
});

export default router;
