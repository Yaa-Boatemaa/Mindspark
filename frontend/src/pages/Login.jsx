import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginDemoUser, isSupabaseConfigured } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // Clear error when typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      const demoUser = {
        id: "demo-user",
        email: formData.email,
        user_metadata: {
          username: formData.email.split("@")[0] || "User",
        },
      };
      loginDemoUser(demoUser);
      navigate("/dashboard", { replace: true });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.email.split("@")[0] || "User",
          }
        }
      });

      if (error) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(
        err.message === "Failed to fetch"
          ? "Could not connect to Supabase authentication server. Please check your credentials or network."
          : err.message || "An unexpected error occurred during sign in."
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-[#eceeff] via-[#f5eefc] to-[#eef9ff] font-sans text-gray-900 relative overflow-hidden animate-gradient-slow">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl -z-10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/40 blur-3xl -z-10 animate-pulse duration-[10s]" />

      {/* Header/Logo */}
      <header className="w-full px-8 py-6 max-w-7xl mx-auto flex justify-between items-center z-10">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-2xl font-extrabold text-[#2E3192] cursor-pointer hover:opacity-80 transition"
        >
          <img src="/mindspark-logo.png" alt="MindSpark Logo" className="w-8 h-8 rounded-full shadow-sm object-contain bg-white" />
          <span>MindSpark</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 z-10">
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/60 transition-transform duration-300 hover:scale-[1.01]">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">
            Welcome back
          </h2>
          <p className="text-center text-gray-500 mt-2 font-medium">
            Sign in to access your dashboard
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-2xl mt-6 border border-red-100 transition-all animate-shake">
              <XCircleIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Username or Email</label>
              <div className="relative group">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 transition-colors group-focus-within:text-[#2E3192]" />
                <input
                  type="text"
                  name="email"
                  placeholder="Username or email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#2E3192]/20 focus:border-[#2E3192] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 transition-colors group-focus-within:text-[#2E3192]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#2E3192]/20 focus:border-[#2E3192] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2E3192] text-white py-3.5 rounded-2xl hover:bg-[#222473] active:scale-[0.98] cursor-pointer transition-all duration-200 font-bold shadow-lg shadow-blue-900/10 hover:shadow-blue-900/25 mt-4"
            >
              Sign In
            </button>

            {/* Signup Redirect */}
            <p className="text-center text-sm text-gray-500 mt-6 font-medium">
              New to MindSpark?{" "}
              <a href="/signup" className="text-[#2E3192] hover:underline font-bold transition-all">
                Sign Up for free
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
