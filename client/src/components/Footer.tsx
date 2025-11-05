// Footer.tsx
// Simple site footer. Add legal links, privacy, or microcopy here later.
import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="py-6 px-6 bg-gray-50 text-center" role="contentinfo">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-gray-600 mb-3">
          © {year} Adam Epinger — built with care.
        </p>

        {/* Placeholder social links — update to your profiles */}
        <nav aria-label="Social links" className="flex gap-4 justify-center">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600">
            Twitter
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600">
            GitHub
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600">
            LinkedIn
          </a>
        </nav>

        {/* Helpful note: add a small link to privacy or CV download here as needed. */}
      </div>
    </footer>
  );
};

export default Footer;
