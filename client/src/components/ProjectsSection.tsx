import React from 'react';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: 'Project One',
    screenshotUrl: 'https://via.placeholder.com/300',
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
    <section id="projects" className="py-20 px-4">
      <div className="max-w-[1500px] mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-16 text-white">My Work</h2>

    
        <div className="flex justify-between items-center flex-wrap gap-8">
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