import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  ArrowsPointingOutIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "../context/ThemeContext";

const FlashcardList = ({ flashcards: originalCards, fileName, onClose, onGenerateNew }) => {
  const { dark } = useTheme();
  const [cards, setCards] = useState(originalCards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  useEffect(() => {
    setCards(originalCards);
    setIndex(0);
    setRevealed(false);
    setShuffled(false);
  }, [originalCards]);

  if (!cards || !cards.length) return null;

  const card = cards[index];

  const handlePrev = () => {
    if (index > 0) {
      setSlideDirection("left");
      setTimeout(() => {
        setIndex((prev) => prev - 1);
        setRevealed(false);
        setSlideDirection("");
      }, 300);
    }
  };

  const handleNext = () => {
    if (index < cards.length - 1) {
      setSlideDirection("right");
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setRevealed(false);
        setSlideDirection("");
      }, 300);
    }
  };

  const toggleAnswer = () => {
    setRevealed((prev) => !prev);
  };

  const handleShuffle = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setIndex(0);
    setRevealed(false);
    setShuffled(true);
  };

  const handleReset = () => {
    setCards(originalCards);
    setIndex(0);
    setRevealed(false);
    setShuffled(false);
  };

  // Dark mode helpers
  const cardBg = dark
    ? "bg-gradient-to-br from-[#1e2235] to-[#1a1d2e] border-white/10"
    : "bg-gradient-to-br from-white to-gray-50/50 border-gray-100/80";
  const cardBgBack = dark ? "bg-[#1e2235] border-white/10" : "bg-white border-gray-100";
  const arrowBtn = dark
    ? "bg-white/10 border-white/10 hover:bg-white/20"
    : "bg-white border-gray-100 hover:bg-gray-50";
  const textPrimary = dark ? "text-gray-100" : "text-gray-900";
  const textSecondary = dark ? "text-gray-400" : "text-gray-400";
  const divider = dark ? "border-white/10" : "border-gray-100";
  const navPanel = dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100";
  const navBtn = dark ? "bg-white/10 text-gray-200 hover:bg-white/20 border-white/10" : "bg-white text-gray-600 hover:bg-gray-200 border-gray-100";

  return (
    <div className="py-6">
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-4 mb-8 ${divider}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E3192]/10 rounded-xl text-[#2E3192]">
            <ClipboardDocumentListIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-xl font-extrabold ${textPrimary}`}>
              Study Flashcards
            </h3>
            {fileName && (
              <p className={`text-xs font-medium truncate max-w-[200px] sm:max-w-xs ${textSecondary}`}>
                {fileName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* New Flashcards Button */}
          {onGenerateNew && (
            <button
              onClick={onGenerateNew}
              title="Generate New Flashcards"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer bg-[#2E3192]/10 hover:bg-[#2E3192]/20 text-[#2E3192]"
            >
              <span>New Cards</span>
            </button>
          )}

          {/* Shuffle / Reset Button */}
          <button
            onClick={shuffled ? handleReset : handleShuffle}
            title={shuffled ? "Reset order" : "Shuffle cards"}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
              shuffled
                ? dark
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30"
                  : "bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200"
                : dark
                ? "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${shuffled ? "animate-spin-once" : ""}`} />
            <span className="hidden sm:inline">{shuffled ? "Reset" : "Shuffle"}</span>
          </button>

          {/* Progress Tracker */}
          <span className="text-xs font-bold text-[#2E3192] bg-[#2E3192]/10 px-3.5 py-1.5 rounded-full">
            {index + 1} of {cards.length}
          </span>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              title="Close Flashcards"
              className={`p-1.5 rounded-full transition active:scale-95 cursor-pointer ${
                dark ? "bg-white/10 hover:bg-white/20 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Shuffled Badge */}
      {shuffled && (
        <div className={`mb-4 text-center text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mx-auto ${dark ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700"}`}>
          <ArrowPathIcon className="w-3 h-3" />
          Cards are shuffled
        </div>
      )}

      {/* Main Layout: Flashcard + Navigation */}
      <div className="flex flex-col items-center gap-8 justify-center">

        {/* Flashcard Area */}
        <div className="relative w-full max-w-lg h-[340px] perspective flex items-center justify-center px-12">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className={`absolute left-0 p-3 border rounded-full shadow-lg disabled:opacity-30 active:scale-95 cursor-pointer z-10 transition-all ${arrowBtn}`}
          >
            <ChevronLeftIcon className={`h-5 w-5 ${dark ? "text-gray-200" : "text-gray-700"}`} />
          </button>

          {/* Card Stack */}
          <div className="relative w-full h-full">
            {/* Back Cards for Stacking Effect */}
            {cards.slice(index + 1, index + 3).map((_, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 border rounded-3xl shadow-md -z-10 ${dark ? "bg-[#1e2235]/60 border-white/5" : "bg-white border-gray-100"}`}
                style={{
                  transform: `translateY(${(idx + 1) * 8}px) scale(${1 - (idx + 1) * 0.04})`,
                  opacity: dark ? 0.3 : 0.4,
                }}
              />
            ))}

            {/* Main Card with Flip Animation */}
            <div
              className={`absolute inset-0 transition-all duration-300 transform ${
                slideDirection === "left"
                  ? "-translate-x-12 opacity-0 scale-95"
                  : slideDirection === "right"
                  ? "translate-x-12 opacity-0 scale-95"
                  : "translate-x-0 opacity-100 scale-100"
              }`}
            >
              <div
                className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 cursor-pointer ${
                  revealed ? "rotate-y-180" : ""
                }`}
                onClick={toggleAnswer}
              >
                {/* Front (Question) */}
                <div className={`absolute inset-0 backface-hidden rounded-3xl shadow-xl p-8 flex flex-col justify-between border ${cardBg}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#2E3192] tracking-wider uppercase bg-[#2E3192]/5 px-2.5 py-1 rounded-md">
                      Question
                    </span>
                    <span className={`text-[10px] font-bold ${textSecondary}`}>#{(index + 1).toString().padStart(2, "0")}</span>
                  </div>

                  <div className="my-auto py-4">
                    <h4 className={`text-xl sm:text-2xl font-extrabold leading-snug ${textPrimary}`}>
                      {card.question}
                    </h4>
                  </div>

                  <p className={`text-xs font-semibold italic text-center border-t pt-3 ${textSecondary} ${divider}`}>
                    Click card to flip
                  </p>
                </div>

                {/* Back (Answer) */}
                <div className={`absolute inset-0 backface-hidden rounded-3xl shadow-xl p-8 flex flex-col justify-between border transform rotate-y-180 ${cardBgBack}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-emerald-600 tracking-wider uppercase bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md">
                      Answer
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">#{(index + 1).toString().padStart(2, "0")}</span>
                  </div>

                  <div className="my-auto py-4 overflow-y-auto max-h-[180px] custom-scrollbar">
                    <p className={`text-base sm:text-lg font-bold leading-relaxed ${dark ? "text-gray-100" : "text-gray-800"}`}>
                      {card.answer}
                    </p>
                  </div>

                  <p className={`text-xs font-semibold italic text-center border-t pt-3 ${textSecondary} ${divider}`}>
                    Click card to see question
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={index === cards.length - 1}
            className={`absolute right-0 p-3 border rounded-full shadow-lg disabled:opacity-30 active:scale-95 cursor-pointer z-10 transition-all ${arrowBtn}`}
          >
            <ChevronRightIcon className={`h-5 w-5 ${dark ? "text-gray-200" : "text-gray-700"}`} />
          </button>
        </div>

        {/* Navigation & Utilities */}
        <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-md">
          {/* Card Select Indicator Panel */}
          <div className={`flex-1 border rounded-2xl p-2 max-h-[64px] overflow-x-auto overflow-y-hidden flex items-center gap-1.5 justify-center scrollbar-none ${navPanel}`}>
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  setRevealed(false);
                }}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0
                  ${i === index
                    ? "bg-[#2E3192] text-white shadow-md shadow-blue-900/10"
                    : `cursor-pointer border ${navBtn}`
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Focus Button */}
          <div className="relative group">
            <button
              className={`p-3.5 rounded-2xl cursor-pointer transition active:scale-95 shadow-md ${dark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-900 hover:bg-black text-white"}`}
              onClick={() => setFocusMode(true)}
            >
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 
                   bg-gray-900 text-white text-[10px] font-bold rounded px-2.5 py-1 
                   opacity-0 group-hover:opacity-100 
                   transition pointer-events-none whitespace-nowrap">
              Focus Mode
            </span>
          </div>
        </div>

      </div>

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
            {/* Flashcard Area inside modal */}
            <div className="relative w-full max-w-xl h-[400px] perspective flex items-center justify-center px-16">
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                disabled={index === 0}
                className="absolute left-0 p-4 bg-white border border-gray-100 rounded-full shadow-lg disabled:opacity-30 hover:bg-gray-50 active:scale-95 cursor-pointer z-10 transition"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
              </button>

              {/* Main Card */}
              <div className="relative w-full h-full">
                <div
                  className={`absolute inset-0 transition-all duration-300 transform ${
                    slideDirection === "left"
                      ? "-translate-x-12 opacity-0 scale-95"
                      : slideDirection === "right"
                      ? "translate-x-12 opacity-0 scale-95"
                      : "translate-x-0 opacity-100 scale-100"
                  }`}
                >
                  <div
                    className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 cursor-pointer ${
                      revealed ? "rotate-y-180" : ""
                    }`}
                    onClick={toggleAnswer}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl p-10 flex flex-col justify-between border border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-[#2E3192] tracking-wider uppercase bg-[#2E3192]/5 px-2.5 py-1 rounded-md">
                          Question
                        </span>
                        <span className="text-xs font-bold text-gray-400">Card {(index + 1).toString().padStart(2, "0")} of {cards.length}</span>
                      </div>

                      <div className="my-auto">
                        <h4 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                          {card.question}
                        </h4>
                      </div>

                      <p className="text-xs text-gray-400 font-semibold italic text-center">
                        Click card to flip
                      </p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl p-10 flex flex-col justify-between border border-gray-100 transform rotate-y-180">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
                          Answer
                        </span>
                        <span className="text-xs font-bold text-emerald-400">Card {(index + 1).toString().padStart(2, "0")} of {cards.length}</span>
                      </div>

                      <div className="my-auto overflow-y-auto max-h-[220px] custom-scrollbar">
                        <p className="text-lg sm:text-xl font-bold text-gray-800 leading-relaxed">
                          {card.answer}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 font-semibold italic text-center">
                        Click card to see question
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                disabled={index === cards.length - 1}
                className="absolute right-0 p-4 bg-white border border-gray-100 rounded-full shadow-lg disabled:opacity-30 hover:bg-gray-50 active:scale-95 cursor-pointer z-10 transition"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Dots navigation in Focus Mode */}
            <div className="flex gap-2 max-w-sm overflow-x-auto py-2">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIndex(i);
                    setRevealed(false);
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

      {/* Extra CSS */}
      <style>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default FlashcardList;
