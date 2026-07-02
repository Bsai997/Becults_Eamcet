import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PredictCollegeModal from '../PredictCollegeModal';
import CollegeResultsTable from '../CollegeResultsTable';

export default function HeroSection() {
  const navigate = useNavigate();
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [collegeResults, setCollegeResults] = useState(null);
  const [resultsFilter, setResultsFilter] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  const handleStartTest = () => {
    navigate('/login');
  };

  const handleCollegeReviews = () => {
    window.open('https://becults-colleges-review.vercel.app/', '_blank');
  };

  const handlePredictResults = (data) => {
    setCollegeResults(data.colleges);
    setResultsFilter(data.filter);
    setResultsData(data);
    setShowPredictModal(false);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-green-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-3 md:mb-4 leading-tight">
            BECULTS.EAMCET
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-green-700 font-semibold mb-4 md:mb-6">
            ni seat nuve kotaliii
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto px-2">
            Prepare for EAMCET with comprehensive mock tests, chapter-wise practice, real student reviews, and accurate college predictions powered by AI. Your journey to your dream college starts here.
          </p>

          {/* Three Buttons */}
          <div className="flex flex-col sm:flex-col md:grid md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-center items-center w-full max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto px-2">
            <button
              onClick={handleStartTest}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-green-600 text-white font-bold text-sm sm:text-base rounded-lg hover:bg-green-700 transition transform hover:scale-105 shadow-lg active:scale-95"
            >
              Start Test
            </button>

            <button
              onClick={() => {
                console.log('Predict Colleges clicked');
                setShowPredictModal(true);
              }}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white font-bold text-sm sm:text-base rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg active:scale-95"
            >
              Predict Colleges
            </button>

            <button
              onClick={handleCollegeReviews}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-purple-600 text-white font-bold text-sm sm:text-base rounded-lg hover:bg-purple-700 transition transform hover:scale-105 shadow-lg active:scale-95"
            >
              College Reviews
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

      {/* College Results Table - Reused from StudentDashboard */}
      {collegeResults && resultsData && (
        <CollegeResultsTable
          colleges={collegeResults}
          filter={resultsFilter}
          aboveRank={resultsData.above_rank || []}
          belowRank={resultsData.below_rank || []}
          onClose={() => {
            setCollegeResults(null);
            setResultsFilter(null);
            setResultsData(null);
          }}
        />
      )}
    </>
  );
}
