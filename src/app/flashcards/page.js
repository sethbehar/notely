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

export default function Flashcards() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("Recent");

  // Overlay state for viewing flashcards one by one
  const [selectedFlashcardDoc, setSelectedFlashcardDoc] = useState(null);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      axios
        .get("http://127.0.0.1:5000/flashcards", {
          headers: { "X-Clerk-User-Id": user.id },
        })
        .then((res) => {
          setFlashcards(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching flashcards:", err);
          setError("Failed to load flashcards");
          setLoading(false);
        });
    }
  }, [isLoaded, isSignedIn, user]);

  // Filter flashcards based on search query (by title)
  const filteredFlashcards = flashcards.filter((fc) =>
    fc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort flashcards based on activeSort filter
  const sortedFlashcards = [...filteredFlashcards].sort((a, b) => {
    if (activeSort === "Alphabetical") {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  // Overlay modal handlers
  const handleOpenFlashcard = (flashcardDoc) => {
    setSelectedFlashcardDoc(flashcardDoc);
    setCurrentFlashcardIndex(0);
  };

  const handleCloseOverlay = () => {
    setSelectedFlashcardDoc(null);
    setCurrentFlashcardIndex(0);
  };

  const handlePrevCard = () => {
    setCurrentFlashcardIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextCard = () => {
    if (selectedFlashcardDoc) {
      setCurrentFlashcardIndex((prev) =>
        Math.min(prev + 1, selectedFlashcardDoc.flashcards.length - 1)
      );
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
        <p>Please sign in to view your flashcards.</p>
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
              My Flashcards
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Sort options */}
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
        ) : flashcards.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-8 text-center">
            <IconFolder className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No flashcards found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Generate flashcards from your notes to see them here.
            </p>
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              <span>View Notes</span>
            </Link>
          </div>
        ) : sortedFlashcards.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-8 text-center">
            <IconSearch className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No matching flashcards
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFlashcards.map((fc) => (
              <div
                key={fc._id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {fc.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {new Date(fc.timestamp).toLocaleString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {fc.flashcards && fc.flashcards.length > 0
                      ? `${fc.flashcards.length} flashcards`
                      : "No flashcards available"}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleOpenFlashcard(fc)}
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

        {/* Overlay modal for flashcard viewing */}
        {selectedFlashcardDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-lg w-full relative">
              <button
                onClick={handleCloseOverlay}
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                <IconX className="h-6 w-6" />
              </button>
              {selectedFlashcardDoc.flashcards &&
                selectedFlashcardDoc.flashcards.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {selectedFlashcardDoc.title}
                    </h2>
                    <div className="mb-4">
                      <p className="text-lg font-medium">
                        Question:{" "}
                        {selectedFlashcardDoc.flashcards[currentFlashcardIndex].question}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Answer:{" "}
                        {selectedFlashcardDoc.flashcards[currentFlashcardIndex].answer}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={handlePrevCard}
                        disabled={currentFlashcardIndex === 0}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
                      >
                        <IconPrev className="h-4 w-4 inline-block mr-1" />
                        Prev
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentFlashcardIndex + 1} of {selectedFlashcardDoc.flashcards.length}
                      </span>
                      <button
                        onClick={handleNextCard}
                        disabled={
                          currentFlashcardIndex ===
                          selectedFlashcardDoc.flashcards.length - 1
                        }
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
