import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (!name.trim()) {
        throw new Error("Name is required");
      }
      if (!email.trim()) {
        throw new Error("Email is required");
      }

      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email");
      }

      // Register user (only email sent to backend)
      const response = await api.post("/auth/register", {
        email: email.toLowerCase().trim(),
      });

      // Login user with the returned user data
      login(response.data.user);

      // Clear form
      setName("");
      setEmail("");

      // Redirect to student dashboard
      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          {/* <p className="text-slate-600 text-sm mt-2">Join BECULTS EAMCET to predict colleges</p> */}
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
            {/* <p className="text-xs text-slate-500 mt-1">Used for display only</p> */}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
            {/* <p className="text-xs text-slate-500 mt-1">Used for login</p> */}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors mt-6"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-600">or</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-slate-700">Already have an account?</p>
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            Login here
          </Link>
        </div>

        {/* Info Box */}
        {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-slate-700">
            <span className="font-semibold">📝 What happens next:</span>
            <br />
            1. Enter your name and email<br />
            2. Create your account<br />
            3. Login with your email<br />
            4. Predict colleges by rank
          </p>
        </div> */}
      </div>
    </div>
  );
}
