import React from 'react';
import HomeHero from '../components/HomeHero';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* The first section of our page is the HomeHero */}
      <HomeHero />
      
      {/* We will add more components here later, like ProjectsPreview, etc. */}
    </div>
  );
};

export default HomePage;