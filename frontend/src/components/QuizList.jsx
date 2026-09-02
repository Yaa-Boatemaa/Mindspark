import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  ClockIcon,
  EyeIcon
} from "@heroicons/react/24/solid";
import { useTheme } from "../context/ThemeContext";
import QuizHistory, { saveQuizAttempt } from "./QuizHistory";
import QuizReviewCard from "./QuizReviewCard";

const QuizList = ({ quiz, fileName, onClose, onGenerateNew }) => {
  const { dark } = useTheme();
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [answers, setAnswers] = useState(Array(quiz.length).fill(null));
  const [answeredQuestions, setAnsweredQuestions] = useState(Array(quiz.length).fill(false));
  const [selectedAnswers, setSelectedAnswers] = useState(Array(quiz.length).fill(""));
  const [showScore, setShowScore] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [hasSavedAttempt, setHasSavedAttempt] = useState(false);

  if (!quiz || !quiz.length) return null;

  const question = quiz[index];

  const handleFinishQuiz = (finalAnswers, finalSelected) => {
    setShowScore(true);
    if (!hasSavedAttempt) {
      const scoreCount = finalAnswers.filter((ans) => ans === true).length;
      const attemptRecord = {
        id: "quiz-" + Date.now(),
        timestamp: new Date().toISOString(),
        title: fileName ? `Quiz on "${fileName}"` : "Interactive Study Quiz",
        totalQuestions: quiz.length,
        score: scoreCount,
        questions: quiz.map((q, idx) => ({
          question: q.question,
          options: q.options,
          selectedAnswer: finalSelected[idx] || "",
          correctAnswer: q.correct_answer,
          isCorrect: finalAnswers[idx] === true,
        })),
      };
      saveQuizAttempt(attemptRecord);
      setHasSavedAttempt(true);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === question.correct_answer;
    setFeedback(
      isCorrect ? (
        <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-700/30 font-bold text-sm w-full animate-pulse-once">
          <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
          Correct! Well done.
        </span>
      ) : (
        <span className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/30 px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-700/30 font-bold text-sm w-full">
          <XCircleIcon className="w-5 h-5 flex-shrink-0" />
          Incorrect. Correct answer: {question.correct_answer}
        </span>
      )
    );

    const updatedAnswers = [...answers];
    updatedAnswers[index] = isCorrect;
    setAnswers(updatedAnswers);

    const updatedAnswered = [...answeredQuestions];
    updatedAnswered[index] = true;
    setAnsweredQuestions(updatedAnswered);

    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[index] = selectedOption;
    setSelectedAnswers(updatedSelectedAnswers);

    // If all questions are answered or this was the last question
    const allAnswered = updatedAnswered.every(Boolean);
    if (allAnswered || index === quiz.length - 1) {
      handleFinishQuiz(updatedAnswers, updatedSelectedAnswers);
    }
  };

  const handleNext = () => {
    if (index < quiz.length - 1) {
      setIndex(index + 1);
      setFeedback("");
      setSelectedOption(selectedAnswers[index + 1] || "");
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFeedback("");
      setSelectedOption(selectedAnswers[index - 1] || "");
    }
  };

  const resetQuiz = () => {
    setIndex(0);
    setSelectedOption("");
    setFeedback("");
    setAnswers(Array(quiz.length).fill(null));
    setAnsweredQuestions(Array(quiz.length).fill(false));
    setSelectedAnswers(Array(quiz.length).fill(""));
    setShowScore(false);
    setShowReview(false);
    setHasSavedAttempt(false);
  };

  const score = answers.filter((ans) => ans === true).length;
  const answeredCount = answeredQuestions.filter(Boolean).length;

  // Dark mode helpers
  const divider = dark ? "border-white/10" : "border-gray-100";
  const textPrimary = dark ? "text-gray-100" : "text-gray-900";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";
  const arrowBtn = dark
    ? "bg-white/10 border-white/10 hover:bg-white/20"
    : "bg-white border-gray-100 hover:bg-gray-50";
  const navPanel = dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100";

  // Reusable question card
  const QuestionCard = () => (
    <div className="relative w-full max-w-2xl flex items-center justify-center px-12">
      {/* Prev Arrow */}
      <button
        onClick={handlePrev}
        disabled={index === 0}
        className={`absolute left-0 p-3 border rounded-full shadow-lg disabled:opacity-30 active:scale-95 cursor-pointer z-10 transition-all ${arrowBtn}`}
      >
        <ChevronLeftIcon className={`h-5 w-5 ${dark ? "text-gray-200" : "text-gray-700"}`} />
      </button>

      {/* Question Card */}
      <div className={`w-full px-8 py-8 border rounded-3xl shadow-xl min-h-[320px] flex flex-col justify-between ${dark ? "bg-[#1e2235] border-white/10 text-gray-100" : "bg-white border-gray-100 text-gray-900"}`}>
        <div>
          <span className="text-xs font-extrabold text-[#2E3192] tracking-wider uppercase bg-[#2E3192]/5 px-2.5 py-1 rounded-md">
            Question {(index + 1).toString().padStart(2, "0")}
          </span>
          <p className={`text-lg sm:text-xl font-extrabold mt-4 leading-snug ${textPrimary}`}>
            {question.question}
          </p>
        </div>

        {/* Options List */}
        <form className="space-y-2.5 mt-6">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isAnswered = answeredQuestions[index];
            const isCorrectAnswer = option === question.correct_answer;

            let cardStyle = dark
              ? "border-white/10 hover:border-[#2E3192]/50 hover:bg-[#2E3192]/10 text-gray-200"
              : "border-gray-200 hover:border-[#2E3192]/50 hover:bg-[#2E3192]/5";

            if (isSelected && !isAnswered) {
              cardStyle = "border-[#2E3192] bg-[#2E3192]/10 text-[#2E3192]";
            }
            if (isAnswered) {
              if (isSelected) {
                cardStyle = isCorrectAnswer
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700"
                  : "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700";
              } else if (isCorrectAnswer) {
                cardStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700";
              } else {
                cardStyle = dark ? "border-white/5 opacity-40" : "border-gray-100 opacity-60";
              }
            }

            return (
              <label
                key={idx}
                className={`flex items-center gap-3 px-4 py-3.5 border rounded-2xl cursor-pointer font-bold text-sm transition-all duration-150 ${cardStyle}`}
              >
                <input
                  type="radio"
                  name={`option-${index}`}
                  value={option}
                  checked={isSelected}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  disabled={isAnswered}
                  className="w-4 h-4 accent-[#2E3192] cursor-pointer"
                />
                <span className="leading-tight">{option}</span>
              </label>
            );
          })}
        </form>

        {/* Feedback Section */}
        {feedback && <div className="mt-6 flex justify-start">{feedback}</div>}

        {/* Submit button */}
        {!answeredQuestions[index] && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`mt-6 w-full font-bold py-3.5 rounded-2xl active:scale-[0.98] cursor-pointer transition shadow-lg disabled:opacity-50 disabled:pointer-events-none text-white ${dark ? "bg-[#2E3192] hover:bg-[#222473]" : "bg-gray-900 hover:bg-black shadow-gray-950/10"}`}
          >
            Submit Answer
          </button>
        )}
      </div>

      {/* Next Arrow */}
      <button
        onClick={handleNext}
        disabled={index === quiz.length - 1}
        className={`absolute right-0 p-3 border rounded-full shadow-lg disabled:opacity-30 active:scale-95 cursor-pointer z-10 transition-all ${arrowBtn}`}
      >
        <ChevronRightIcon className={`h-5 w-5 ${dark ? "text-gray-200" : "text-gray-700"}`} />
      </button>
    </div>
  );

  return (
    <div className="py-6">
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-4 mb-8 ${divider}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E3192]/10 rounded-xl text-[#2E3192]">
            <BookOpenIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-xl font-extrabold ${textPrimary}`}>
              Study Quiz
            </h3>
            {fileName && (
              <p className={`text-xs font-medium truncate max-w-[200px] sm:max-w-xs ${textSecondary}`}>
                {fileName}
              </p>
            )}
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          {/* History Button */}
          <button
            onClick={() => setHistoryOpen(true)}
            title="View Past Quiz History"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer border ${
              dark
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200"
                : "bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <ClockIcon className="w-3.5 h-3.5 text-[#2E3192]" />
            <span className="hidden sm:inline">Quiz History</span>
          </button>

          {/* Progress Tracker */}
          <span className="text-xs font-bold text-[#2E3192] bg-[#2E3192]/10 px-3.5 py-1.5 rounded-full">
            {answeredCount}/{quiz.length} Answered
          </span>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              title="Close Quiz"
              className={`p-1.5 rounded-full transition active:scale-95 cursor-pointer ${
                dark ? "bg-white/10 hover:bg-white/20 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 justify-center">
        {/* Quiz Card */}
        <QuestionCard />

        {/* Number Navigation + Focus Button */}
        <div className="flex items-center justify-center gap-4 mt-2 w-full max-w-2xl px-12">
          {/* Progress select dots panel */}
          <div className={`flex-1 border rounded-2xl p-2 max-h-[64px] overflow-x-auto overflow-y-hidden flex items-center gap-1.5 justify-center scrollbar-none ${navPanel}`}>
            {quiz.map((_, i) => {
              const isCurrent = i === index;
              const hasAnswered = answeredQuestions[i];
              const wasCorrect = answers[i];

              let navColor = dark
                ? "bg-white/10 text-gray-200 border border-white/10 hover:bg-white/20"
                : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-200";
              if (isCurrent) navColor = "bg-[#2E3192] text-white shadow-md shadow-blue-900/10";
              else if (hasAnswered) {
                navColor = wasCorrect
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 border border-emerald-200"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 border border-red-200";
              }

              return (
                <button
                  key={i}
                  onClick={() => {
                    setIndex(i);
                    setFeedback("");
                    setSelectedOption(selectedAnswers[i] || "");
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer ${navColor}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Focus mode toggle */}
          <div className="relative group">
            <button
              className={`p-3.5 rounded-2xl cursor-pointer transition active:scale-95 shadow-md text-white ${dark ? "bg-[#2E3192] hover:bg-[#222473]" : "bg-gray-900 hover:bg-black"}`}
              onClick={() => setFocusMode(true)}
            >
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 
              bg-gray-900 text-white text-[10px] font-bold rounded px-2.5 py-1 
              opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
              Focus Mode
            </span>
          </div>
        </div>
      </div>

      {/* Score Section */}
      {showScore && (
        <div className={`mt-10 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto border transition-all animate-fade-in ${dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between border-b pb-6 mb-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-md">
                Quiz Completed ✓
              </span>
              <h4 className={`text-2xl font-black mt-2 ${textPrimary}`}>
                Score: <span className="text-[#2E3192]">{score}</span> / {quiz.length}
                <span className="text-sm font-semibold opacity-70 ml-2">
                  ({Math.round((score / quiz.length) * 100)}%)
                </span>
              </h4>
              <p className={`text-xs font-medium mt-1 ${textSecondary}`}>
                Recorded in your Quiz History
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={() => setShowReview(!showReview)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition active:scale-95 text-xs border ${
                  dark ? "bg-white/10 hover:bg-white/20 border-white/10 text-white" : "bg-white hover:bg-gray-100 border-gray-200 text-gray-800"
                }`}
              >
                <EyeIcon className="w-4 h-4" />
                <span>{showReview ? "Hide Review" : "Review Answers"}</span>
              </button>

              <button
                onClick={resetQuiz}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition active:scale-95 text-xs border ${
                  dark ? "bg-white/10 hover:bg-white/20 border-white/10 text-white" : "bg-white hover:bg-gray-100 border-gray-200 text-gray-800"
                }`}
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>

              {onGenerateNew && (
                <button
                  onClick={onGenerateNew}
                  className="flex items-center gap-2 bg-[#2E3192] hover:bg-[#222473] text-white px-4 py-2.5 rounded-xl font-bold cursor-pointer transition active:scale-95 text-xs shadow-md"
                >
                  <span>New Quiz (Fresh Questions)</span>
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question Review List */}
          {showReview && (
            <div className="space-y-4 pt-2 text-left animate-fade-in">
              <h5 className={`text-sm font-extrabold uppercase tracking-wider text-[#2E3192]`}>
                Question Review & Explanations
              </h5>
              {quiz.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = answers[idx] === true;

                return (
                  <QuizReviewCard
                    key={idx}
                    index={idx}
                    total={quiz.length}
                    question={q.question}
                    options={q.options}
                    selectedAnswer={userChoice}
                    correctAnswer={q.correct_answer}
                    isCorrect={isCorrect}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Focus Mode Modal */}
      {focusMode && (
        <div className="fixed inset-0 backdrop-blur-xl bg-black/60 z-50 flex flex-col items-center justify-center p-6">
          <button
            className="fixed top-6 right-6 text-gray-700 w-10 h-10 bg-white/90 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer rounded-full p-2.5 z-50 shadow-lg border border-gray-100 flex items-center justify-center font-bold text-sm"
            onClick={() => setFocusMode(false)}
          >
            ✕
          </button>

          <div className="flex flex-col items-center gap-8 justify-center w-full">
            <QuestionCard />

            {/* Dots navigation in Focus Mode */}
            <div className="flex gap-2 max-w-sm overflow-x-auto py-2">
              {quiz.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIndex(i);
                    setFeedback("");
                    setSelectedOption(selectedAnswers[i] || "");
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300
                    ${i === index
                      ? "bg-white scale-125 w-6"
                      : "bg-white/40 hover:bg-white/60 cursor-pointer"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quiz History Drawer / Modal */}
      <QuizHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
};

export default QuizList;
