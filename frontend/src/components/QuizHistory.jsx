import React, { useState, useEffect } from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import QuizReviewCard from "./QuizReviewCard";

const STORAGE_KEY = "mindspark_quiz_history";

export const getQuizHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load quiz history:", e);
    return [];
  }
};

export const saveQuizAttempt = (attempt) => {
  try {
    const history = getQuizHistory();
    const updated = [attempt, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50))); // keep latest 50
    window.dispatchEvent(new Event("mindspark_history_updated"));
    return updated;
  } catch (e) {
    console.error("Failed to save quiz attempt:", e);
    return [];
  }
};

export const clearQuizHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("mindspark_history_updated"));
  } catch (e) {
    console.error("Failed to clear quiz history:", e);
  }
};

const QuizHistory = ({ isOpen, onClose }) => {
  const { dark } = useTheme();
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const loadHistory = () => {
    setHistory(getQuizHistory());
  };

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener("mindspark_history_updated", handleUpdate);
    return () => window.removeEventListener("mindspark_history_updated", handleUpdate);
  }, []);

  if (!isOpen) return null;

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire quiz history?")) {
      clearQuizHistory();
      setHistory([]);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className={`w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
          dark ? "bg-[#161926] border-white/10 text-gray-100" : "bg-white border-gray-100 text-gray-900"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${dark ? "border-white/10" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E3192]/10 flex items-center justify-center text-[#2E3192]">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">Quiz History</h2>
              <p className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Review your answered questions, scores, and past quiz attempts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                title="Clear all history"
                className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer active:scale-95 ${
                  dark
                    ? "text-red-400 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40"
                    : "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
                }`}
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition cursor-pointer active:scale-95 ${
                dark ? "bg-white/10 hover:bg-white/20 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {history.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${dark ? "bg-white/5" : "bg-gray-100"}`}>
                <DocumentTextIcon className={`w-8 h-8 ${dark ? "text-gray-500" : "text-gray-400"}`} />
              </div>
              <h3 className="text-base font-bold mb-1">No Quiz History Yet</h3>
              <p className={`text-xs max-w-sm mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Complete interactive quizzes in MindSpark to automatically track answered questions and study scores here.
              </p>
            </div>
          ) : (
            history.map((attempt) => {
              const isExpanded = expandedId === attempt.id;
              const percentage = Math.round((attempt.score / (attempt.totalQuestions || 1)) * 100);
              const isGoodScore = percentage >= 70;

              return (
                <div
                  key={attempt.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    dark ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-gray-50/80 border-gray-200/80 hover:border-gray-300"
                  }`}
                >
                  {/* Summary Bar (Clickable) */}
                  <div
                    onClick={() => toggleExpand(attempt.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black flex-shrink-0 border ${
                          isGoodScore
                            ? dark
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : dark
                            ? "bg-amber-950/40 text-amber-400 border-amber-800/40"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span className="text-sm leading-none">{attempt.score}/{attempt.totalQuestions}</span>
                        <span className="text-[9px] opacity-80 mt-0.5">{percentage}%</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-sm sm:text-base truncate">
                            {attempt.title || "Study Quiz Attempt"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {formatDate(attempt.timestamp)}
                          </span>
                          <span>•</span>
                          <span>{attempt.questions?.length || 0} Questions</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => handleDeleteItem(e, attempt.id)}
                        className={`p-2 rounded-xl transition hover:text-red-500 cursor-pointer ${
                          dark ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-200"
                        }`}
                        title="Delete attempt"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      <div
                        className={`p-2 rounded-xl border ${
                          dark ? "bg-white/5 border-white/10 text-gray-300" : "bg-white border-gray-200 text-gray-700"
                        }`}
                      >
                        {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Question Breakdown */}
                  {isExpanded && (
                    <div
                      className={`p-4 sm:p-5 border-t space-y-4 animate-fade-in ${
                        dark ? "border-white/10 bg-black/20" : "border-gray-200 bg-white"
                      }`}
                    >
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2E3192]">
                        Question Breakdown & Explanations
                      </h4>

                      <div className="space-y-4">
                        {attempt.questions?.map((q, qIndex) => (
                          <QuizReviewCard
                            key={qIndex}
                            index={qIndex}
                            total={attempt.questions.length}
                            question={q.question}
                            options={q.options}
                            selectedAnswer={q.selectedAnswer}
                            correctAnswer={q.correctAnswer}
                            isCorrect={q.isCorrect}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${dark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2E3192] hover:bg-[#222473] text-white rounded-xl font-bold cursor-pointer transition active:scale-95 text-sm shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;
