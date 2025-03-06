"use client"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar"
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
} from "@tabler/icons-react"
import { FaCircleUser } from "react-icons/fa6"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Note from "@/components/note"

// Mock data for recent notes
const recentNotes = [
  { id: 1, title: "Biology 101: Cell Structure", updatedAt: "2 hours ago", category: "Biology" },
  { id: 2, title: "History: World War II Overview", updatedAt: "Yesterday", category: "History" },
  { id: 3, title: "Calculus: Integration Techniques", updatedAt: "3 days ago", category: "Mathematics" },
]

export default function SidebarDemo() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center">
        <Image src="/loading.gif" width={100} height={75} alt="Loading..." />
      </div>
    )
  }

  const userName = isSignedIn && user ? user.firstName || user.fullName || "User" : "Guest"
  
  // DUMMY DATA (FOR NOW)
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Notes",
      href: "/notes",
      icon: <IconFileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Quizzes",
      href: "#",
      icon: <IconQuestionMark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Upload Note",
      href: "#",
      icon: <IconUpload className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Flashcards",
      href: "#",
      icon: <IconLayoutCards className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ]

  const handleSend = async () => {
    console.log("User: ", user)
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/chat",
        { message: input },
        { headers: { "X-Clerk-User-Id": user.id } },
      )
      console.log(res)
      setResponse(res.data.response)
    } catch (error) {
      console.error("Error fetching response:", error)
      setResponse("Error fetching response.")
    }
  }

  return (
    <div
      className={cn(
        "font-poppins font-semibold rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 min-w-full w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo />: <LogoIcon />}
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
                icon: <FaCircleUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard userName={userName} input={input} setInput={setInput} response={response} handleSend={handleSend} />
    </div>
  )
}

export const Logo = () => {
  return (
    <Link href="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-playwrite font-semibold text-black dark:text-white whitespace-pre"
      >
        Notely
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 flex items-center justify-center font-semibold font-playwrite text-xl">
        <p className="p-8">N</p>
      </div>
    </Link>
  )
}

const Dashboard = ({ userName, input, setInput, response, handleSend }) => {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex flex-1">
        <div className="p-2 md:p-10">Loading...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <div>Please sign in.</div>
  }

  return (
    <div className="flex flex-1 overflow-auto">
      <div className="p-2 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full">
        <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded-lg mx-4 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hello, {userName}! 👋</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to your Notely dashboard. What would you like to do today?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 dark:border-neutral-700">
            <div className="flex items-start border-2 border-gray-200 rounded-lg p-4  hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-2 mr-3">
                <IconPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Create New Note</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Start a fresh note with our editor.</p>
                <Link
                  href="/test"
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-all hover:underline dark:hover:text-emerald-300"
                >
                  Create Note →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg  p-4 dark:border-neutral-700 ">
            <div className="flex items-start border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2 mr-3 ">
                <IconFolder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">View Notes</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Access all your existing notes.</p>
                <Link
                  href="/notes"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-all hover:underline dark:hover:text-blue-300"
                >
                  View All →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 dark:border-neutral-700">
            <div className="flex items-start border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 dark:bg-purple-900/50 rounded-full p-2 mr-3">
                <IconUpload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Upload PDF</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Import text from PDF documents.</p>
                <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-all hover:underline dark:hover:text-purple-300">
                  Upload PDF →
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border mx-4 border-gray-100 dark:border-neutral-700 mb-6">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
            <div className="flex items-center">
              <IconClock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Notes</h3>
            </div>
            <Link
              href="#"
              className="text-md font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              View All
            </Link>
          </div>
          <div>
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="px-4 py-3 border-b border-gray-200 dark:border-neutral-700 last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{note.title}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-3">{note.updatedAt}</span>
                      <span className="text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                        {note.category}
                      </span>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                    Open →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-100 dark:border-neutral-700">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
          </div>
          <div className="p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me something..."
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors"
              >
                Send
              </button>
            </div>
            {response && (
              <div className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-neutral-700/50 border border-gray-200 dark:border-neutral-600">
                <p className="text-sm text-gray-700 dark:text-gray-200">{response}</p>
              </div>
            )}
          </div>
        </div>

        {/* Note component */}
        <div className="w-full mt-4">
          <Note />
        </div>
      </div>
    </div>
  )
}

