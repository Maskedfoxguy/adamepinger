// HomeHero.tsx
// A small hero section shown at the top of the single-scroll page.
import React from "react";

const HomeHero: React.FC = () => {
  return (
    <section
      id="home-hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4"
      aria-label="Hero section"
    >
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to My Portfolio
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          Showcasing my professional journey, projects, and skills
        </p>
        <button
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
          aria-label="Explore my work"
        >
          Explore My Work
        </button>
      </div>
    </section>
  );
};

export default HomeHero;
