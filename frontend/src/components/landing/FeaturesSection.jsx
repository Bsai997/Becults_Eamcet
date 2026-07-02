import React from 'react';
import { BookOpen, Code2, GraduationCap, BarChart3, FileText } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Chapter-wise Tests',
      description: 'Learn and practice topics chapter by chapter with detailed explanations'
    },
    {
      icon: Code2,
      title: 'Real-time CBT',
      description: 'Experience authentic exam environment with actual EAMCET interface'
    },
    {
      icon: GraduationCap,
      title: 'College Predictor',
      description: 'Predict your dream college based on your rank and cutoff data'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics and performance insights'
    },
    {
      icon: FileText,
      title: 'PDF Reports',
      description: 'Download comprehensive performance reports and analysis as PDF'
    }
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-2 transition text-center"
              >
                <div className="flex justify-center mb-4">
                  <IconComponent size={48} className="text-green-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
