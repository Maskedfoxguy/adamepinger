// ProjectsPreview.tsx
// Compact preview area showing a few project cards.
// Replace the placeholder data with real project metadata later.
import React from "react";

type Project = {
  id: string;
  title: string;
  short: string;
};

const demoProjects: Project[] = [
  { id: "p1", title: "Project One", short: "A short summary of project one." },
  { id: "p2", title: "Project Two", short: "Quick note about project two." },
  { id: "p3", title: "Project Three", short: "What makes project three special." },
];

const ProjectsPreview: React.FC = () => {
  return (
    <section id="projects" aria-label="Projects preview" className="py-12 px-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Selected projects</h2>

      {/* Simple responsive grid. Swap Tailwind classes or add your own CSS later. */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto">
        {demoProjects.map((p) => (
          <article
            key={p.id}
            className="border rounded p-4 shadow-sm hover:shadow-md"
            aria-labelledby={`proj-${p.id}-title`}
            role="group"
          >
            {/* Card title */}
            <h3 id={`proj-${p.id}-title`} className="font-medium mb-2">
              {p.title}
            </h3>

            {/* Short description */}
            <p className="text-sm text-gray-600 mb-4">{p.short}</p>

            {/* Placeholder action — later you can link to a project page or open a modal. */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-blue-600 hover:underline"
              aria-label={`View details for ${p.title}`}
            >
              View details
            </a>
          </article>
        ))}
      </div>

      {/* Tip for you: replace demoProjects with data from a JSON file or fetch call. */}
    </section>
  );
};

export default ProjectsPreview;