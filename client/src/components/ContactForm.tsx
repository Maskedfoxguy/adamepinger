import React, { useState } from 'react';
import './ContactForm.css';

const EmailIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const LocationIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

const ContactForm: React.FC = () => {
  const [isEmailVisible, setIsEmailVisible] = useState(false);

  const revealEmail = () => {
    setIsEmailVisible(true);
  };

  return (
    <div className="contact-layout">
      <div className="contact-text-left">
        <h3 className="text-2xl font-bold mb-4">Let's Connect</h3>
        <p className="text-gray-300">
          I'm currently seeking new opportunities and would love to hear from you.
          Whether you have a question or just want to say hi, feel free to reach out.
        </p>
      </div>

      <div className="contact-info-middle">
        <div className="contact-item">
          <EmailIcon />
          <div className="text-white text-lg">
            {isEmailVisible ? (
              <span>adam.epinger@email.com</span>
            ) : (
              <button onClick={revealEmail} className="reveal-button">
                Reveal Email
              </button>
            )}
          </div>
        </div>
        <div className="contact-item">
          <LocationIcon />
          <span className="text-white text-lg">Heerhugowaard, NL</span>
        </div>
      </div>

      <div className="contact-image-right">
        <div className="image-placeholder">
          Image Placeholder
        </div>
      </div>
    </div>
  );
};

export default ContactForm;