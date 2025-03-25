"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function Notes() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      axios
        .get("http://127.0.0.1:5000/notes", {  // ensure this endpoint matches your Flask route
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

  if (loading) {
    return <div className="p-4">Loading notes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-neutral-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        My Notes
      </h1>
      {notes.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No notes available. Start a conversation to create a note!
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="p-4 bg-white rounded shadow">
              <p className="text-gray-800">{note.content}</p>
              <small className="text-gray-500">
                {new Date(note.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
