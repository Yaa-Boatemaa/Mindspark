import React from "react";
import { CheckCircleIcon, XCircleIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../context/ThemeContext";

const QuizReviewCard = ({ question, index, total, options = [], selectedAnswer, correctAnswer, isCorrect }) => {
  const { dark } = useTheme();

  // Normalize options array if needed
  let optionList = Array.isArray(options) ? options : [];
  if (optionList.length === 0 && (selectedAnswer || correctAnswer)) {
    optionList = [selectedAnswer, correctAnswer].filter(Boolean);
  }

  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all ${
        isCorrect
          ? dark
            ? "bg-[#11221c] border-emerald-500/30"
            : "bg-emerald-50/40 border-emerald-300"
          : dark
          ? "bg-[#25151b] border-red-500/30"
          : "bg-red-50/40 border-red-300"
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-200/40 dark:border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#2E3192]/10 text-[#2E3192]">
            Question {index !== undefined ? index + 1 : ""} {total ? `of ${total}` : ""}
          </span>
        </div>

        <div>
          {isCorrect ? (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700/50">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Correct (+1)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/60 px-3 py-1 rounded-full border border-red-300 dark:border-red-700/50">
              <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
              Incorrect (0)
            </span>
          )}
        </div>
      </div>

      {/* Question Title */}
      <h4 className={`text-base sm:text-lg font-black leading-snug mb-5 ${dark ? "text-gray-100" : "text-gray-900"}`}>
        {question}
      </h4>

      {/* Options List */}
      <div className="space-y-2.5 mb-5">
        {optionList.map((opt, optIdx) => {
          const isUserChoice = opt === selectedAnswer;
          const isRightChoice = opt === correctAnswer;

          let style = dark
            ? "border-white/10 bg-white/5 text-gray-300 opacity-60"
            : "border-gray-200 bg-white text-gray-600 opacity-70";
          let badge = null;

          if (isRightChoice && isUserChoice) {
            // User chose the correct answer
            style = dark
              ? "border-emerald-500/80 bg-emerald-900/40 text-emerald-100 shadow-md font-bold ring-1 ring-emerald-500"
              : "border-emerald-500 bg-emerald-100/80 text-emerald-950 shadow-sm font-bold ring-1 ring-emerald-400";
            badge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                <CheckIcon className="w-3.5 h-3.5 stroke-[3]" /> Your Answer (Correct)
              </span>
            );
          } else if (isRightChoice) {
            // Correct answer (which user missed)
            style = dark
              ? "border-emerald-500 bg-emerald-950/60 text-emerald-100 font-bold ring-1 ring-emerald-500/60"
              : "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-1 ring-emerald-500";
            badge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                <CheckIcon className="w-3.5 h-3.5 stroke-[3]" /> Correct Answer
              </span>
            );
          } else if (isUserChoice) {
            // Wrong answer chosen by user
            style = dark
              ? "border-red-500 bg-red-950/60 text-red-200 font-bold ring-1 ring-red-500"
              : "border-red-400 bg-red-100 text-red-950 font-bold ring-1 ring-red-400";
            badge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-600 text-white">
                <XMarkIcon className="w-3.5 h-3.5 stroke-[3]" /> Your Answer (Incorrect)
              </span>
            );
          }

          return (
            <div
              key={optIdx}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 rounded-xl border text-sm transition-all ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                  isRightChoice
                    ? "bg-emerald-600 text-white"
                    : isUserChoice
                    ? "bg-red-600 text-white"
                    : dark
                    ? "bg-white/10 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {optionLetters[optIdx] || optIdx + 1}
                </span>
                <span className="font-semibold leading-snug">{opt}</span>
              </div>

              {badge && <div className="shrink-0 pl-9 sm:pl-0">{badge}</div>}
            </div>
          );
        })}
      </div>

      {/* Answer Summary Callout */}
      <div
        className={`p-3.5 rounded-xl border text-xs leading-relaxed font-semibold flex items-start gap-2.5 ${
          isCorrect
            ? dark
              ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-200"
              : "bg-emerald-100/60 border-emerald-200 text-emerald-900"
            : dark
            ? "bg-red-950/40 border-red-800/40 text-red-200"
            : "bg-red-100/60 border-red-200 text-red-900"
        }`}
      >
        {isCorrect ? (
          <>
            <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-black">Great job!</span> You selected the correct answer:{" "}
              <span className="font-extrabold underline decoration-emerald-500 underline-offset-2">{correctAnswer}</span>
            </div>
          </>
        ) : (
          <>
            <XCircleIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-black">Explanation:</span> You picked{" "}
              <span className="font-extrabold line-through opacity-80">{selectedAnswer || "(Nothing selected)"}</span>, but the correct answer is{" "}
              <span className="font-extrabold underline decoration-emerald-500 underline-offset-2">{correctAnswer}</span>.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizReviewCard;
