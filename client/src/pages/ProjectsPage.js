// Lists the portfolio projects pulled from the backend.
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading/Loading';
import { fetchProjects } from '../services/api';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false; // Avoid updating state if the component unmounts.

    async function loadProjects() {
      try {
        const portfolio = await fetchProjects();
        if (!ignore) {
          setProjects(portfolio);
          setError(null);
        }
      } catch (apiError) {
        if (!ignore) {
          setError(apiError.message || 'Unable to load projects.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <Loading />; // Provide visual feedback while loading project data.
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (projects.length === 0) {
    return <p>No projects have been published yet.</p>;
  }

  return (
    <section>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <article>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <p>
                <strong>Status:</strong> {project.status}
              </p>
              <p>
                <strong>Timeline:</strong> {new Date(project.startDate).toLocaleDateString()} —{' '}
                {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'In progress'}
              </p>
              {project.technologies && project.technologies.length > 0 && (
                <p>
                  <strong>Tech:</strong> {project.technologies.join(', ')}
                </p>
              )}
              <p>
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noreferrer">
                    Live site
                  </a>
                )}
                {project.projectUrl && project.repositoryUrl && ' | '}
                {project.repositoryUrl && (
                  <a href={project.repositoryUrl} target="_blank" rel="noreferrer">
                    Code
                  </a>
                )}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectsPage;
