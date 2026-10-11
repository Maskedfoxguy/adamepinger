import React from 'react';
import HomeHero from '../components/HomeHero';
import ProjectsSection from '../components/ProjectsSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const SHOW_PROJECTS_SECTION = false;


const HomePage: React.FC = () => {
  return (
    <div>
      <HomeHero />
      {SHOW_PROJECTS_SECTION && <ProjectsSection />}
      <AboutSection />
      <ContactSection />
      
    </div>
  );
};

export default HomePage;
