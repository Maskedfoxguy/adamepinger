import React from 'react';
import HomeHero from '../components/HomeHero';
import ProjectsSection from '../components/ProjectsSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';


const HomePage: React.FC = () => {
  return (
    <div>
      <HomeHero />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
      
    </div>
  );
};

export default HomePage;
