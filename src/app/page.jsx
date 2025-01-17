import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { Features } from "@/components/features"
import { ProductFeatures } from "@/components/product-features"

export default function Home() {
  return (
    (<div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <ProductFeatures />
    </div>)
  );
}

