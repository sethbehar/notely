"use client";
import { AnimatedTooltip } from "./ui/animated-tooltip";

export function Stats() {

  const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "Software Engineer",
      image:
        "/headshots/michael.jpeg",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Product Manager",
      image:
        "/headshots/zz.jpeg",
    },
    {
      id: 3,
      name: "Jane Smith",
      designation: "Data Scientist",
      image:
        "/headshots/liv.jpeg",
    },
    {
      id: 4,
      name: "Emily Davis",
      designation: "UX Designer",
      image:
        "/headshots/jacob.jpeg",
    },
    {
      id: 5,
      name: "Tyler Durden",
      designation: "Soap Developer",
      image:
        "/headshots/seth.jpg",
    },
    {
      id: 6,
      name: "Dora",
      designation: "The Explorer",
      image:
        "/headshots/hank.jpeg",
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

