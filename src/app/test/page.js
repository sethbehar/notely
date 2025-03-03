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
  IconLayoutCards
} from "@tabler/icons-react";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Note from '@/components/note';

export default function SidebarDemo() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  // Render a loading indicator until user data is loaded
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center">
        <Image src="/loading.gif" width={100} height={75} alt="Loading..." />
      </div>
    );
  }

  // Set username based on available data (fallback to "Guest")
  const userName =
    isSignedIn && user ? user.firstName || user.fullName || "User" : "Guest";

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: "Notes",
      href: "/notes",
      icon: (
        <IconFileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: "Quizzes",
      href: "#",
      icon: (
        <IconQuestionMark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: "Upload Note",
      href: "#",
      icon: (
        <IconUpload className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: "Flashcards",
      href: "#",
      icon: (
        <IconLayoutCards className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    }
  ];

  return (
    <div
      className={cn(
        "font-poppins font-semibold rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 min-w-full w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
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
                )
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
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
      <div className="h-5 w-6 flex items-center justify-center font-semibold font-playwrite text-xl">
        <p className="p-8">N</p>
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

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
    <div className="flex flex-1">
      <div
        className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full"
      >
        <div className="p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something..."
            className="border p-2 w-full"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white p-2 mt-2 rounded"
          >
            Send
          </button>
          {response && (
            <div className="mt-4 p-2 border rounded bg-gray-100">
              <strong>AI Response:</strong> {response}
            </div>
          )}
        </div>
        <div className="w-full">
          <Note />
        </div>
      </div>
    </div>
  );
};
