import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">BECULTS.
            <span style={{color:'black'}}>EAMCET</span></div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition"
          >
            Login
          </button>
          <button
            className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition"
          >
            Pricing
          </button>
          <button
            className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition"
          >
            Features
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <button
            onClick={() => {
              navigate('/login');
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50"
          >
            Login
          </button>
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50">
            Pricing
          </button>
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50">
            Features
          </button>
        </div>
      )}
    </nav>
  );
}
