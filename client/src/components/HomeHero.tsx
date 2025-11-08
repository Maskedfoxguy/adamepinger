import React from 'react';
import avatar from '../assets/images/avatar.png';

const HomeHero: React.FC = () => {
  return (
    <div
      id="home-hero"
      aria-label="Home hero section"
      className="py-16 px-6 text-center"
    >
      <div className="flex justify-center mb-8">
        <img
          src={avatar}
          alt="A circular avatar of Adam Epinger."
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mb-4">Hi! I'm Adam Epinger</h1>

      <p className="max-w-2xl mx-auto text-white-700 mb-6">
        I'm a frontend developer rebuilding my skills and crafting readable,
        accessible web interfaces. This site is my portfolio and résumé.
      </p>
    </div>
  );
};

export default HomeHero;
