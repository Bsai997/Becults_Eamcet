import express from "express";
import { supabase } from "../db/supabase.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router();

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

    // Normalize branch payload into an uppercase array or empty array
    let branchList = [];
    if (Array.isArray(branch)) {
      branchList = branch.map((b) => String(b).trim().toUpperCase()).filter(Boolean);
    } else if (typeof branch === "string" && branch.trim()) {
      branchList = [branch.trim().toUpperCase()];
    }

    // Helper function to build base query
    const buildBaseQuery = () => {
      let query = supabase
        .from("colleges")
        .select(
          "id,sno,instcode,name,type,place,dist,affiliated,established,branch_code,college_fee," +
            columnName
        )
        .not(columnName, "is", null);

      // Filter by single or multiple branches
      if (branchList.length === 1) {
        query = query.eq("branch_code", branchList[0]);
      } else if (branchList.length > 1) {
        query = query.in("branch_code", branchList);
      }

      return query;
    };

    // Get colleges ABOVE rank (cutoff >= student rank) - sorted ascending (lowest first)
    const { data: aboveRankData, error: errorAbove } = await buildBaseQuery()
      .gte(columnName, rank)
      .order(columnName, { ascending: true })
      .limit(80);

    if (errorAbove) throw errorAbove;

    // Get colleges BELOW rank (cutoff < student rank) - sorted descending (highest first)
    const { data: belowRankData, error: errorBelow } = await buildBaseQuery()
      .lt(columnName, rank)
      .order(columnName, { ascending: false })
      .limit(20);

    if (errorBelow) throw errorBelow;

    // If below rank has no results, get additional above rank colleges instead
    let finalAboveRank = aboveRankData || [];
    let finalBelowRank = belowRankData || [];

    if (finalBelowRank.length === 0 && finalAboveRank.length < 60) {
      const { data: moreAbove, error: errorMoreAbove } = await buildBaseQuery()
        .gte(columnName, rank)
        .order(columnName, { ascending: true })
        .limit(80);

      if (!errorMoreAbove) {
        finalAboveRank = moreAbove || [];
      } else {
        console.log("Adjusted query error:", errorMoreAbove);
      }
    }

    const formatCollege = (college) => ({
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
      filter: { 
        rank, 
        caste, 
        gender, 
        branch: branchList.length > 0 ? branchList : "all" 
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;