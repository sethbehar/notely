"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import academicTerms from "./academicTerms"; // Default import from academicTerms.js
import { jsPDF } from "jspdf";

function Note() {
  const [title, setTitle] = useState(""); // <-- State for title
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef(null);
  
  // ---- SAVE AS PDF ----
  const handleSaveAsPDF = () => {
    // 2) Create a new jsPDF instance
    const doc = new jsPDF();

    // Optional: set some styling or position
    doc.setFontSize(14);

    // Draw the title
    doc.text(title || "Untitled Note", 10, 20);

    // Add the content
    //  - Increase the y-position for the content, so it doesn't overlap the title
    //  - Use the text() maxWidth option to wrap text
    doc.setFontSize(12);
    doc.text(content, 10, 35, { maxWidth: 180 });

    // 3) Save the PDF
    const fileName = title ? `${title}.pdf` : "untitled.pdf";
    doc.save(fileName);
  };

  // ---- AUTOCOMPLETE LOGIC BELOW ----

  // Function to get the current word being typed
  const getCurrentWord = useCallback((text, cursorPos) => {
    const textBeforeCursor = text.slice(0, cursorPos);
    const words = textBeforeCursor.split(/\s+/);
    return words[words.length - 1].toLowerCase();
  }, []);

  // Update suggestions based on current word
  useEffect(() => {
    if (!editorRef.current) return;

    const cursorPos = editorRef.current.selectionStart;
    const currentWord = getCurrentWord(content, cursorPos);

    if (currentWord.length >= 2) {
      const matchingSuggestions = academicTerms.filter(
        (term) =>
          term.toLowerCase().startsWith(currentWord) &&
          term.toLowerCase() !== currentWord
      );
      setSuggestions(matchingSuggestions.slice(0, 5));
      setSelectedSuggestion(-1);

      // Calculate position for suggestion box
      const textBeforeCursor = content.slice(0, cursorPos);
      const lines = textBeforeCursor.split("\n");
      const lineCount = lines.length;
      const lastLineLength = lines[lines.length - 1].length;

      setCursorPosition({
        top: lineCount * 24, // Approximate line height
        left: lastLineLength * 8, // Approximate character width
      });
    } else {
      setSuggestions([]);
    }
  }, [content, getCurrentWord]);

  // Handle suggestion selection with keyboard
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      const indexToUse = selectedSuggestion >= 0 ? selectedSuggestion : 0;
      applySuggestion(suggestions[indexToUse]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  // Apply the selected suggestion
  const applySuggestion = (suggestion) => {
    if (!editorRef.current) return;

    const cursorPos = editorRef.current.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPos);
    const textAfterCursor = content.slice(cursorPos);

    const words = textBeforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1];

    // Replace the current word with the suggestion
    const newTextBeforeCursor =
      textBeforeCursor.slice(0, textBeforeCursor.length - lastWord.length) +
      suggestion;
    const newContent = newTextBeforeCursor + textAfterCursor;

    setContent(newContent);
    setSuggestions([]);

    // Reposition cursor
    setTimeout(() => {
      if (editorRef.current) {
        const newCursorPos = newTextBeforeCursor.length;
        editorRef.current.selectionStart = newCursorPos;
        editorRef.current.selectionEnd = newCursorPos;
        editorRef.current.focus();
      }
    }, 0);
  };

  // ---- TOOLBAR ACTIONS (BOLD, ITALIC) ----
  const applyTextFormat = (formatType) => {
    if (!editorRef.current) return;

    const { selectionStart, selectionEnd } = editorRef.current;

    // If nothing is selected, do nothing
    if (selectionStart === selectionEnd) return;

    const before = content.slice(0, selectionStart);
    const selected = content.slice(selectionStart, selectionEnd);
    const after = content.slice(selectionEnd);

    let newText;
    if (formatType === "bold") {
      // Wrap the selection in double asterisks
      newText = `${before}**${selected}**${after}`;
    } else if (formatType === "italic") {
      // Wrap the selection in single asterisks
      newText = `${before}*${selected}*${after}`;
    } else {
      return;
    }

    setContent(newText);

    // Reposition cursor
    setTimeout(() => {
      // We'll move the cursor after the formatting
      const newPos = selectionStart + (formatType === "bold" ? 2 : 1);
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.selectionStart = newPos;
        editorRef.current.selectionEnd = newPos + selected.length;
      }
    }, 0);
  };

  // ---- SAVE & DISCARD ----
  const handleSave = () => {
    // In a real app, you'd send title & content to a server or store in localStorage
    alert(`Saved!\nTitle: ${title}\nContent:\n${content}`);
  };

  const handleDiscard = () => {
    // Clears the title and content
    setTitle("");
    setContent("");
  };

  return (
    <div className="flex flex-col p-16 font-poppins gap-4">
      {/* Title Field */}
      <input
        type="text"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        placeholder="Enter note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Toolbar for Bold/Italic */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-3 py-1 border rounded-md hover:bg-gray-100"
          onClick={() => applyTextFormat("bold")}
        >
          Bold
        </button>
        <button
          type="button"
          className="px-3 py-1 border rounded-md hover:bg-gray-100"
          onClick={() => applyTextFormat("italic")}
        >
          Italic
        </button>
      </div>

      {/* Text Editor */}
      <div className="relative">
        <textarea
          ref={editorRef}
          className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Start typing your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {suggestions.length > 0 && (
          <div
            className="absolute bg-white shadow-lg rounded-md border border-gray-200 z-10 max-w-xs"
            style={{
              top: `${cursorPosition.top + 30}px`,
              left: `${Math.min(cursorPosition.left, 300)}px`,
            }}
          >
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${
                    index === selectedSuggestion ? "bg-emerald-100" : ""
                  }`}
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Save & Discard Buttons */}
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
          onClick={handleDiscard}
        >
          Discard
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSaveAsPDF}
        >
          Save as PDF
        </button>
      </div>
    </div>
  );
}

export default Note;
