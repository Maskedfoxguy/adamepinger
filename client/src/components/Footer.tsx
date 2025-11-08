// client/src/components/Footer.tsx
// Renders the main site footer with a gradient background and content.
import React from 'react';

// We import our CSS file to apply our custom styles.
import './Footer.css';

const Footer: React.FC = () => {
  // We can bring the 'year' constant back, as we'll use it for the watermark later.
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* 
        This is the main container that will hold our two-column layout.
        We will add Flexbox styles to this div in our CSS file next.
      */}
      <div className="footer-content">
        
        {/* --- Left Column --- */}
        {/* This div will hold the text content. */}
        <div className="footer-column-left">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Thank you for visiting
          </h3>
          <p style={{ maxWidth: '400px', color: '#ccc' }}>
            This is where the closing text will go. We can refine this message together once the layout is complete.
          </p>
          {/* We will add the social media icons here in a future step. */}
        </div>

        {/* --- Right Column --- */}
        {/* This div will hold the image. */}
        <div className="footer-column-right">
          {/* 
            A placeholder for the image. We'll replace this with a real <img> tag
            once the layout is working correctly.
          */}
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

      {/* 
        This is the placeholder for the final watermark at the very bottom.
        We will style this separately to be centered below the columns.
      */}
      <div className="footer-watermark" style={{ marginTop: '4rem', textAlign: 'center', color: '#888' }}>
        <p>Website by Adam Epinger © {year}</p>
      </div>

    </footer>
  );
};

export default Footer;