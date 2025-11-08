import React from 'react';
import './ProjectCard.css';

interface ProjectCardProps {
  title: string;
  screenshotUrl: string;
  projectUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, screenshotUrl, projectUrl }) => {
  const handleClick = () => {
    console.log(`Navigating to ${projectUrl}`);
  };

  return (
    <div className="project-card-container" onClick={handleClick}>
      <div className="project-card-inner">
        <div className="project-card-front">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <div
          className="project-card-back"
          style={{ backgroundImage: `url(${screenshotUrl})` }}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
