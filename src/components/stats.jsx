"use client";
import { AnimatedTooltip } from "./ui/animated-tooltip";

export function Stats() {

  const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "Software Engineer",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQE7Bl4yFfh8cw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1681679856315?e=1743033600&v=beta&t=MFkSjvXP-dApd7jAg0qx85sRURiR-tH6Hr4BP8mmGvE",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Product Manager",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQHl4dzNv48i-A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1730386057119?e=1743033600&v=beta&t=_GoIhfQqb89GKojbMiwI1IjAcQj-djJnmHr9Vv9vqH0",
    },
    {
      id: 3,
      name: "Jane Smith",
      designation: "Data Scientist",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQGG2q9rW0vhhQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1681172723927?e=1743033600&v=beta&t=jD9qGUxhdsu1l9aHf5CIduAibCdNj9zEpGtIKUUDLAU",
    },
    {
      id: 4,
      name: "Emily Davis",
      designation: "UX Designer",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQFcFHteTdAy4Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1696626105082?e=1743033600&v=beta&t=BNy-uPn-r23HE241XVaCg7T9YKUQd4zDXH8d6xMR63k",
    },
    {
      id: 5,
      name: "Tyler Durden",
      designation: "Soap Developer",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQGax1nSkMoA2A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1724369421965?e=1743033600&v=beta&t=ZOXOIFdvzyFwYa7-ZoCOvVf2tSjamTjj52vUhR3t7Bc",
    },
    {
      id: 6,
      name: "Dora",
      designation: "The Explorer",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQHQ3u1GxBAC7Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1695044000689?e=1743033600&v=beta&t=NBgLiKt391oD5fPDLq-MLLhhQbUghcS1xV9QURiE1lU",
    },
  ];

  return (
    (
      <div className="font-poppins flex flex-col items-center justify-center mt-12 mb-10 w-full">
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          Join 500+ Students Today!
        </p>
        <div className="flex flex-row justify-center items-center mt-2 scale-75">
          <AnimatedTooltip items={people}/>
        </div>
      </div>
    )
  );
}

