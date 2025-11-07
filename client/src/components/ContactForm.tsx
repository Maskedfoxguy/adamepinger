
import React, { useState } from 'react';
// 1. Import our new CSS file. Now this component knows about the animations we defined.
import './ContactForm.css';

// --- Placeholder Icons (Unchanged) ---
const PhoneIcon = () => (
  <svg className="w-8 h-8 text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const EmailIcon = () => (
  <svg className="w-8 h-8 text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
);
const LocationIcon = () => (
  <svg className="w-8 h-8 text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

// --- The Main Component (Unchanged logic) ---
const ContactForm: React.FC = () => {
  const [visibleItem, setVisibleItem] = useState<string | null>(null);

  const handleIconClick = (itemName: string) => {
    // If you click the same icon again, hide it. Otherwise, show the new one.
    if (visibleItem === itemName) {
      setVisibleItem(null);
    } else {
      setVisibleItem(itemName);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto p-8 rounded-lg"
      style={{
        background: 'rgba(173, 216, 230, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex justify-around items-center w-full">
        {/* Phone Number Item */}
        <div className="flex flex-col items-center space-y-4">
          <div onClick={() => handleIconClick('phone')}>
            <PhoneIcon />
          </div>
          {visibleItem === 'phone' && (
            // 2. Add the className to apply our animation.
            <span className="text-white text-lg animate-zoom-in">
              +12 345 678 90
            </span>
          )}
        </div>

        {/* Email Item */}
        <div className="flex flex-col items-center space-y-4">
          <div onClick={() => handleIconClick('email')}>
            <EmailIcon />
          </div>
          {visibleItem === 'email' && (
            <span className="text-white text-lg animate-zoom-in">
              adam.epinger@email.com
            </span>
          )}
        </div>

        {/* Location Item */}
        <div className="flex flex-col items-center space-y-4">
          <div onClick={() => handleIconClick('location')}>
            <LocationIcon />
          </div>
          {visibleItem === 'location' && (
            <span className="text-white text-lg animate-zoom-in">
              Amsterdam, NL
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;