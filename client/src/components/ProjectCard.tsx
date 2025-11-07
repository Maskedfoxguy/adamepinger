// client/src/components/ProjectCard.tsx
// A single, 3D flippable card to display a project.

import React from 'react';
// We import the CSS we just created.
import './ProjectCard.css';

// This defines what information each card needs to receive.
interface ProjectCardProps {
  title: string;
  screenshotUrl: string;
  projectUrl: string; // The URL to navigate to on click.
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, screenshotUrl, projectUrl }) => {
  // This function will handle the navigation when the card is clicked.
  const handleClick = () => {
    // For now, let's just log it. We can implement navigation later.
    console.log(`Navigating to ${projectUrl}`);
    // window.location.href = projectUrl; // This is how you would actually navigate.
  };

  return (
    // The main container that handles hover and click events.
    <div className="project-card-container" onClick={handleClick}>
      {/* The inner element that performs the 3D flip. */}
      <div className="project-card-inner">
        {/* The front face of the card. */}
        <div className="project-card-front">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        {/* The back face of the card. */}
        <div 
          className="project-card-back" 
          // The background image is set dynamically based on the props.
          style={{ backgroundImage: `url(${screenshotUrl})` }}
        >
          {/* The back can be empty since the background is the content. */}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;