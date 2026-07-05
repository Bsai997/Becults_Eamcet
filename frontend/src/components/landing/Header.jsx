import { Bold } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" style={{ fontFamily: "Inter" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-32">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="EAMCET.Cults"
              className="h-48 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#6B7280",
                textDecoration: "none",
                transition: "color 0.2s",
                width: "92px",
                height: "19px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="hover:text-slate-900"
            >
              Home
            </Link>
            <Link
              to="#reviews"
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#6B7280",
                textDecoration: "none",
                transition: "color 0.2s",
                width: "92px",
                height: "19px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="hover:text-slate-900"
            >
              Reviews
            </Link>

            <Link
              to="#counselling"
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#6B7280",
                textDecoration: "none",
                transition: "color 0.2s",
                width: "92px",
                height: "19px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="hover:text-slate-900"
            >
              Counselling
            </Link>

            <Link
              to="#doubts"
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#6B7280",
                textDecoration: "none",
                transition: "color 0.2s",
                width: "92px",
                height: "19px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="hover:text-slate-900"
            >
              Doubts
            </Link>
            <Link
              to="#contact"
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#6B7280",
                textDecoration: "none",
                transition: "color 0.2s",
                width: "92px",
                height: "19px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="hover:text-slate-900"
            >
              Contact us
            </Link>
          </nav>

          {/* Login Button */}
          <Link
            to="/login"
            className="hidden md:flex items-center justify-center text-white font-medium text-sm hover:opacity-90 transition-opacity mr-4"
            style={{
              backgroundColor: "#1A699F",
              width: "102px",
              height: "35px",
              borderRadius: "16px"
            }}
          >
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="#reviews"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link
              to="#counselling"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Counselling
            </Link>
            <Link
              to="#doubts"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Doubts
            </Link>
            <Link
              to="#contact"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact us
            </Link>
            <Link
              to="/login"
              className="w-full text-white font-medium text-center mt-4 flex items-center justify-center"
              style={{
                backgroundColor: "#1A699F",
                height: "35px",
                borderRadius: "16px"
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
