import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <article className="journey-page" aria-labelledby="journey-title">
      <h1 id="journey-title">My Journey</h1>

      <div className="journey-panel">
        <section aria-labelledby="journey-curiosity">
          <h2 id="journey-curiosity">From curiosity to code</h2>
          <p>
            I’d been drawn to technology for a long time. It took some confidence
            to give web development a serious go, and I decided to make time for it.
            At Ironhack, I learned to build for the web and earned my web
            development certificate. Building projects helped me see what I enjoyed
            most: taking an idea, making it work, and refining the details until it
            felt right.
          </p>
        </section>

        <section aria-labelledby="journey-hospitality">
          <h2 id="journey-hospitality">What I bring from hospitality</h2>
          <p>
            In 2015, I moved from Hungary to the Netherlands. Working in hospitality
            and operations across both countries taught me to listen closely,
            coordinate with different teams, and stay calm when plans changed.
            I bring that same approach to development. I start by understanding
            what people need, then look for the simplest way to make it work.
          </p>
        </section>
      </div>
    </article>
  );
};

export default AboutPage;
