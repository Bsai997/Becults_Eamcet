import express from "express";
import { supabase } from "../db/supabase.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const { data, error } = await supabase
      .from("users")
      .select("id,email,role")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      throw new ApiError(404, "User not found");
    }

    res.json({ user: data });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingUser) {
      throw new ApiError(409, "Email already registered. Please login instead.");
    }

    // Create new user with default role 'student'
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email: email,
          role: "student", // Default role is student
        },
      ])
      .select("id,email,role");

    if (insertError) {
      throw insertError;
    }

    if (!newUser || newUser.length === 0) {
      throw new ApiError(500, "Failed to create user");
    }

    res.status(201).json({
      message: "User registered successfully",
      user: newUser[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
