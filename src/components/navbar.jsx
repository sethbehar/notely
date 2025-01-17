import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    (<header className="border-b bg-white">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-gray-900">
          Learnly
        </Link>
        <div className="hidden gap-6 md:flex">
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Product
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
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
          Sign Up
        </Button>
      </nav>
    </header>)
  );
}

