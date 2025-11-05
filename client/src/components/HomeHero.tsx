// HomeHero.tsx
// A small hero section shown at the top of the single-scroll page.
// This is intentionally minimal and heavily commented for learning.
import React from "react";

const HomeHero: React.FC = () => {
  return (
    // Use a semantic section so screen readers know this is a distinct area.
    <div
      id="home-hero"
      aria-label="Home hero section"
      className="py-16 px-6 text-center"
    >
      {/* Main heading — use one H1 per page (if this component is used on the main page it can be H1).
          Headings give structure and help SEO + accessibility. */}
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Hi — I'm Adam Pinger</h1>

      {/* Short intro paragraph. Keep content concise so visitors scan quickly. */}
      <p className="max-w-2xl mx-auto text-gray-700 mb-6">
        I'm a frontend developer rebuilding my skills and crafting readable,
        accessible web interfaces. This site is my portfolio and résumé — enjoy
        the scroll.
      </p>

      {/* CTA linking to the Projects section — an in-page anchor makes the single-scroll flow smooth. */}
      <a
        href="#projects"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        aria-label="See projects"
      >
        See projects
      </a>
    </div>
  );
};

export default HomeHero;
