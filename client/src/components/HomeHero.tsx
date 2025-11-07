// client/src/components/HomeHero.tsx
// A small hero section shown at the top of the single-scroll page.
import React from 'react';

// Import the avatar image so that our component can use it.
// Webpack (the tool that Create React App uses) will handle the path.
import avatar from '../assets/images/avatar.png';

const HomeHero: React.FC = () => {
  return (
    // Use a semantic section so screen readers know this is a distinct area.
    <div
      id="home-hero"
      aria-label="Home hero section"
      // These are Tailwind CSS utility classes:
      // 'py-16': Padding on the top and bottom.
      // 'px-6': Padding on the left and right.
      // 'text-center': Center-aligns all the text inside.
      className="py-16 px-6 text-center"
    >
      {/* The div that holds our avatar image. */}
      <div className="flex justify-center mb-8">
        <img
          src={avatar} // The 'src' is our imported image.
          alt="A circular avatar of Adam Epinger." // Alt text is crucial for accessibility.
          // More Tailwind classes to style the image:
          // 'w-32': Sets a fixed width.
          // 'h-32': Sets a fixed height.
          // 'rounded-full': This is what makes the image a circle.
          // 'object-cover': Ensures the image fills the circle without distortion.
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>

      {/* Main heading */}
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Hi! I'm Adam Epinger</h1>

      {/* Short intro paragraph. */}
      <p className="max-w-2xl mx-auto text-white-700 mb-6">
        I'm a frontend developer rebuilding my skills and crafting readable,
        accessible web interfaces. This site is my portfolio and résumé.
      </p>

     
    </div>
  );
};

export default HomeHero;
