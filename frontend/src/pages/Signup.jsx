import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LockClosedIcon,
  UserIcon,
  EnvelopeIcon,
  IdentificationIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const { loginDemoUser, isSupabaseConfigured } = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!isSupabaseConfigured) {
      const demoUser = {
        id: "demo-" + Date.now(),
        email: formData.email,
        user_metadata: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username || formData.firstName || "User",
        },
      };
      loginDemoUser(demoUser);
      navigate("/dashboard", { replace: true });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMessage(
        err.message === "Failed to fetch"
          ? "Could not connect to Supabase authentication server. Please check your credentials or network."
          : err.message || "An unexpected error occurred during sign up."
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      {/* Logo */}
      <div 
        onClick={() => navigate("/")}
        className="px-8 py-6 flex items-center gap-3 text-xl font-bold flex-shrink-0 text-[#2E3192] cursor-pointer hover:opacity-80 transition max-w-7xl mx-auto w-full"
      >
        <img src="/mindspark-logo.png" alt="MindSpark Logo" className="w-8 h-8 rounded-full shadow-sm object-contain bg-white" />
        <span>MindSpark</span>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-400">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <p className="text-center text-gray-500">Join our platform today!</p>

          {/* Error Popup */}
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-3 rounded-lg mt-4">
              <XCircleIcon className="w-5 h-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* First Name */}
            <div className="relative">
              <IdentificationIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#2E3192] focus:outline-none"
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <IdentificationIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#2E3192] focus:outline-none"
              />
            </div>

            {/* Username */}
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#2E3192] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#2E3192] focus:outline-none"
              />
            </div>

            {/* Password with Toggle */}
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#2E3192] focus:outline-none"
              />
              <div
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2E3192] text-white py-4 rounded-full hover:bg-[#222473] cursor-pointer transition shadow-md"
            >
              Sign Up
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#2E3192] hover:underline bg-none border-none cursor-pointer font-medium"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
