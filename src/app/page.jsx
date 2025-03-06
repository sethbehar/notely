import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProductFeatures } from "@/components/product-features"
import { Scroll } from "@/components/scroll"
import { Footer } from "@/components/footer"
import {FAQsection} from "@/components/faq-section";

export default function Home() {
  return (
    (<div className="min-h-screen bg-white">
      <Navbar />
      <section>
      <Hero />
      </section>
      <section id="features">
      <ProductFeatures /> 
      </section>
      <Scroll />
      <section id="faq">
      <FAQsection />
      </section>
      <Footer
      />
    </div>)
  );
}

