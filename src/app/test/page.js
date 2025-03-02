"use client";
import { useState } from "react";
import { useUser } from '@clerk/nextjs';
import axios from "axios";import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { FaCircleUser } from "react-icons/fa6";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SidebarDemo() {

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
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
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
                label: "Jacob Moss",
                href: "#",
                icon: (
                  <FaCircleUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
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
      <div className="h-5 w-6 flex items-center justify-center font-semibold font-playwrite text-xl"><p className="p-8">N</p></div>
    </Link>
  );
};

const Dashboard = () => {

  const { user, isLoaded, isSignedIn } = useUser();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  if (!isLoaded) {
    return <div className="flex flex-1"><div className="p-2 md:p-10">Loading...</div></div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in.</div>;
  }
  const handleSend = async () => {
    console.log("User: ", user)
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/chat",
        { message: input },
        { headers: { "X-Clerk-User-Id": user.id } }
      );
      console.log(res)
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
        <div className="flex gap-2">
          {[...new Array(4)].map((_, idx) => (
            <div
              key={"first-array-" + idx} // Ensured unique key for each item
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, idx) => (
            <div
              key={"second-array-" + idx} // Ensured unique key for each item
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
