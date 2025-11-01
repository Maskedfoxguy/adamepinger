// Expands on the bio content with structured highlights.
import React from 'react';
import useAboutData from '../hooks/useAboutData';
import Loading from '../components/Loading/Loading';

function AboutPage() {
  const { about, error, isLoading } = useAboutData();

  if (isLoading) {
    return <Loading />; // Reuse the loading spinner for consistency across pages.
  }

  if (error) {
    return <p role="alert">{error}</p>; // Communicate API errors clearly to the visitor.
  }

  if (!about) {
    return <p>The about section has not been published yet.</p>;
  }

  return (
    <article>
      <header>
        <h1>About Adam</h1>
        <p>{about.headline}</p>
      </header>
      <p>{about.summary}</p>
      {about.highlights && about.highlights.length > 0 && (
        <section>
          <h2>Career Highlights</h2>
          <ul>
            {about.highlights.map((highlight, index) => (
              <li key={highlight + index}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

export default AboutPage;
