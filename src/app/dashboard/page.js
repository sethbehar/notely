"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
  IconFileText,
  IconQuestionMark,
  IconUpload,
  IconLayoutCards,
  IconPlus,
  IconFolder,
  IconSearch,
  IconClock,
} from "@tabler/icons-react";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Note from "@/components/note";

const recentNotes = [
  {
    id: 1,
    title: "Biology 101: Cell Structure",
    updatedAt: "2 hours ago",
    category: "Biology",
  },
  {
    id: 2,
    title: "History: World War II Overview",
    updatedAt: "Yesterday",
    category: "History",
  },
  {
    id: 3,
    title: "Calculus: Integration Techniques",
    updatedAt: "3 days ago",
    category: "Mathematics",
  },
];

export default function SidebarDemo() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center">
        <Image src="/loading.gif" width={100} height={75} alt="Loading..." />
      </div>
    );
  }

  const userName =
    isSignedIn && user ? user.firstName || user.fullName || "User" : "Guest";

  // DUMMY DATA (FOR NOW)
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Notes",
      href: "/notes",
      icon: (
        <IconFileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Quizzes",
      href: "/quizzes",
      icon: (
        <IconQuestionMark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Upload Note",
      href: "/upload",
      icon: (
        <IconUpload className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Flashcards",
      href: "/flashcards",
      icon: (
        <IconLayoutCards className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },

  ];

  const handleSend = async () => {
    console.log("User: ", user);
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/chat",
        { message: input },
        { headers: { "X-Clerk-User-Id": user.id } }
      );
      console.log(res);
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error fetching response.");
    }
  };

  return (
    <div
      className={cn(
        "font-poppins font-semibold rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 min-w-full w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "min-h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userName,
                href: "#",
                icon: (
                  <FaCircleUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard
        userName={userName}
        input={input}
        setInput={setInput}
        response={response}
        handleSend={handleSend}
      />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-playwrite font-semibold text-black dark:text-white whitespace-pre"
      >
        Notely
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 flex items-center justify-center font-semibold font-playwrite text-lg">
        <p className="">N</p>
      </div>
    </Link>
  );
};

const Dashboard = ({ userName, input, setInput, response, handleSend }) => {
  const { isLoaded, isSignedIn } = useUser();

  // 1) Add state to track whether the Note component is visible
  const [showNote, setShowNote] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex flex-1">
        <div className="p-2 md:p-10">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <div>Please sign in.</div>;
  }

  return (
    <div className="flex flex-1 overflow-auto bg-white">
      <div className="p-2 md:p-6  border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full">
        <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded-lg mx-4 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Hello, {userName}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to your Notely dashboard. What would you like to do today?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 dark:border-neutral-700">
            <div className="flex items-start border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-2 mr-3">
                <IconPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Create New Note
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Start a fresh note with our editor.
                </p>
                <button
                  onClick={() => setShowNote(true)}
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-all hover:underline dark:hover:text-emerald-300"
                >
                  Create Note →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 dark:border-neutral-700">
            <div className="flex items-start border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2 mr-3">
                <IconFolder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  View Notes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Access all your existing notes.
                </p>
                <Link
                  href="/notes"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-all hover:underline dark:hover:text-blue-300"
                >
                  View All →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg  p-4 dark:border-neutral-700">
            <div className="flex items-start border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 dark:bg-purple-900/50 rounded-full p-2 mr-3">
                <IconUpload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Upload PDF
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Import text from PDF documents.
                </p>
                <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-all hover:underline dark:hover:text-purple-300">
                  <a href="/upload">Upload PDF →</a>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-4 bg-white">
          <Note />
        </div>
      </div>
    </div>
  );
};
