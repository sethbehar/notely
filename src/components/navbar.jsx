import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaBookOpenReader } from "react-icons/fa6";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export function Navbar() {
  return (
    <header className="border-b bg-white font-poppins font-semibold">
      <nav className="flex h-16 items-center justify-between gap-32 p-8">
        <Link
          href="/"
          className="font-playwrite text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          {/* <FaBookOpenReader /> */}
          <h1>Notely</h1>
        </Link>
        <div className="hidden gap-6 md:flex">
          <Link href="/test" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Blog
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            About Us
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2">
          <SignedOut>
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
          <SignInButton />
          </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
