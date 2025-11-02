import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/AE-logo.png';

const HamburgerIcon = () => (
  <svg width="30" height="30" viewBox="0 0 100 80" fill="#fff" aria-hidden="true">
    <rect width="100" height="15" rx="8"></rect>
    <rect y="30" width="100" height="15" rx="8"></rect>
    <rect y="60" width="100" height="15" rx="8"></rect>
  </svg>
);

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
            <HamburgerIcon />
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
          // click on empty overlay area closes; clicks inside the panel don't
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
