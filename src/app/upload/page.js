"use client"

import { useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { IconUpload, IconFile, IconX, IconCheck, IconArrowLeft, IconAlertCircle } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// Maximum file size: 20MB in bytes
const MAX_FILE_SIZE = 20 * 1024 * 1024

export default function UploadPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [noteDescription, setNoteDescription] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")

  const fileInputRef = useRef(null)

  // Reset upload progress when file changes
  useEffect(() => {
    setUploadProgress(0)
    setUploadStatus("idle")
    setErrorMessage("")
  }, [file])

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Validate file type and size
  const validateFile = (file) => {
    // Check file type
    if (file.type !== "application/pdf") {
      return { valid: false, message: "Only PDF files are allowed." }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      }
    }

    return { valid: true }
  }

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      const validation = validateFile(droppedFile)

      if (validation.valid) {
        setFile(droppedFile)
        // Auto-fill title from filename (remove extension)
        const fileName = droppedFile.name.replace(/\.[^/.]+$/, "")
        setNoteTitle(fileName)
      } else {
        setErrorMessage(validation.message || "Invalid file")
        setUploadStatus("error")
      }
    }
  }

  // Handle file selection via input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const validation = validateFile(selectedFile)

      if (validation.valid) {
        setFile(selectedFile)
        // Auto-fill title from filename (remove extension)
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "")
        setNoteTitle(fileName)
      } else {
        setErrorMessage(validation.message || "Invalid file")
        setUploadStatus("error")
      }
    }
  }

  // Handle tag input
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Simulate file upload
  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Simulate API call
    try {
      // In a real app, you would upload the file to your server here
      await new Promise((resolve) => setTimeout(resolve, 4000))

      clearInterval(interval)
      setUploadProgress(100)
      setUploadStatus("success")

      // In a real app, you would handle the server response here
      console.log("Upload successful", {
        file,
        title: noteTitle,
        description: noteDescription,
        tags,
      })
    } catch (error) {
      clearInterval(interval)
      setUploadStatus("error")
      setErrorMessage("An error occurred during upload. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  // Reset the form
  const handleReset = () => {
    setFile(null)
    setNoteTitle("")
    setNoteDescription("")
    setTags([])
    setTagInput("")
    setUploadProgress(0)
    setUploadStatus("idle")
    setErrorMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Please sign in to upload notes</h1>
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Note</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {/* File Upload Area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-300 dark:border-neutral-600 hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-neutral-700/50",
                file && "border-emerald-500",
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />

              {!file ? (
                <div className="space-y-4">
                  <div className="mx-auto flex justify-center">
                    <IconUpload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Drag and drop your PDF here</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">or click to browse (Max size: 20MB)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto flex justify-center">
                    <IconFile className="h-12 w-12 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  {uploadStatus === "success" && (
                    <div className="flex items-center justify-center text-emerald-500">
                      <IconCheck className="h-5 w-5 mr-1" />
                      <span>Upload successful!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error message */}
              {uploadStatus === "error" && (
                <div className="mt-4 text-red-500 flex items-center justify-center">
                  <IconAlertCircle className="h-5 w-5 mr-1" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Upload progress */}
              {isUploading && (
                <div className="mt-4 w-full">
                  <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>

            {/* Note Details Form */}
            {file && (
              <div className="mt-8 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Note Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Enter a title for your note"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Add a brief description of this note"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags (Optional)
                  </label>
                  <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-md"
                      >
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
                        >
                          <IconX className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      className="flex-1 min-w-[120px] border-0 p-0 focus:ring-0 bg-transparent text-gray-900 dark:text-white"
                      placeholder={tags.length === 0 ? "Add tags (press Enter after each tag)" : ""}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading || uploadStatus === "success"}
                    className={cn(
                      "px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      isUploading || uploadStatus === "success"
                        ? "bg-emerald-400 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600",
                    )}
                  >
                    {isUploading ? "Uploading..." : uploadStatus === "success" ? "Uploaded" : "Upload Note"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

