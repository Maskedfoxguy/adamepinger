import React, { useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(v => !v);
  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Anchor keeps dropdown aligned with hamburger */}
        <div className="menu-anchor">
          <button
            onClick={toggleMenu}
            className="icon-button hamburger-button"
            aria-expanded={isMenuOpen}
            aria-label="Open menu"
          >
            <HamburgerIcon />
          </button>

          {isMenuOpen && (
            <nav className="dropdown-nav" aria-label="Primary">
              <ul className="menu-list is-open">
                <li className="menu-item"><NavLink to="/about" onClick={handleLinkClick} className="menu-link">About</NavLink></li>
                <li className="menu-item"><NavLink to="/projects" onClick={handleLinkClick} className="menu-link">Projects</NavLink></li>
                <li className="menu-item"><NavLink to="/contacts" onClick={handleLinkClick} className="menu-link">Contacts</NavLink></li>
                <li className="menu-item"><NavLink to="/login" onClick={handleLinkClick} className="menu-link">Login</NavLink></li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      <div className="header-center">
        <Link to="/" onClick={handleLinkClick} aria-label="Go to homepage">
          <img src={logo} alt="AE Logo Home" className="logo-image" />
        </Link>
      </div>

      <div className="header-right">
        <button className="icon-button search-button" aria-label="Open search">
          <SearchIcon />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
