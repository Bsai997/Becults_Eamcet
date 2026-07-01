import express from "express";
import { supabase } from "../db/supabase.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router()

/**
 * POST /api/student/predict-colleges
 * Get colleges matching student's rank, caste, gender, and branch
 * Returns 30 colleges above rank + 30 colleges below rank = 60 total
 * 
 * Body: {
 *   rank: number (e.g., 5000),
 *   caste: string (OC, SC, ST, BCA, BCB, BCC, BCD, BCE, OC_EWS),
 *   gender: string (BOYS, GIRLS),
 *   branch?: string (optional filter)
 * }
 * 
 * Returns: {
 *   colleges: [{
 *     id, name, place, instcode, type, branch_code, affiliated,
 *     cutoff_rank, college_fee, established, district
 *   }],
 *   above_rank: [...],  // 30 colleges with cutoff >= student rank
 *   below_rank: [...]   // 30 colleges with cutoff < student rank
 * }
 */
router.post("/predict-colleges", async (req, res, next) => {
  try {
    const { rank, caste, gender, branch } = req.body;

    // Validate inputs
    if (!rank || typeof rank !== "number" || rank <= 0) {
      throw new ApiError(400, "Valid rank (positive number) is required");
    }
    if (!caste || typeof caste !== "string") {
      throw new ApiError(400, "Valid caste is required");
    }
    if (!gender || typeof gender !== "string") {
      throw new ApiError(400, "Valid gender is required");
    }

    // Map caste and gender to column name
    const casteMap = {
      OC: "oc",
      SC: "sc",
      ST: "st",
      BCA: "bca",
      BCB: "bcb",
      BCC: "bcc",
      BCD: "bcd",
      BCE: "bce",
      OC_EWS: "oc_ews",
    };

    const genderMap = {
      BOYS: "boys",
      GIRLS: "girls",
    };

    const casteLower = casteMap[caste.toUpperCase()];
    const genderLower = genderMap[gender.toUpperCase()];

    if (!casteLower || !genderLower) {
      throw new ApiError(400, "Invalid caste or gender value");
    }

    const columnName = `${casteLower}_${genderLower}`;
    console.log("Query Parameters:", { rank, caste, gender, branch, columnName });

    // Helper function to build base query
    const buildBaseQuery = () => {
      let query = supabase
        .from("colleges")
        .select(
          "id,sno,instcode,name,type,place,dist,affiliated,established,branch_code,college_fee," +
            columnName
        )
        .not(columnName, "is", null);

      // Optional: filter by branch
      if (branch && branch.trim()) {
        query = query.eq("branch_code", branch.toUpperCase());
      }
      return query;
    };

    // Get colleges ABOVE rank (cutoff >= student rank) - sorted ascending (lowest first)
    const { data: aboveRankData, error: errorAbove } = await buildBaseQuery()
      .gte(columnName, rank)
      .order(columnName, { ascending: true })
      .limit(30);

    // console.log("Above rank query - Count:", aboveRankData?.length, "Error:", errorAbove);

    if (errorAbove) throw errorAbove;

    // Get colleges BELOW rank (cutoff < student rank) - sorted descending (highest first)
    const { data: belowRankData, error: errorBelow } = await buildBaseQuery()
      .lt(columnName, rank)
      .order(columnName, { ascending: false })
      .limit(30);

    // console.log("Below rank query - Count:", belowRankData?.length, "Error:", errorBelow);

    if (errorBelow) throw errorBelow;

    // If below rank has no results, get additional above rank colleges instead
    let finalAboveRank = aboveRankData || [];
    let finalBelowRank = belowRankData || [];

    if (finalBelowRank.length === 0 && finalAboveRank.length < 60) {
      // Get more above rank colleges if below rank is empty - rebuild query fresh
      const { data: moreAbove, error: errorMoreAbove } = await buildBaseQuery()
        .gte(columnName, rank)
        .order(columnName, { ascending: true })
        .limit(60);

      if (!errorMoreAbove) {
        finalAboveRank = moreAbove || [];
        console.log("Adjusted: Getting more above rank colleges. Total:", finalAboveRank.length);
      } else {
        console.log("Adjusted query error:", errorMoreAbove);
      }
    }    const formatCollege = (college) => ({
      id: college.id,
      sno: college.sno,
      instcode: college.instcode,
      name: college.name,
      type: college.type,
      place: college.place,
      district: college.dist,
      affiliated: college.affiliated,
      established: college.established,
      branch: college.branch_code,
      college_fee: college.college_fee,
      cutoff_rank: college[columnName],
    });

    const formattedAbove = (finalAboveRank || []).map(formatCollege);
    const formattedBelow = (finalBelowRank || []).map(formatCollege);
    const allColleges = [...formattedAbove, ...formattedBelow];

    res.json({
      colleges: allColleges,
      above_rank: formattedAbove,
      below_rank: formattedBelow,
      total: allColleges.length,
      filter: { rank, caste, gender, branch: branch || "all" },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
