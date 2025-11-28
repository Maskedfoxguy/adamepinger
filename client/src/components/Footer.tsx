
import React from 'react';
import './Footer.css';
import githubLogo from '../assets/images/github-mark-white.png';
import linkedinLogo from '../assets/images/linkedInlogo.png';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative z-10">
      <div className="footer-content">
        <div className="footer-column-left" style={{ textAlign: 'center' }}>
          
          
          
          <div className="social-links" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>

            <a href="https://www.linkedin.com/in/adamepinger" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
              <img 
                src={linkedinLogo} 
                alt="LinkedIn Profile" 
                style={{ width: '32px', height: '32px' }} 
              />
            </a>

          
            <a href="https://github.com/Maskedfoxguy" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
              <img 
                src={githubLogo} 
                alt="GitHub Profile" 
                style={{ width: '32px', height: '32px' }} 
              />
            </a>

          </div>
        </div>
      </div>
      <div className="footer-watermark" style={{ marginTop: '2rem', textAlign: 'center', color: '#888' }}>
        <p>Website by Adam Epinger © {year}</p>
      </div>
    </footer>
  );
};

export default Footer;