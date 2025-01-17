import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ProductFeatures() {
  const features = [
    {
      title: "Collaboration Teams",
      icon: "/placeholder.svg?height=100&width=100"
    },
    {
      title: "Cloud Storage",
      icon: "/placeholder.svg?height=100&width=100"
    },
    {
      title: "Daily Analytics",
      icon: "/placeholder.svg?height=100&width=100"
    }
  ]

  return (
    (<section className="py-16">
      <div className="container">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Our Features you can get
          </h2>
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            Get Started
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border bg-white p-6 shadow-sm">
              <Image
                src={feature.icon || "/placeholder.svg"}
                alt={feature.title}
                width={100}
                height={100}
                className="mb-4" />
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>)
  );
}

