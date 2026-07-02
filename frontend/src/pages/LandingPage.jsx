import React from 'react';
import Navbar from '../components/landing/Navbar';
import Marquee from '../components/landing/Marquee';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ReviewsSection from '../components/landing/ReviewsSection';
import MiniMockTest from '../components/landing/MiniMockTest';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <Marquee />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ReviewsSection />
      <MiniMockTest />
      <Footer />
    </div>
  );
}
