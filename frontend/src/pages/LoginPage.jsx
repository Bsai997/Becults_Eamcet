import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if email exists in DB with the selected role
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      console.log('Login attempt with email:', email, 'role:', role);
      console.log('API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role }),
      });

      console.log('Backend response status:', response.status);
      const data = await response.json();
      console.log('Backend response data:', data);

      if (!response.ok) {
        const errorMsg = data.message || 'User not found';
        console.error('Login error:', errorMsg);
        setError(errorMsg);
        return;
      }

      // Email verified, proceed with login
      const userData = { 
        email: data.user.email, 
        role: data.user.role,
        id: data.user.id 
      };
      console.log('User data to store:', userData);
      login(userData);
      
      console.log('Navigation to:', userData.role === 'admin' ? '/admin' : '/student');
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      console.error('Login catch error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F5F6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <img 
            src='/logo.png'
            alt="EAMCET.Cults Logo"
            className="h-20 w-400 mx-auto object-contain mb-4"
          />
          {/* <p className="text-gray-600">Welcome back! Sign in to your account</p> */}
        </div>

        {/* Login Card */}
        <div className="bg-[#F2F5F6] rounded-xl shadow-lg p-10">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Login As
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Student</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Admin</span>
                </label>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1A699F] transition"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A699F] text-white py-3 rounded-lg font-bold hover:bg-[#1A699F] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#1A699F] font-semibold transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Demo Info */}
        
      </div>
    </div>
  );
}
