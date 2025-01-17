import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Cloud, BarChart } from "lucide-react";

export function ProductFeatures() {
  const features = [
    {
      title: "Flashcards",
      description: "These flashcards help you study",
      icon: BookOpen,
    },
    {
      title: "Quizzes",
      description: "Generate quizzes from your study material",
      icon: Cloud,
    },
    {
      title: "Notetaking",
      description: "Take your notes here on the web",
      icon: BarChart,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div>
        <div className="mb-12 flex flex-col md:flex-row items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Our Notely Features
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3 ml-2 mr-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-none shadow-lg hover:bg-emerald-50 transition duration-300"
            >
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
