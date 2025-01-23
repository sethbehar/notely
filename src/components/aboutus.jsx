import Image from "next/image"

const people = [
  {
    name: "Jake Moss",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHQ3u1GxBAC7Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1695044000689?e=1743033600&v=beta&t=NBgLiKt391oD5fPDLq-MLLhhQbUghcS1xV9QURiE1lU",
    description: "Jake is a 10x dev with 40 YOE",
  },
  {
    name: "Seth Behar",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGax1nSkMoA2A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1724369421965?e=1743033600&v=beta&t=ZOXOIFdvzyFwYa7-ZoCOvVf2tSjamTjj52vUhR3t7Bc",
    description: "Seth is a 10x dev with 40 YOE",
  },
]
export function AboutUs() {
  return (
    <div className="flex flex-col items-center justify-center mt-12 mb-10 w-full">
      <h1 className="font-poppins text-3xl font-semibold mb-8">
        About Us
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {people.map((person) => (
            <div
              key={person.name}
              className="bg-white rounded-lg shadow-md p-6 max-w-xs w-full hover:-translate-y-[2px] transition-transform duration-200 cursor-pointer border-b-2 border-transparent hover:border-black"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={person.image || "/placeholder.svg"}
                  alt={person.name}
                  width={120}
                  height={120}
                  className="rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
                <p className="text-center text-gray-600">{person.description}</p>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
