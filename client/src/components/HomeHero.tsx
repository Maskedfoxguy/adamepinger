// HomeHero.tsx
// A small hero section shown at the top of the single-scroll page.
// This version includes an avatar image and brief intro text beside the heading.
import React from "react";

const HomeHero: React.FC = () => {
  return (
    // Use a flex layout that stacks on small screens and places image left on md+.
    <div
      id="home-hero"
      aria-label="Home hero section"
      className="py-16 px-6"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Avatar image: stored in public/avatar.jpg so it's referenced by '/avatar.jpg' */}
        <img
          src="/avatar.jpg" // put your image at public/avatar.jpg
          alt="Adam Epinger portrait" // accessible alt text describing the photo
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-sm"
        />

        {/* Text block: heading + intro + CTA */}
        <div className="text-center md:text-left">
          {/* H1: one per page — keep clear for SEO/Screen readers */}
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Welcome! I'm Adam Epinger.
            I build clean, accessible interfaces with React and Tailwind. Calm service mindset, practical results.
             Opera, MEWS, VIPS PMS. React, Node.js, MongoDB.
          </h1>

          {/* Short intro paragraph — concise so visitors skim easily */}
          <p className="text-gray-700 mb-4 max-w-xl">
            Full-stack developer rebuilding skills after Ironhack Amsterdam. 
            I love crafting clean, accessible UI with React and Tailwind. 
            Right now I’m building a single-scroll résumé and portfolio. 
            I’m also learning to work with AI through prompts and agent design, not to skip the work but to learn faster and smarter.
          </p>

          {/* CTA linking to Projects */}
          <a
            href="#projects"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            aria-label="See projects"
          >
            See projects
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;