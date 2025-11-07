
import React from 'react';

const AboutSection: React.FC = () => {
  return (
   
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-white">About Me</h2>
        
        {/* Placeholder text that we will replace with your actual bio. */}
        <p className="max-w-3xl mx-auto text-lg text-gray-300">
          This is where you can write a paragraph or two about your journey into web development,
          your passion for technology, and the kind of work you love to do.
        </p>

      </div>
    </section>
  );
};

export default AboutSection;