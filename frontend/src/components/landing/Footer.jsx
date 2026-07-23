
import React from 'react';
import { Mail } from 'lucide-react';

function InstagramIcon() {
  return (
    <svg
      xmlns="http://w3.org"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      xmlns="http://w3.org"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Mobile layout */}
        <div className="space-y-4 mb-4 md:hidden">
          <div>
            <img
              src="/logo%20white.png"
              alt="EAMCET.Cults"
              className="h-20 w-auto max-w-full mb-2 object-contain object-left"
            />
            <p className="text-gray-400 text-sm">
              Your one-stop platform for EAMCET preparation with mock tests, chapter-wise practice, and accurate college predictions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-extrabold mb-2 text-[#1A699F]">Contact Us</h3>
            <p className="text-gray-400 flex items-center gap-2 text-sm">
              <Mail size={18} strokeWidth={1.5} className="text-white" />{' '}
              <a href="mailto:becults.lfib@gmail.com" className="hover:opacity-80" style={{ color: 'white' }}>
                becults.lfib@gmail.com
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-lg font-extrabold mb-2 text-[#1A699F]">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition hover:scale-110"
                title="Follow us on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition hover:scale-110"
                title="Follow us on YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>
          {/* New Section for Mobile */}
          <div>
            <h3 className="text-lg font-extrabold mb-2 text-[#1A699F]">Developed By</h3>
            <p className="text-white text-sm mb-2">Bommi sai</p>
            <p className="text-gray-400 flex items-center gap-2 text-sm">
              <Mail size={20} strokeWidth={1.5} className="text-white" />{' '}
              <a href="mailto:bommsai23@gmail.com" className="hover:opacity-80 text-white">
                 bommisai23@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block mb-4">
          {/* Grid column numbers increased from 3 to 4 */}
          <div className="grid grid-cols-4 gap-x-8 items-center mb-2">
            <img src="/logo%20white.png" alt="EAMCET.Cults" className="h-32 w-auto max-w-full object-contain object-left" />
            <h3 className="text-xl font-extrabold text-[#1A699F]">Contact Us</h3>
            <h3 className="text-xl font-extrabold text-[#1A699F]">Follow Us</h3>
            <h3 className="text-xl font-extrabold text-[#1A699F]">Developed By</h3>
          </div>
          <div className="grid grid-cols-4 gap-x-8 items-start">
            <p className="text-gray-400">
              Your one-stop platform for EAMCET preparation with mock tests, chapter-wise practice, and accurate college predictions.
            </p>
            <p className="text-gray-400 flex items-center gap-2">
              <Mail size={20} strokeWidth={1.5} className="text-white" />{' '}
              <a href="mailto:becults.lfib@gmail.com" className="hover:opacity-80" style={{ color: 'white' }}>
                becults.lfib@gmail.com
              </a>
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition hover:scale-110"
                title="Follow us on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition hover:scale-110"
                title="Follow us on YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
            {/* New Section for Desktop */}
            <div>
              <p className="text-white mb-1">Bommi sai</p>
              <p className="text-gray-400 flex items-center gap-2">
              <Mail size={20} strokeWidth={1.5} className="text-white" />{' '}
                <a href="mailto:bommsai23@gmail.com" className="hover:opacity-80 text-white">
                  bommsai23@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-4">
          <p className="text-center text-gray-400">© {currentYear} BECULTS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
