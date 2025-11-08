import React from 'react';

import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column-left">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Thank you for visiting
          </h3>
          <p style={{ maxWidth: '400px', color: '#ccc' }}>
            This is where the closing text will go. We can refine this message together once the layout is complete.
          </p>
        </div>
        <div className="footer-column-right">
          <div style={{
            width: '300px',
            height: '200px',
            border: '2px dashed white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '15px'
          }}>
            Image Placeholder
          </div>
        </div>
      </div>
      <div className="footer-watermark" style={{ marginTop: '4rem', textAlign: 'center', color: '#888' }}>
        <p>Website by Adam Epinger © {year}</p>
      </div>
    </footer>
  );
};

export default Footer;
