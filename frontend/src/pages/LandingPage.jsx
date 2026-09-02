import React from "react";
import { Link } from "react-router-dom";
import LandingImage from "../assets/images/landing-page-image.jpg";
import {
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen font-sans selection:bg-[#2E3192] selection:text-white transition-colors duration-300 ${
      dark ? "bg-[#0f1117] text-gray-100" : "bg-gradient-to-tr from-[#f9fafc] via-[#f3f4fd] to-[#f9fafc] text-gray-900"
    }`}>

      {/* Decorative Blur Background Orbs */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl -z-10 ${
        dark ? "bg-blue-900/20" : "bg-blue-100/40"
      }`} />
      <div className={`absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full blur-3xl -z-10 ${
        dark ? "bg-purple-900/20" : "bg-purple-100/40"
      }`} />

      {/* Navbar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        dark ? "bg-[#0f1117]/80 border-white/10" : "bg-white/70 border-gray-100/80"
      }`}>
        <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/mindspark-logo.png"
              alt="MindSpark Logo"
              className="w-10 h-10 rounded-full shadow-sm object-contain bg-white"
            />
            <span className="text-3xl font-black tracking-tighter text-[#2E3192]">
              MindSpark<span className="text-[#2E3192] opacity-80">.</span>
            </span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-2.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
                dark
                  ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20"
                  : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <Link
              to="/login"
              className={`font-bold text-sm transition-colors ${
                dark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-[#2E3192]"
              }`}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="bg-[#2E3192] text-white text-sm px-6 py-2.5 rounded-full font-bold hover:bg-[#222473] shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="text-center pt-16 sm:pt-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8 ${
            dark ? "text-white" : "text-gray-900"
          }`}>
            Elevate your study sessions with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E3192] via-blue-500 to-indigo-500">
              intelligent AI tools.
            </span>
          </h1>

          <p className={`text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed font-medium ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}>
            Turn your tedious notes, extensive PDFs, and lecture slides into highly engaging, interactive flashcards and multiple-choice quizzes in seconds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link
              to="/signup"
              className="bg-[#2E3192] text-white text-base sm:text-lg px-9 py-4 rounded-full font-bold hover:bg-[#222473] shadow-xl shadow-blue-900/20 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
            >
              Start for Free
            </Link>

            <a
              href="#explore"
              className={`border-2 text-base sm:text-lg px-9 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                dark
                  ? "bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/30"
                  : "bg-white text-[#2E3192] border-[#2E3192]/20 hover:border-[#2E3192] hover:bg-gray-50 shadow-sm"
              }`}
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Device Image Preview */}
        <div id="explore" className="relative max-w-5xl mx-auto mb-28">
          <div className={`rounded-3xl overflow-hidden shadow-2xl border-4 transition-colors duration-300 ${
            dark ? "border-white/10 shadow-black/60" : "border-white shadow-gray-200"
          }`}>
            <img
              src={LandingImage}
              alt="MindSpark Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Features / Benefits Section */}
        <section className={`py-20 rounded-[3rem] shadow-sm mb-20 px-6 sm:px-12 border transition-colors duration-300 ${
          dark ? "bg-[#161926] border-white/10 shadow-black/40" : "bg-white border-gray-100"
        }`}>
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-[#2E3192] font-black text-xs uppercase tracking-widest mb-3 bg-[#2E3192]/10 inline-block px-3 py-1 rounded-md">
              Core Advantages
            </h2>
            <h3 className={`text-3xl md:text-5xl font-black mb-16 ${dark ? "text-white" : "text-gray-900"}`}>
              Everything you need to ace your exams.
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className={`p-8 rounded-3xl transition-all border group ${
                dark ? "bg-white/5 border-white/5 hover:border-[#2E3192]/40 hover:bg-[#2E3192]/10" : "bg-gray-50 border-gray-100 hover:bg-[#2E3192]/5 hover:border-[#2E3192]/30"
              }`}>
                <RocketLaunchIcon className="w-12 h-12 text-[#2E3192] mb-6 transform group-hover:scale-110 transition-transform" />
                <h4 className={`font-black text-xl mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
                  Lightning Fast Generation
                </h4>
                <p className={`leading-relaxed text-sm font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  Upload PDFs, Word docs, PowerPoint decks, or text and let AI extract key concepts into study decks in under two seconds.
                </p>
              </div>

              <div className={`p-8 rounded-3xl transition-all border group ${
                dark ? "bg-white/5 border-white/5 hover:border-[#2E3192]/40 hover:bg-[#2E3192]/10" : "bg-gray-50 border-gray-100 hover:bg-[#2E3192]/5 hover:border-[#2E3192]/30"
              }`}>
                <PuzzlePieceIcon className="w-12 h-12 text-[#2E3192] mb-6 transform group-hover:scale-110 transition-transform" />
                <h4 className={`font-black text-xl mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
                  Interactive Quizzes
                </h4>
                <p className={`leading-relaxed text-sm font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  Test your comprehension with color-coded multiple choice questions, instant feedback, and automatic quiz history tracking.
                </p>
              </div>

              <div className={`p-8 rounded-3xl transition-all border group ${
                dark ? "bg-white/5 border-white/5 hover:border-[#2E3192]/40 hover:bg-[#2E3192]/10" : "bg-gray-50 border-gray-100 hover:bg-[#2E3192]/5 hover:border-[#2E3192]/30"
              }`}>
                <ArrowPathIcon className="w-12 h-12 text-[#2E3192] mb-6 transform group-hover:scale-110 transition-transform" />
                <h4 className={`font-black text-xl mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
                  Active Recall Built-in
                </h4>
                <p className={`leading-relaxed text-sm font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  Flip through 3D flashcards with shuffle mode, focus view, and keyboard navigation to maximize long-term memory retention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-16 mb-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-[#2E3192] font-black text-xs uppercase tracking-widest mb-3 bg-[#2E3192]/10 inline-block px-3 py-1 rounded-md">
              The Process
            </h2>
            <h3 className={`text-3xl md:text-5xl font-black mb-16 ${dark ? "text-white" : "text-gray-900"}`}>
              Three steps to mastery.
            </h3>

            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
              <div className={`flex-1 max-w-sm p-6 rounded-3xl border ${
                dark ? "bg-[#161926] border-white/10" : "bg-white border-gray-100 shadow-sm"
              }`}>
                <div className="w-16 h-16 mx-auto bg-[#2E3192] text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg mb-5 shadow-[#2E3192]/30">
                  1
                </div>
                <h4 className={`font-black text-lg mb-2 ${dark ? "text-white" : "text-gray-900"}`}>Upload</h4>
                <p className={`text-xs sm:text-sm font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  Drag your syllabus, slide decks, Word docs, or PDF chapters directly into the study workspace.
                </p>
              </div>

              <div className={`hidden md:block w-12 border-t-2 border-dashed ${dark ? "border-white/20" : "border-gray-300"}`}></div>

              <div className={`flex-1 max-w-sm p-6 rounded-3xl border ${
                dark ? "bg-[#161926] border-white/10" : "bg-white border-gray-100 shadow-sm"
              }`}>
                <div className="w-16 h-16 mx-auto bg-[#2E3192] text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg mb-5 shadow-[#2E3192]/30">
                  2
                </div>
                <h4 className={`font-black text-lg mb-2 ${dark ? "text-white" : "text-gray-900"}`}>Generate</h4>
                <p className={`text-xs sm:text-sm font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  MindSpark's AI analyzes your document and extracts the perfect study deck without duplicates.
                </p>
              </div>

              <div className={`hidden md:block w-12 border-t-2 border-dashed ${dark ? "border-white/20" : "border-gray-300"}`}></div>

              <div className={`flex-1 max-w-sm p-6 rounded-3xl border ${
                dark ? "bg-[#161926] border-white/10" : "bg-white border-gray-100 shadow-sm"
              }`}>
                <div className="w-16 h-16 mx-auto bg-[#2E3192] text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg mb-5 shadow-[#2E3192]/30">
                  3
                </div>
                <h4 className={`font-black text-lg mb-2 ${dark ? "text-white" : "text-gray-900"}`}>Master</h4>
                <p className={`text-xs sm:text-sm font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  Review interactive flip cards and ace timed quizzes with full question breakdown and score history.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className={`border-t py-12 transition-colors duration-300 ${
        dark ? "bg-[#0c0d12] border-white/10 text-gray-400" : "bg-white border-gray-200 text-gray-500"
      }`}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/mindspark-logo.png" alt="MindSpark Logo" className="w-7 h-7 rounded-full object-contain bg-white" />
            <span className="text-lg font-black tracking-tighter text-[#2E3192]">
              MindSpark<span className="opacity-80">.</span>
            </span>
          </div>
          <p className="text-xs font-medium">
            © {new Date().getFullYear()} MindSpark. Elevating education through AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
