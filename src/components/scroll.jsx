import { Check } from 'lucide-react'
import Image from 'next/image'

const schools = [
  { name: "Harvard University", logo: "/school-logos/ucla.png" },
  { name: "Stanford University", logo: "/school-logos/uf.png" },
  { name: "MIT", logo: "/school-logos/uga.png" },
  { name: "Yale University", logo: "/school-logos/uk.png" },
  { name: "Princeton University", logo: "/school-logos/um.png" },
  { name: "Columbia University", logo: "/school-logos/ut.png" },
  { name: "University of Chicago", logo: "/school-logos/vandy.png" },
  { name: "University of Pennsylvania", logo: "/school-logos/wisco.png" },
]


export function Scroll() {
  return (
    <div className="w-full overflow-hidden bg-gray-50 pb-24 flex flex-col items-center justify-center">
       <h2 className="mt-16 text-3xl font-poppins font-semibold text-center text-gray-900 sm:text-4xl mb-16">
          Used at Hundreds of Schools
        </h2>
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

