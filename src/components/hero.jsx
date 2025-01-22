import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    (<section className="font-poppins  to-white py-20">
      <div className="flex flex-col items-center text-center">
        <Badge className="bg-emerald-500 font-normal">📓 Try It For Free Now 📓</Badge>
        <h1
          className="leading-5 mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
          Study Smarter and Organized, with <span className="text-5xl font-playwrite">Notely</span>
        </h1>
        <p className="mt- max-w-xl text-lg text-gray-600">
          Let's make your notes more organized and easily using the Learnly. Organized to study harder than ever before.
        </p>
        <div className="mt-12 flex gap-4">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
            Sign Up
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </div>
    </section>)
  );
}

