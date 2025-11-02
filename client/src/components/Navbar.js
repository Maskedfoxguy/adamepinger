// Provides the responsive navigation bar across the site.
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Track whether the mobile menu is expanded.

  return (
    <nav>
      <NavLink to="/" className="title" onClick={() => setMenuOpen(false)}>
        AE
      </NavLink>
      <button 
        type="button"
        className="menu" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={menuOpen ? 'open' : ''}>
        <li>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        </li>
        <li>
          <NavLink to="/projects" onClick={() => setMenuOpen(false)}>Projects</NavLink>
        </li>
        <li>
          <NavLink to="/contacts" onClick={() => setMenuOpen(false)}>Contacts</NavLink>
        </li>
        <li>
          <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
