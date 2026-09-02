import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import QuizHistory from "../components/QuizHistory";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const confirmLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className={`min-h-screen text-gray-900 dark:text-gray-100 font-sans relative overflow-hidden transition-colors duration-300 ${dark ? "bg-[#0f1117]" : "bg-gradient-to-tr from-[#f9fafc] via-[#f3f4fd] to-[#f9fafc]"}`}>
      {/* Decorative background orbs */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl -z-10 ${dark ? "bg-blue-900/20" : "bg-blue-100/30"}`} />
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl -z-10 ${dark ? "bg-purple-900/20" : "bg-purple-100/30"}`} />

      {/* Navbar */}
      <header className={`sticky top-0 backdrop-blur-md border-b z-40 ${dark ? "bg-[#0f1117]/80 border-white/10" : "bg-white/70 border-gray-100/80"}`}>
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition"
          >
            <img src="/mindspark-logo.png" alt="MindSpark Logo" className="w-9 h-9 rounded-full shadow-sm object-contain bg-white" />
            <span className="text-2xl font-extrabold text-[#2E3192]">MindSpark</span>
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-3">

            {user && (
              <div className={`flex items-center gap-2 font-semibold rounded-full px-4 py-2 text-sm border ${dark ? "text-gray-200 bg-white/5 border-white/10" : "text-gray-700 bg-gray-50 border-gray-100"}`}>
                <UserCircleIcon className="w-5 h-5 text-[#2E3192]" />
                <span>{user.user_metadata?.username || "User"}</span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-2.5 rounded-full border transition-all active:scale-95 cursor-pointer ${dark ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20" : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"}`}
            >
              {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 bg-[#2E3192]/10 hover:bg-[#2E3192]/20 text-[#2E3192] text-sm px-4 py-2.5 rounded-full font-bold cursor-pointer transition-all active:scale-[0.98]"
            >
              <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Content */}
      <main className="max-w-7xl mx-auto pt-12 px-6 pb-24 text-center">
        <div className="max-w-3xl mx-auto mb-10">
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight ${dark ? "text-white" : "text-gray-900"}`}>
            Study Generator Workspace
          </h1>
          <p className={`mt-3 text-lg font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Upload text, PDF, Word, or PowerPoint files to generate premium study decks.
          </p>
        </div>

        <div>
          <FileUploader />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50 animate-fade-in">
          <div className={`p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border ${dark ? "bg-[#1a1d2e] border-white/10 text-white" : "bg-white border-gray-100 text-gray-900"}`}>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              Sign Out
            </h3>
            <p className={`mb-6 font-medium text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Are you sure you want to log out of your session?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white font-bold px-4 py-2.5 rounded-2xl hover:bg-red-700 active:scale-[0.98] cursor-pointer transition"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`flex-1 font-bold px-4 py-2.5 rounded-2xl active:scale-[0.98] cursor-pointer transition ${dark ? "bg-white/10 text-gray-200 hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz History Modal */}
      <QuizHistory isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
    </div>
  );
};

export default Dashboard;
