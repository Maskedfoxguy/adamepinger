import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 text-center">
      <h2 className="text-4xl font-bold text-white mb-8">About Me</h2>
      <div className="max-w-7xl mx-auto">
        <p className="text-lg text-gray-300 leading-relaxed">
          I design and build creative websites by turning bold ideas
          into innovative, launch ready products. I listen closely, care for your vision as if it were my own,
          and obsess over the details that make an experience feel intentional.
          I work across the stack with JavaScript, Typescript, React, Node and Tailwind, I favour small,
          testable projects and lightweight prototypes. Of course I take full
          ownership from idea to launch. <br></br> I spend some time away from the keyboard too. I dance, tend my garden,
          or go for a walk or bike tour to stretch my muscles and clear my head.
          A fine balance of hobbies keeps my thinking fresh. 
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
