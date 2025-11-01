// Provides the responsive navigation bar across the site.
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Track whether the mobile menu is expanded.

  function closeMenu() {
    setMenuOpen(false); // Collapse the menu after selecting a link.
  }

  return (
    <nav>
      <NavLink to="/" className="title" onClick={closeMenu}>
        AE
      </NavLink>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? 'open' : ''}>
        <li>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" onClick={closeMenu}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacts" onClick={closeMenu}>
            Contacts
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin" onClick={closeMenu}>
            Admin
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
