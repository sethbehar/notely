import { Book, Brain, Users, Zap } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "Notely has completely transformed how I study. It's intuitive, powerful, and has significantly improved my grades.",
    author: "Sara Moss",
    role: "Computer Science Student at Washington University in St. Louis",
    avatar: "/headshots/sara.jpg?height=60&width=60",
  },
  {
    quote:
      "As a medical student, organizing vast amounts of information is crucial. Notely makes this process effortless and enjoyable.",
    author: "Ryan Sturisky",
    role: "Medical Student at the University of Florida",
    avatar: "/headshots/stu.jpg?height=60&width=60",
  },
  {
    quote:
      "The collaborative features in Notely have made group projects so much easier. It's a game-changer for team studying.",
    author: "Eric Minsky",
    role: "Finance Student at the University of Pennsylvania",
    avatar: "/headshots/mink.jpg?height=60&width=60",
  },
];

const features = [
  {
    icon: <Book className="h-8 w-8 text-emerald-500" />,
    title: "Smart Organization",
    description:
      "Automatically categorize and tag your notes for easy retrieval.",
  },
  {
    icon: <Brain className="h-8 w-8 text-emerald-500" />,
    title: "AI-Powered Insights",
    description: "Get intelligent summaries and study recommendations.",
  },
  {
    icon: <Users className="h-8 w-8 text-emerald-500" />,
    title: "Collaborative Study",
    description: "Work together with classmates in real-time on shared notes.",
  },
  {
    icon: <Zap className="h-8 w-8 text-emerald-500" />,
    title: "Instant Sync",
    description: "Access your notes across all devices, always up-to-date.",
  },
];

export function ProductFeatures() {
  return (
    <section className="font-poppins bg-white border border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-16 border-b border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-900 sm:text-4xl mb-16">
          Powerful Features for Smarter Studying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-emerald-100 rounded-full p-3 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="">
        <div className="flex justify-center content-center border-b border-gray-200">
          <div className="flex flex-col mt-16">
            <Image
              src="/demo.png"
              alt="Product Features"
              width={800}
              height={500}
              className="rounded-lg border border-gray-200 shadow-md"
            />
            <p className="text-md align-center text-center text-gray-600 italic font-semibold mt-4 mb-16">
              Real Product Images
            </p>
          </div>
        </div>
        <div className="bg-emerald-lines pb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-900 sm:text-4xl pt-16 pb-16">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-md"
              >
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
