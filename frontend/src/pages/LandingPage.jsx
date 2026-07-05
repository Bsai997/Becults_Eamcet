import React from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/landing/HeroSection';
export default function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Header />
      <HeroSection/>
      <Footer />
    </div>
  );
}
