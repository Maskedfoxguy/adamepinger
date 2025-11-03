import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/AE-logo.png';

/* Use your new hamburger asset (adjust extension if needed) */
import geoHamburger from '../assets/images/GeoHamburger.png';
// If your actual file is named with a space, rename it to GeoHamburger.svg (recommended).

const SearchIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

function Navbar() {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef(null);

  const links = [
    { to: '/about', label: 'About' },
    { to: '/projects', label: 'Projects' },
    { to: '/contacts', label: 'Contacts' },
    { to: '/login', label: 'Login' },
  ];

  const toggle = () => setOpen(v => !v);
  const close = () => setOpen(false);

  useEffect(() => {
    if (open && firstLinkRef.current) firstLinkRef.current.focus();
  }, [open]);

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.classList.toggle('nav-open', open);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('nav-open');
    };
  }, [open]);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <button
            onClick={toggle}
            className="icon-button hamburger-button"
            aria-expanded={open}
            aria-controls="nav-overlay"
            aria-label="Open menu"
          >
            <img src={geoHamburger} alt="Open menu" className="hamburger-img" />
          </button>
        </div>

        <div className="header-center">
          <Link to="/" onClick={close} aria-label="Go to homepage">
            <img src={logo} alt="AE Logo Home" className="logo-image" />
          </Link>
        </div>

        <div className="header-right">
          <button className="icon-button search-button" aria-label="Open search">
            <SearchIcon />
          </button>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <aside
        id="nav-overlay"
        className={`nav-overlay ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onClick={(e) => {
          // clicking blank overlay area closes; clicks on content don't
          if (e.target.classList.contains('nav-overlay')) close();
        }}
      >
        <nav className="overlay-nav">
          <ul className="overlay-list">
            {links.map((l, idx) => (
              <li className="overlay-item" style={{ '--i': idx }} key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={close}
                  className="overlay-link"
                  ref={idx === 0 ? firstLinkRef : undefined}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Navbar;
