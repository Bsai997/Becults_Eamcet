import React from 'react';

export default function Marquee() {
  const quotes = [
    "� Full length mock test and analysis",
    "💻 Chapter wise test with explanation",
    "⭐ Real reviews by btech student",
    "🎯 Predict your dream college",
    "📈 Performance analytics and insights",
    "⚡ Instant results and feedback"
  ];

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 py-4 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {quotes.map((quote, idx) => (
          <div
            key={idx}
            className="text-green-700 font-semibold text-lg px-8 flex items-center"
          >
            <span>{quote}</span>
            <span className="mx-4">•</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {quotes.map((quote, idx) => (
          <div
            key={`dup-${idx}`}
            className="text-green-700 font-semibold text-lg px-8 flex items-center"
          >
            <span>{quote}</span>
            <span className="mx-4">•</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
