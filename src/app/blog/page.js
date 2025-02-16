import Link from "next/link"
import { Button } from "@/components/ui/button"

const blogPosts = [
  {
    id: 1,
    title: "10 Effective Study Techniques for Better Learning",
    excerpt:
      "Discover proven study methods that can help you retain information more effectively and improve your academic performance.",
    date: "2025-02-10",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Power of Digital Note-Taking: Why You Should Switch",
    excerpt:
      "Explore the benefits of digital note-taking and how it can revolutionize your study habits and organization skills.",
    date: "2025-02-08",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "How to Create a Productive Study Environment at Home",
    excerpt:
      "Learn how to set up the perfect study space that minimizes distractions and maximizes your focus and productivity.",
    date: "2025-02-05",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "The Art of Time Management for Students",
    excerpt: "Master the skills of effective time management to balance your studies, social life, and personal time.",
    date: "2025-02-01",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "Memory Techniques: Boost Your Recall for Exams",
    excerpt:
      "Discover powerful memory techniques that can help you remember more information and perform better in exams.",
    date: "2025-01-28",
    readTime: "5 min read",
  },
]

for (let i = 6; i <= 20; i++) {
  blogPosts.push({
    id: i,
    title: `Future Blog Post ${i}`,
    excerpt:
      "We'll let users upload content here PLACREHOLD",
    date: `2025-01-${28 - i < 10 ? "0" + (28 - i) : 28 - i}`,
    readTime: `${Math.floor(Math.random() * 5) + 3} min read`,
  })
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Notely Blog</h1>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50">
                  <Button variant="link" className="text-emerald-600 hover:text-emerald-700">
                    Read more
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2025 Notely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

