// client/src/pages/HomePage.tsx
// The main single-scroll landing page for the site.

import React from 'react';
import HomeHero from '../components/HomeHero';
// 1. Import the new ProjectsSection component.
import ProjectsSection from '../components/ProjectsSection';

const HomePage: React.FC = () => {
  return (
    <div>
      <HomeHero />
      {/* 2. Place the new section right below the hero. */}
      <ProjectsSection />
      {/* Other page sections can be added here later. */}
    </div>
  );
};

export default HomePage;