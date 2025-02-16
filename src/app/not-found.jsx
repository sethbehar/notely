import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-emerald-500 flex flex-col items-center justify-center font-poppins">
      <div className="relative">
        <div className="absolute -z-10 -top-20 -left-20 h-[300px] w-[300px] rounded-full bg-emerald-400 opacity-50 blur-3xl" />
        <div className="text-center relative z-10">
          <h1 className="text-6xl font-semibold text-white mb-4">404</h1>
          <h2 className="text-3xl font-medium text-emerald-100 mb-6">Page Not Found</h2>
          <p className="text-lg text-emerald-50 mb-8 max-w-md">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-500 hover:bg-emerald-50">
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
    </div>
  )
}

