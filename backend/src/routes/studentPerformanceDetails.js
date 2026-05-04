import express from "express";
import { supabase } from "../db/supabase.js";

const router = express.Router();

// Get all attempts for a student and test
router.get("/details", async (req, res, next) => {
  try {
    const { email, test_name } = req.query;
    if (!email || !test_name) return res.status(400).json({ message: "Missing email or test_name" });

    // Get user id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    if (userError || !user) return res.status(404).json({ message: "User not found" });

    // Get test id
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("id")
      .eq("name", test_name)
      .single();
    if (testError || !test) return res.status(404).json({ message: "Test not found" });

    // Get all attempts for this user and test
    const { data: attempts, error: attemptsError } = await supabase
      .from("attempts")
      .select("id, attempt_number, total_score, maths_score, physics_score, chemistry_score, status, started_at, completed_at")
      .eq("user_id", user.id)
      .eq("test_id", test.id)
      .order("attempt_number", { ascending: true });
    if (attemptsError) throw attemptsError;

    res.json(attempts);
  } catch (error) {
    next(error);
  }
});

export default router;
