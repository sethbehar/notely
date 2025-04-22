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
  IconEye, 
  IconDownload, 
  IconCards, 
  IconQuestionMark,
  IconFilter,
  IconFolder,
  IconLoader2
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function Notes() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("Recent");
  // Add loading states for flashcards and quiz generation
  const [generatingFlashcards, setGeneratingFlashcards] = useState({});
  const [generatingQuiz, setGeneratingQuiz] = useState({});

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      axios
        .get("http://127.0.0.1:5000/notes", {
          headers: { "X-Clerk-User-Id": user.id }
        })
        .then((res) => {
          setNotes(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching notes:", err);
          setError("Failed to load notes");
          setLoading(false);
        });
    }
  }, [isLoaded, isSignedIn, user]);

  // Filter notes based on search query only
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort notes based on activeSort filter
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (activeSort === "Alphabetical") {
      return a.title.localeCompare(b.title);
    } else { // Recent
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  const handleGenerateFlashcards = async (noteId) => {
    console.log("Generating flashcards for note:", noteId);
    // Set loading state for this specific note
    setGeneratingFlashcards(prev => ({ ...prev, [noteId]: true }));
    
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/notes/${noteId}/flashcards`,
        {},
        { headers: { "X-Clerk-User-Id": user.id } }
      );
      alert("Flashcards generated successfully!");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      // Clear loading state
      setGeneratingFlashcards(prev => ({ ...prev, [noteId]: false }));
    }
  };

  const handleGenerateQuiz = async (noteId) => {
    console.log("Generating quiz for note:", noteId);
    // Set loading state for this specific note
    setGeneratingQuiz(prev => ({ ...prev, [noteId]: true }));
    
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/notes/${noteId}/quiz`,
        {},
        { headers: { "X-Clerk-User-Id": user.id } }
      );
      if (response.status === 201 && response.data) {
        alert("Quiz generated successfully!");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      // Clear loading state
      setGeneratingQuiz(prev => ({ ...prev, [noteId]: false }));
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
        <p>Please sign in to view your notes.</p>
      </div>
    );
  }

  // Define sort options
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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Notes</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white w-64"
              />
            </div>
            <Link
              href="/upload"
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              <span>Upload</span>
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
        ) : notes.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-8 text-center">
            <IconFolder className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notes found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start a conversation to create a note or upload a PDF.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              <span>Upload Note</span>
            </Link>
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-8 text-center">
            <IconSearch className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching notes</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{note.title}</h3>
                  </div>
                  {note.content && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{note.content}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {new Date(note.timestamp).toLocaleString()}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenNote(note._id)}
                      className="flex items-center justify-center px-3 py-1.5 bg-gray-400 cursor-not-allowed text-white text-sm rounded hover:bg-red-400 transition-colors"
                    >
                      <IconEye className="h-4 w-4 mr-1" />
                      <span>Open</span>
                    </button>
                    <button
                      onClick={() => handleDownloadNote(note)}
                      className="flex items-center justify-center px-3 py-1.5 bg-gray-400 cursor-not-allowed text-white text-sm rounded hover:bg-red-400 transition-colors"
                    >
                      <IconDownload className="h-4 w-4 mr-1" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleGenerateFlashcards(note._id)}
                      disabled={generatingFlashcards[note._id]}
                      className={`flex items-center justify-center px-3 py-1.5 text-sm rounded transition-colors ${
                        generatingFlashcards[note._id] 
                          ? "bg-purple-400 cursor-not-allowed" 
                          : "bg-purple-500 hover:bg-purple-600"
                      } text-white`}
                    >
                      {generatingFlashcards[note._id] ? (
                        <>
                          <IconLoader2 className="h-4 w-4 mr-1 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <IconCards className="h-4 w-4 mr-1" />
                          <span>Flashcards</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleGenerateQuiz(note._id)}
                      disabled={generatingQuiz[note._id]}
                      className={`flex items-center justify-center px-3 py-1.5 text-sm rounded transition-colors ${
                        generatingQuiz[note._id] 
                          ? "bg-amber-400 cursor-not-allowed" 
                          : "bg-amber-500 hover:bg-amber-600"
                      } text-white`}
                    >
                      {generatingQuiz[note._id] ? (
                        <>
                          <IconLoader2 className="h-4 w-4 mr-1 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <IconQuestionMark className="h-4 w-4 mr-1" />
                          <span>Quiz</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
