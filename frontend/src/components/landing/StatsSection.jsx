import React, { useState, useEffect } from 'react';
import { Users, User, Star, BookOpen } from 'lucide-react';

export default function StatsSection() {
  const [stats, setStats] = useState({
    activeStudents: 0,
    dailyUsers: 0,
    rating: 0,
    testsConducted: 0
  });

  useEffect(() => {
    // Animate numbers on mount
    const targetStats = {
      activeStudents: 10000,
      dailyUsers: 5000,
      rating: 4.8,
      testsConducted: 50000
    };

    const intervals = {};
    Object.keys(targetStats).forEach(key => {
      let current = 0;
      const target = targetStats[key];
      const step = target / 50;
      
      intervals[key] = setInterval(() => {
        if (current < target) {
          current += step;
          setStats(prev => ({
            ...prev,
            [key]: Math.min(current, target)
          }));
        }
      }, 30);
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, []);

  const statCards = [
    {
      label: 'Active Students',
      value: Math.round(stats.activeStudents),
      suffix: '+',
      icon: Users,
      color: 'from-blue-400 to-blue-600'
    },
    {
      label: 'Daily Users',
      value: Math.round(stats.dailyUsers),
      suffix: '+',
      icon: User,
      color: 'from-green-400 to-green-600'
    },
    {
      label: 'Rating',
      value: stats.rating.toFixed(1),
      suffix: '/5',
      icon: Star,
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      label: 'Tests Conducted',
      value: Math.round(stats.testsConducted),
      suffix: '+',
      icon: BookOpen,
      color: 'from-purple-400 to-purple-600'
    }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 shadow-md hover:shadow-lg transform hover:-translate-y-2 transition text-center animate-slideUp"
                style={{
                  animationDelay: `${idx * 0.15}s`
                }}
              >
                <div className="flex justify-center mb-3">
                  <IconComponent size={40} className="text-gray-700" strokeWidth={1.5} />
                </div>
                <div className="text-4xl font-bold mb-2 text-gray-900">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
