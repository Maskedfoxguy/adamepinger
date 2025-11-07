// client/src/components/ProjectsSection.tsx
// This component displays a grid of all project cards.

import React from 'react';
import ProjectCard from './ProjectCard'; // Import our new card component.

// Placeholder data for our projects.
const projects = [
  {
    title: 'Project One',
    screenshotUrl: 'https://via.placeholder.com/300', // A placeholder image URL.
    projectUrl: '/projects/one',
  },
  {
    title: 'Project Two',
    screenshotUrl: 'https://via.placeholder.com/300',
    projectUrl: '/projects/two',
  },
  {
    title: 'Project Three',
    screenshotUrl: 'https://via.placeholder.com/300',
    projectUrl: '/projects/three',
  },
];

const ProjectsSection: React.FC = () => {
  return (
    // The main section container. The id="projects" is the target for the hero button.
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-16 text-white">My Work</h2>
        
        {/* This div will arrange our cards in a grid. */}
        {/* 'flex' and 'justify-center' centers the cards. */}
        {/* 'flex-wrap' allows cards to wrap to the next line on smaller screens. */}
        {/* 'gap-8' adds space between the cards. */}
        <div className="flex justify-center items-center flex-wrap gap-8">
          {/* We loop over our projects data and create a card for each one. */}
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              screenshotUrl={project.screenshotUrl}
              projectUrl={project.projectUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;