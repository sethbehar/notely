"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.gif" alt="Loading" width={100} height={75} />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 dark:text-gray-300">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center">
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white">U</span>
            </div>
          )}
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            {user.firstName || user.fullName || "User"}
          </h2>
          {user.lastName && (
            <p className="text-gray-600 dark:text-gray-300">{user.lastName}</p>
          )}
          {user.primaryEmailAddress && (
            <p className="mt-2 text-gray-700 dark:text-gray-400">
              {user.primaryEmailAddress.emailAddress}
            </p>
          )}
        </div>
        <div className="mt-6 text-center">
          <Link href="/test" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
