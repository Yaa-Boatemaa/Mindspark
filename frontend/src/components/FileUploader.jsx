import React, { useRef, useState } from "react";
import axios from "axios";
import FlashcardList from "./FlashcardList";
import QuizList from "./QuizList";
import QuizHistory from "./QuizHistory";
import {
  CloudArrowUpIcon,
  TrashIcon,
  DocumentIcon,
  ClockIcon,
  XMarkIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const FileUploader = ({ onTextExtracted }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [preprocessedText, setPreprocessedText] = useState("");
  const [wordCount, setWordCount] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [seenFlashcardQuestions, setSeenFlashcardQuestions] = useState([]);
  const [seenQuizQuestions, setSeenQuizQuestions] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { dark } = useTheme();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "flashcards" or "quiz"

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://mindspark-backend-dr9v.onrender.com/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const previewText = response.data.preview;
      setPreprocessedText(previewText);
      setWordCount(response.data.word_count);
      setSelectedFile(file);
      setSeenFlashcardQuestions([]);
      setSeenQuizQuestions([]);
      setFlashcards([]);
      setQuiz([]);
      onTextExtracted?.(previewText);
    } catch (err) {
      console.error("Upload failed:", err);

      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Failed to upload or extract file.");
      }
      setSelectedFile(null);
    } finally {
      setLoading(false);
    }
  };

  const requestFlashcards = async (count) => {
    setLoadingFlashcards(true);
    try {
      const response = await axios.post(
        "https://mindspark-backend-dr9v.onrender.com/api/generate_flashcards",
        {
          text: preprocessedText,
          count,
          previous_questions: seenFlashcardQuestions,
        }
      );
      const newCards = response.data.flashcards || [];
      setFlashcards(newCards);
      const newQuestionPrompts = newCards.map((c) => c.question).filter(Boolean);
      setSeenFlashcardQuestions((prev) => [...prev, ...newQuestionPrompts]);
    } catch (err) {
      console.error("Flashcard generation failed:", err);
      const msg = err.response?.data?.error || "Failed to generate flashcards. Please try again.";
      alert(msg);
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const requestQuiz = async (count) => {
    setLoadingQuiz(true);
    try {
      const response = await axios.post(
        "https://mindspark-backend-dr9v.onrender.com/api/generate_quiz",
        {
          text: preprocessedText,
          count,
          previous_questions: seenQuizQuestions,
        }
      );
      const newQuiz = response.data.quiz || [];
      setQuiz(newQuiz);
      const newQuestionPrompts = newQuiz.map((q) => q.question).filter(Boolean);
      setSeenQuizQuestions((prev) => [...prev, ...newQuestionPrompts]);
    } catch (err) {
      console.error("Quiz generation failed:", err);
      const msg = err.response?.data?.error || "Failed to generate quiz. Please try again.";
      alert(msg);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setPreprocessedText("");
    setWordCount(null);
    setFlashcards([]);
    setQuiz([]);
    setSeenFlashcardQuestions([]);
    setSeenQuizQuestions([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModalSelect = (count) => {
    setModalOpen(false);
    if (modalType === "flashcards") {
      requestFlashcards(count);
    } else if (modalType === "quiz") {
      requestQuiz(count);
    }
  };

  const card = dark
    ? "bg-[#1a1d2e]/90 border-white/10 shadow-black/30"
    : "bg-white/80 border-white/60 shadow-gray-200";

  const uploadArea = selectedFile
    ? dark
      ? "border-green-500/50 bg-green-900/10"
      : "border-green-300 bg-green-50/20"
    : dark
    ? "border-white/20 hover:border-[#2E3192] hover:bg-[#2E3192]/10 bg-white/5"
    : "border-gray-300 hover:border-[#2E3192] hover:bg-[#2E3192]/5 bg-gray-50/50";

  return (
    <div className="max-w-4xl mx-auto">

      {/* Upload & Dashboard Section */}
      <div className={`backdrop-blur-md rounded-3xl border shadow-xl p-8 sm:p-10 transition-all hover:shadow-2xl ${card}`}>

        {/* Drag & Drop Visual Area */}
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative group overflow-hidden ${uploadArea}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx,.ppt,.pptx"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />

          <div className="flex flex-col items-center justify-center gap-3">
            {loading ? (
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#2E3192] animate-spin mb-2" />
            ) : selectedFile ? (
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-2">
                <CheckIcon className="w-6 h-6 text-green-600" />
              </div>
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-[#2E3192]/10 transition-colors mb-2 ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                <CloudArrowUpIcon className={`w-6 h-6 group-hover:text-[#2E3192] transition-colors ${dark ? "text-gray-300" : "text-gray-500"}`} />
              </div>
            )}

            <h3 className={`text-lg font-bold ${dark ? "text-gray-100" : "text-gray-800"}`}>
              {loading
                ? "Extracting contents..."
                : selectedFile
                ? "File ready for study!"
                : "Click to upload a document"}
            </h3>

            <p className={`text-xs max-w-xs mx-auto leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {selectedFile
                ? `Successfully loaded "${selectedFile.name}"`
                : "Supports PDF, DOCX, PPTX, TXT files (Max 2,000 words extracted)"}
            </p>
          </div>
        </div>

        {/* Uploaded File Panel & Actions */}
        {selectedFile && !loading && (
          <div className="mt-8 animate-fade-in">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2E3192]/10 flex items-center justify-center">
                  <DocumentIcon className="w-5 h-5 text-[#2E3192]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold truncate max-w-[250px] sm:max-w-[350px] ${dark ? "text-gray-100" : "text-gray-900"}`}>
                    {selectedFile.name}
                  </p>
                  <p className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    {wordCount ? `${wordCount} words detected` : "File analyzed"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDeleteFile}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition cursor-pointer"
                title="Remove file"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => {
                  setModalType("flashcards");
                  setModalOpen(true);
                }}
                disabled={loadingFlashcards}
                className="px-6 py-4 bg-[#2E3192] text-white rounded-2xl hover:bg-[#222473] active:scale-[0.98] cursor-pointer font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 disabled:opacity-80"
              >
                {loadingFlashcards && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                )}
                <span>
                  {flashcards.length > 0 ? "Generate More Flashcards (Fresh)" : "Generate Flashcards"}
                </span>
              </button>

              <button
                onClick={() => {
                  setModalType("quiz");
                  setModalOpen(true);
                }}
                disabled={loadingQuiz}
                className={`px-6 py-4 rounded-2xl active:scale-[0.98] cursor-pointer font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-80 ${
                  dark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-900 hover:bg-black text-white shadow-gray-950/10 hover:shadow-gray-950/20"
                }`}
              >
                {loadingQuiz && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                )}
                <span>
                  {quiz.length > 0 ? "Generate New Quiz (New Questions)" : "Generate Interactive Quiz"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Flashcards & Quiz Deck Area */}
      <div className="mt-12 space-y-12">
        {flashcards.length > 0 && (
          <div className={`rounded-3xl p-8 shadow-xl border relative transition-all animate-fade-in ${
            dark ? "bg-[#1a1d2e] border-white/10" : "bg-white border-gray-100"
          }`}>
            <FlashcardList
              flashcards={flashcards}
              fileName={selectedFile?.name}
              onClose={() => setFlashcards([])}
              onGenerateNew={() => {
                setModalType("flashcards");
                setModalOpen(true);
              }}
            />
          </div>
        )}

        {quiz.length > 0 && (
          <div className={`rounded-3xl p-8 shadow-xl border relative transition-all animate-fade-in ${
            dark ? "bg-[#1a1d2e] border-white/10" : "bg-white border-gray-100"
          }`}>
            <QuizList
              quiz={quiz}
              fileName={selectedFile?.name}
              onClose={() => setQuiz([])}
              onGenerateNew={() => {
                setModalType("quiz");
                setModalOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Counts Selection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50 animate-fade-in">
          <div className={`rounded-3xl p-8 w-80 shadow-2xl border text-center ${
            dark ? "bg-[#1a1d2e] border-white/10 text-white" : "bg-white border-gray-100 text-gray-900"
          }`}>
            <div className="w-12 h-12 bg-[#2E3192]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            </div>
            <h3 className="text-lg font-extrabold mb-2">
              Select Deck Size
            </h3>
            <p className={`text-xs font-semibold mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>
              How many {modalType === "flashcards" ? "flashcards" : "questions"} would you like to generate?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => handleModalSelect(num)}
                  className="px-4 py-3 bg-[#2E3192] hover:bg-[#222473] text-white rounded-xl font-bold cursor-pointer transition active:scale-95 shadow-md shadow-blue-900/5 hover:shadow-blue-900/15"
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className={`mt-6 w-full rounded-xl py-3 font-bold cursor-pointer transition active:scale-95 text-sm ${
                dark ? "bg-white/10 hover:bg-white/20 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Standalone Quiz History Modal */}
      <QuizHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
};

export default FileUploader;
