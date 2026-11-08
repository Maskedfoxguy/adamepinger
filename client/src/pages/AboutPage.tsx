import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <article className="journey-page" aria-labelledby="journey-title">
      <h1 id="journey-title">My Journey</h1>

      <div className="journey-panel">
        <section aria-labelledby="journey-curiosity">
          <h2 id="journey-curiosity">From Hungary to the Netherlands</h2>
          <p>
           I’m originally from Hungary, and I started my career in hospitality in Budapest. As a front office manager, I worked across reception and reservations and helped lead a small team. On any given day, I might be sorting out a booking, checking a payment, or helping a colleague handle a difficult situation.
            I liked the variety, and I liked seeing how much smoother a day could go when people had the information they needed and knew they could rely on each other.

            In 2015, I moved to the Netherlands. I had experience to draw on, but I was finding my feet in a new country and learning how to work with people from different backgrounds. 
            I went on to work in hospitality and operations here, and over time the Netherlands became home. Looking back, that move taught me that I could start again somewhere unfamiliar and find my place without having everything figured out beforehand.

            One thing that stayed with me from hospitality is how often the real problem is a step removed from the first thing someone asks. A guest might call about a booking change, but what they really need is to know whether they can arrive later without losing their room.
             A colleague might flag a mistake in a reservation, and fixing it also means making sure the next shift knows what changed. I learned to ask another question, follow a problem through, and think about the person who would pick things up after me. Years later, those habits felt surprisingly familiar when I started building for the web.
          </p>
        </section>

        <section aria-labelledby="journey-hospitality">
          <h2 id="journey-hospitality">What I bring from hospitality</h2>
          <p>
           I’d been interested in technology for a long time. Taking that interest seriously felt like a bigger step than I’d expected. 
           I was used to being the person who knew how things worked at my job. Learning web development meant being a beginner again and getting comfortable asking questions that felt basic. 
           Eventually, I decided to make time for it and enrolled at Ironhack.

           At Ironhack, I learned how the parts of a website fit together and earned my web development certificate. What made it click for me was building things myself.
            An idea can feel clear in your head until you have to decide what someone sees first, what happens when they click, and how to help them if something goes wrong.
            I enjoyed figuring those things out one at a time. There was a real sense of satisfaction in getting a first version to work and then going back to make it easier to use.

           The more I built, the more I recognised what I’d liked about hospitality. 
           I still wanted to understand where someone was getting stuck and what would make the next step easier for them. On a website, that might mean giving a form field a clearer label or making sure someone knows their message was sent. 
           Those details interest me because they sit right where design and development meet. 
           You have to understand what the website is doing and what the person using it expects to happen.

           Moving from Hungary to the Netherlands and learning to build for the web were different experiences, but both started with a decision to try something before I felt entirely ready. 
           Over time, what began as curiosity about how websites work became an interest in how people experience them.
           I still enjoy the moment when a piece of code finally works.
           What makes me want to keep going is seeing it make something a little clearer or easier for the person using it.
          </p>
        </section>
      </div>
    </article>
  );
};

export default AboutPage;
