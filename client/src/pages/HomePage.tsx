import React from 'react';
import HomeHero from '../components/HomeHero';
import ProjectsSection from '../components/ProjectsSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const HomePage: React.FC = () => {
  return (
    <div>
      <HomeHero />
      {/* 2. Place the new section right below the hero. */}
      <ProjectsSection />
      {/* Other page sections can be added here later. */}
       <AboutSection />
      {/* Other page sections like 'Contact' can be added here later. */}
      <ContactSection />
    </div>
  );
};

export default HomePage;