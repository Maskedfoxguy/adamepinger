// ProjectsPreview.tsx
// Compact preview area showing a few project cards.
import React from "react";

type Project = { id: string; title: string; short: string };

const demoProjects: Project[] = [
  { id: "p1", title: "Project One", short: "A short summary of project one." },
  { id: "p2", title: "Project Two", short: "Quick note about project two." },
  { id: "p3", title: "Project Three", short: "What makes project three special." }
];

const ProjectsPreview: React.FC = () => {
  return (
    <section
      id="projects-preview"
      className="min-h-screen py-16 px-4 bg-white"
      aria-label="Projects preview section"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoProjects.map((project) => (
            <article
              key={project.id}
              className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow"
              aria-labelledby={`project-title-${project.id}`}
            >
              <h3
                id={`project-title-${project.id}`}
                className="text-2xl font-semibold text-gray-900 mb-3"
              >
                {project.title}
              </h3>
              <p className="text-gray-600">{project.short}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
