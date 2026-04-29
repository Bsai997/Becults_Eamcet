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

export default router;
