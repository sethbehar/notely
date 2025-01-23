import { Check } from 'lucide-react'
import Image from 'next/image'

const schools = [
  { name: "Harvard University", logo: "/placeholder.svg?height=50&width=150" },
  { name: "Stanford University", logo: "/placeholder.svg?height=50&width=150" },
  { name: "MIT", logo: "/placeholder.svg?height=50&width=150" },
  { name: "Yale University", logo: "/placeholder.svg?height=50&width=150" },
  { name: "Princeton University", logo: "/placeholder.svg?height=50&width=150" },
  { name: "Columbia University", logo: "/placeholder.svg?height=50&width=150" },
  { name: "University of Chicago", logo: "/placeholder.svg?height=50&width=150" },
  { name: "University of Pennsylvania", logo: "/placeholder.svg?height=50&width=150" },
]


export function Scroll() {
  return (
    <div className="w-full overflow-hidden bg-emerald-50 py-6 flex flex-col items-center justify-center">
      <h1 className='text-xl text-gray-600 font-poppins mb-14'>
        Used At Hundreds of Schools Like
      </h1>
      <div className="flex animate-scroll">
        {[...schools, ...schools].map((school, index) => (
          <div key={index} className="flex-shrink-0 mx-8">
            <Image src={school.logo || "/placeholder.svg"} alt={school.name} width={150} height={50} />
          </div>
        ))}
      </div>
    </div>
  );
}

