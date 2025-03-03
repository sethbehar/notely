"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is Notely?",
    answer: "Notely is an AI-powered note-taking and study tool designed to help students organize their notes, collaborate with classmates, and learn more efficiently."
  },
  {
    question: "How does the AI feature work?",
    answer: "Our AI analyzes your notes to generate summaries, create study guides, and provide personalized study recommendations based on your learning patterns and content."
  },
  {
    question: "Can I access Notely on multiple devices?",
    answer: "Yes! Notely is cloud-based, allowing you to access your notes from any device with an internet connection. Your notes sync automatically across all your devices."
  },
  {
    question: "Is there a free version of Notely?",
    answer: "We offer a free basic plan with limited features. For full access to all Notely features, including advanced AI capabilities, we recommend our affordable premium plans."
  },
  {
    question: "How secure are my notes?",
    answer: "We take data security seriously. All notes are encrypted both in transit and at rest. We use industry-standard security measures to protect your information."
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4 font-poppins">
      <button
        className="flex w-full justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-emerald-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-emerald-500" />
        )}
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600">
          {answer}
        </p>
      )}
    </div>
  );
}

export function FAQsection() {
  return (
    <section className="py-16 bg-gray-50 font-poppins bg-emerald-stars border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
         <h2 className="text-3xl font-semibold text-center text-gray-900 sm:text-4xl mb-8">
          Frequently Asked Questions
        </h2>
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
