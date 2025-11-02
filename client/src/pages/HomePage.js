// Presents the homepage hero with bio details fetched from the API.
import React from 'react';
import useAboutData from '../hooks/useAboutData';
import Loading from '../components/Loading/Loading';

function HomePage() {
  const { about, error, isLoading } = useAboutData();

  if (isLoading) {
    return <Loading />; // Display the shared spinner while the bio loads.
  }

  if (error) {
    return <p role="alert">{error}</p>; // Keep error messaging accessible for screen readers.
  }

  if (!about) {
    return <p>No bio information found yet.</p>; // Gracefully handle empty databases.
  }

  return (
    <section>
      <header>
        <h1>{about.headline}</h1>
      </header>
      <p>{about.summary}</p>
      {about.highlights && about.highlights.length > 0 && (
        <section>
          <h2>Highlights</h2>
          <ul>
            {about.highlights.map((highlight, index) => (
              <li key={highlight + index}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

export default HomePage;
