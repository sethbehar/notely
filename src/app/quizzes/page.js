"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  IconArrowLeft,
  IconSearch,
  IconPlus,
  IconFilter,
  IconFolder,
  IconX,
  IconArrowLeft as IconPrev,
  IconArrowRight as IconNext,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Component to display a multiple choice question.
function MultipleChoiceCard({ question, options, correctAnswer, onAnswerSelected }) {
  const [selected, setSelected] = useState(null);
  // Get the actual correct answer option string using the index
  const actualCorrectAnswer = options[correctAnswer];

  const handleClick = (option) => {
    if (selected !== null) return; // Prevent multiple selections.
    setSelected(option);
    const isCorrect = option === actualCorrectAnswer;
    onAnswerSelected(option, isCorrect);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{question}</h2>
      <div className="grid gap-4">
        {options.map((option, idx) => {
          // Determine the background color based on selection.
          let optionClasses = "p-2 border rounded-md cursor-pointer";
          if (selected !== null) {
            if (option === actualCorrectAnswer) {
              optionClasses += " bg-green-300";
            } else if (option === selected) {
              optionClasses += " bg-red-300";
            }
          } else {
            optionClasses += " hover:bg-gray-200";
          }
          return (
            <div
              key={idx}
              onClick={() => handleClick(option)}
              className={optionClasses}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Quizzes() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("Recent");

  // Overlay modal state for viewing a quiz.
  const [selectedQuizDoc, setSelectedQuizDoc] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  // Tracks whether the current question has been answered.
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      axios
        .get("http://127.0.0.1:5000/quizzes", {
          headers: { "X-Clerk-User-Id": user.id },
        })
        .then((res) => {
          setQuizzes(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching quizzes:", err);
          setError("Failed to load quizzes");
          setLoading(false);
        });
    }
  }, [isLoaded, isSignedIn, user]);

  // Filter quizzes by title using the search query.
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort quizzes by "Recent" or "Alphabetical."
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (activeSort === "Alphabetical") {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  // Overlay modal handlers.
  const handleOpenQuiz = (quizDoc) => {
    setSelectedQuizDoc(quizDoc);
    setCurrentQuizIndex(0);
    setAnswered(false);
  };

  const handleCloseOverlay = () => {
    setSelectedQuizDoc(null);
    setCurrentQuizIndex(0);
    setAnswered(false);
  };

  const handleAnswerSelected = (selectedOption, isCorrect) => {
    setAnswered(true);
    // You can use isCorrect here for further logic or tracking analytics
  };

  const handlePrevCard = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setAnswered(false);
    }
  };

  const handleNextCard = () => {
    if (selectedQuizDoc) {
      if (currentQuizIndex < selectedQuizDoc.quiz.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setAnswered(false);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.gif" alt="Loading..." width={100} height={75} />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please sign in to view your quizzes.</p>
      </div>
    );
  }

  const sortOptions = ["Recent", "Alphabetical"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 font-poppins">
      <header className="bg-white dark:bg-neutral-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <IconArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              My Quizzes
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white w-64"
              />
            </div>
            <Link
              href="/notes"
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              <span>View Notes</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Sort filter options */}
        <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
          <div className="bg-white dark:bg-neutral-800 p-1 rounded-md shadow flex items-center mr-2">
            <IconFilter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Sort:</span>
          </div>
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveSort(option)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap",
                activeSort === option
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md">
            {error}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-8 text-center">
            <IconFolder className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No quizzes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Generate a quiz from one of your notes to see it here.
            </p>
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              <span>View Notes</span>
            </Link>
          </div>
        ) : sortedQuizzes.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-8 text-center">
            <IconSearch className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No matching quizzes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {quiz.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {new Date(quiz.timestamp).toLocaleString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {quiz.quiz && quiz.quiz.length > 0
                      ? `${quiz.quiz.length} questions`
                      : "No quiz questions available"}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleOpenQuiz(quiz)}
                      className="flex items-center justify-center px-3 py-1.5 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600 transition-colors"
                    >
                      <IconSearch className="h-4 w-4 mr-1" />
                      <span>Open</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overlay modal for quiz viewing */}
        {selectedQuizDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-2xl w-full relative min-h-[450px]">
              <button
                onClick={handleCloseOverlay}
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                <IconX className="h-6 w-6" />
              </button>
              {selectedQuizDoc.quiz &&
                selectedQuizDoc.quiz.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {selectedQuizDoc.title}
                    </h2>
                    {/* Render the current multiple choice question */}
                    <MultipleChoiceCard
                      question={selectedQuizDoc.quiz[currentQuizIndex].question}
                      options={selectedQuizDoc.quiz[currentQuizIndex].options}
                      correctAnswer={selectedQuizDoc.quiz[currentQuizIndex].answer}
                      onAnswerSelected={handleAnswerSelected}
                    />
                    <div className="flex justify-between items-center mt-8">
                      <button
                        onClick={handlePrevCard}
                        disabled={currentQuizIndex === 0}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
                      >
                        <IconPrev className="h-4 w-4 inline-block mr-1" />
                        Prev
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentQuizIndex + 1} of {selectedQuizDoc.quiz.length}
                      </span>
                      <button
                        onClick={handleNextCard}
                        disabled={!answered || currentQuizIndex === selectedQuizDoc.quiz.length - 1}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
                      >
                        Next
                        <IconNext className="h-4 w-4 inline-block ml-1" />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
