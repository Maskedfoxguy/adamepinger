import React from 'react';


const HomeHero: React.FC = () => {
  return (
    <div
      id="home-hero"
      aria-label="Home hero section"
      className="py-16 px-6 text-center"
    >
    
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Ádám Epinger</h1>

      <p className="max-w-2xl mx-auto text-white-700 mb-6">
        <b>Web Developer.<br>
        </br> Innovation and design pixel by pixel.</b>
      </p>
    </div>
  );
};

export default HomeHero;
