import React from 'react';


const HomeHero: React.FC = () => {
  return (
    <div
      id="home-hero"
      aria-label="Home hero section"
      className="py-16 px-6 text-center"
    >
    
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Hi! I'm Adam Epinger</h1>

      <p className="max-w-2xl mx-auto text-white-700 mb-6">
        I'm a frontend developer rebuilding my skills and crafting readable,
        accessible web interfaces. This site is my portfolio and résumé.
      </p>
    </div>
  );
};

export default HomeHero;
