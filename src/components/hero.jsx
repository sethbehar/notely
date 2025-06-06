import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stats } from "./stats.jsx";

export function Hero() {

  return (
    <section className="font-poppins relative min-h-[600px] overflow-hidden md:p-20 p-20 bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/3 top-1/4 h-[300px] w-[300px] animate-pulse rounded-full bg-emerald-200 opacity-70 blur-2xl" />
        <div
          className="absolute right-1/4 bottom-1/3 h-[350px] w-[350px] animate-pulse rounded-full bg-emerald-200 opacity-70 blur-2xl"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute left-1/4 bottom-1/2 h-[250px] w-[250px] animate-pulse rounded-full bg-emerald-300 opacity-60 blur-2xl"
          style={{ animationDelay: "2s" }}
        />
      </div>
      <div
        className="absolute inset-0 z-10 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#22c55e 2px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="flex flex-col items-center text-center relative z-20">
        <Badge className="bg-emerald-500 font-normal">
          Try It For Free Now
        </Badge>
        <h1 className="leading-10 mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:leading-none sm:text-6xl">
          Ace Your Studies — The Smart Way with {" "}
          <span className="sm:text-5xl text-3xl font-playwrite">Notely</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
        Generate quizzes and flashcards on the fly using Notely's powerful AI learning technology.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
          <a href="/dashboard">Dashboard</a>
          </Button>
          <Button size="lg" variant="outline" className="hover:bg-gray-200 transition-all">
            <a href="#demo">View Demo</a>
          </Button>
        </div>
        <Stats />
      </div>
    </section>
  );
}
