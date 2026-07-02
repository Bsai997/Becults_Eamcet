import React from 'react';
import { User, Star } from 'lucide-react';

export default function ReviewsSection() {
  const reviews = [
    {
      name: 'Sai Pranav',
      college: 'JNTUK',
      review: 'BECULTS helped me score 95%! The mock tests are exactly like the real exam.',
      rating: 5
    },
    {
      name: 'Prabhas',
      college: 'SRKR Engineering college',
      review: 'The college predictor was spot on! Got my dream college. Highly recommend!',
      rating: 4.5
    },
    {
      name: 'Trishanth',
      college: 'Aditya University',
      review: 'Chapter-wise tests with explanations made my preparation so easy.',
      rating: 4
    },
    {
      name: 'Vishnu',
      college: 'VIT-AP',
      review: 'Real-time CBT environment felt like the actual exam. Very helpful!',
      rating: 5
    }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Student Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-md hover:shadow-xl transition border-2 border-green-200"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4 italic">
                "{review.review}"
              </p>

              {/* Student Info */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <User size={24} className="text-green-600" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-600">{review.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
