import { Check } from 'lucide-react'

export function Features() {
  const features = [
    {
      title: "Publishing",
      description: "Seamlessly publish and distribute your content for your target audience",
      rating: "4.9",
      reviews: "14 rating"
    },
    {
      title: "Analytics",
      description: "Track performance and create gorgeous reports",
      rating: "4.8",
      reviews: "12 rating"
    },
    {
      title: "Engagement",
      description: "Interact and engage with your audience",
      rating: "4.9",
      reviews: "8 rating"
    }
  ]

  return (
    (<section className="py-16">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            How we support our partners all over the world
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-sm text-gray-600">
                  {feature.rating} • {feature.reviews}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>)
  );
}

