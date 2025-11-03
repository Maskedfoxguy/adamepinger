// Footer.tsx
// Simple site footer. Add legal links, privacy, or microcopy here later.
import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer
      id="site-footer"
      className="bg-gray-900 text-white py-12 px-4"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About</h3>
            <p className="text-gray-400">
              A personal portfolio showcasing my professional journey and projects.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home-hero"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Go to home section"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#projects-preview"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Go to projects section"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#contact-form"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Go to contact section"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Privacy policy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Terms of service"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {year} Adam Epinger. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
