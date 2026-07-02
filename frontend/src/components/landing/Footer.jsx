import React from 'react';
import { Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-extrabold mb-4 text-green-400">BECULTS</h3>
            <p className="text-gray-400">
              Your one-stop platform for EAMCET preparation with mock tests, chapter-wise practice, and accurate college predictions.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-extrabold mb-4">Contact Us</h3>
            <p className="text-gray-400 mb-4 flex items-center gap-2">
              <Mail size={20} strokeWidth={1.5} /> <a href="mailto:becults.lfib@gmail.com" className="text-green-400 hover:text-green-300">becults.lfib@gmail.com</a>
            </p>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-extrabold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/becults/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
                title="Follow us on Instagram"
              >
                <img src="/instagram.png" alt="Instagram" className="w-6 h-6" />
              </a>
              <a 
                href="https://www.youtube.com/@iamtrishanth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
                title="Follow us on YouTube"
              >
                <img src="/youtube.png" alt="YouTube" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            © {currentYear} BECULTS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
