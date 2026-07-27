import { ArrowRight, Target, Megaphone, MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PredictCollegeModal from "../PredictCollegeModal";
import { useEffect } from 'react';

function ReviewIcon() {
  return (
    <span className="relative inline-flex shrink-0">
      <MessageSquare size={20} strokeWidth={2} />
      <Star
        size={8}
        className="absolute -top-0.5 -right-1 fill-current stroke-current"
        strokeWidth={2}
      />
    </span>
  );
}

function InfoTooltip() {
  return (
    <div className="relative w-full md:w-[420px] mt-3 md:mt-2">
      <div
        className="absolute -top-2.5 left-8 w-0 h-0"
        style={{
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "10px solid #1A699F",
        }}
      />
      <div
        className="rounded-lg px-4 py-3 text-white text-sm font-medium text-center md:text-left"
        style={{ backgroundColor: "#1A699F" }}
      >
        <span className="font-bold">First,</span> check{" "}
        <span className="font-bold">colleges</span> around your{" "}
        <span className="font-bold">EAMCET rank</span> and{" "}
        <span className="font-bold">download the list.</span>
      </div>
    </div>
  );
}

const buttonBase =
  "flex items-center justify-between gap-1 rounded-full font-semibold text-base transition-opacity w-full md:w-[280px] px-10 py-3.5";

export default function HeroSection() {
  const navigate = useNavigate();
  const [showPredictModal, setShowPredictModal] = useState(false);

  const handlePredictResults = (data) => {
    setShowPredictModal(false);
    navigate("/college-results", { state: data });
  };
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-slate-600">
            Trusted by Inter Students
          </p>
        </div>

        <div className="text-center mb-90">
          <h1 className="text-4xl md:text-5xl font-extrabold  leading-tight">
            Your <span style={{ color: "#1A699F" }}>EAMCET</span> Rank
            <br />
            with <span style={{ color: "#D3540D" }}>Seniors</span>{" "}
            <span style={{ color: "#1A699F" }}>Suggestion</span>
            <br />
            = <span style={{ color: "#1A699F" }}>Dream</span> College
          </h1>
        </div>

        <div className="text-center mb-10">
          <p className="text-base md:text-lg text-slate-700 max-w-2xl mx-auto">
            Built by Engineering Students. Helping you with College Predictor,
            College Reviews, Mock Tests & Counselling—based on real student
            experiences
          </p>
        </div>

        <div className="mx-auto max-w-md md:max-w-none">
          <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-3 md:gap-2">
            <div className="flex flex-col items-center md:items-start w-full md:w-auto">

              <button
                onClick={() => {
                  if (window.gtag) {
                    window.gtag("event", "college_predictor_click");
                  }

                  setShowPredictModal(true);
                }}
                className={`${buttonBase} text-white hover:opacity-90`}
                style={{ backgroundColor: "#D3540D" }}
              >
                <Target size={20} className="shrink-0" />
                <span>College Predictor</span>
                <ArrowRight size={18} className="shrink-0" />
              </button>

              <InfoTooltip />
            </div>

            <button
              type="button"
              onClick={() =>
              (window.location.href =
                "https://becults-colleges-review.vercel.app/")
              }
              className={`${buttonBase} bg-white border-2 border-black text-black hover:bg-slate-50`}
            >
              <ReviewIcon />
              <span>College Reviews</span>
              <ArrowRight size={18} className="shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Predict College Modal */}
      <PredictCollegeModal
        isOpen={showPredictModal}
        onClose={() => setShowPredictModal(false)}
        onResults={handlePredictResults}
      />
    </section>
  );
}
