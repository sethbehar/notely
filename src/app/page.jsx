import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProductFeatures } from "@/components/product-features"
import { Scroll } from "@/components/scroll"

export default function Home() {
  return (
    (<div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Scroll />
      <ProductFeatures />
    </div>)
  );
}

