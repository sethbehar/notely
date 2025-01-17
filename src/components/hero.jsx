import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    (<section className="bg-gradient-to-b from-emerald-50 to-white py-20">
      <div className="flex flex-col items-center text-center">
        <h1
          className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Study Smart and Organized, with AI
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Let's make your notes more organized and easily using the Learnly. Organized to study harder than ever before.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
            Try Now Free
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </div>
    </section>)
  );
}

