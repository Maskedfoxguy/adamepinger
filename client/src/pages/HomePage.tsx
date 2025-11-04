// HomePage.tsx
// The main single-scroll landing page for the application.
import React from 'react';
import HomeHero from '../components/HomeHero'; // Import the hero component

// This is the functional component for the HomePage.
// We've typed its return value as JSX.Element for clarity.
const HomePage = (): JSX.Element => {
  return (
    <div>
      {/* The first section of our page is the HomeHero. */}
      <HomeHero />

      {/* Later, we will add other sections like ProjectPreview here. */}
    </div>
  );
};

export default HomePage;