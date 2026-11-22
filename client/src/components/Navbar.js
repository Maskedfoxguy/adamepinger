
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  NavLink,
  Link,
} from 'react-router-dom';

import './Navbar.css';

import logo from '../assets/images/mfg-logo.webp';
import magnifierIcon from '../assets/images/search-icon.webp';
import geoHamburger from '../assets/images/menu-icon.webp';

import {
  isAdminSessionValid,
  useAdminToken,
} from '../utils/adminSession';

function Navbar() {
  const [open, setOpen] = useState(false);

  const token = useAdminToken();
  const isAdminSession = Boolean(token) && isAdminSessionValid();

  const firstLinkRef = useRef(null);

  // Navigation depends on the session state.
  const links = useMemo(
    () => [
      { to: '/about', label: 'About' },
      { to: '/projects', label: 'Projects' },
      { to: '/contacts', label: 'Contacts' },

      isAdminSession
        ? { to: '/admin/dashboard', label: 'Dashboard' }
        : { to: '/login', label: 'Login' },
    ],
    [isAdminSession]
  );

  const toggle = () => setOpen((previous) => !previous);
  const close = () => setOpen(false);

  // Focus the first navigation link when menu opens.
  useEffect(() => {
    if (open && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [open]);

  // Close the navigation overlay using Escape.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };

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
            <img
              src={geoHamburger}
              width={180}
              height={180}
              alt="Open menu"
              className="hamburger-img"
            />
          </button>
        </div>

        <div className="header-center">
          <Link
            to="/"
            onClick={close}
            aria-label="Go to homepage"
          >
            <img
              src={logo}
              width={195}
              height={182}
              alt="AE Logo Home"
              className="logo-image"
            />
          </Link>
        </div>

        <div className="header-right">
          {isAdminSession && (
            <Link
              to="/admin/dashboard"
              onClick={close}
              className="session-indicator"
              aria-label="Open admin dashboard"
            >
              Admin session
            </Link>
          )}

          <button
            className="icon-button search-button"
            aria-label="Open search"
          >
            <img
              src={magnifierIcon}
              width={150}
              height={150}
              alt="Search"
              className="search-img"
            />
          </button>
        </div>
      </header>

      <aside
        id="nav-overlay"
        className={`nav-overlay ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onClick={(event) => {
          if (event.target.classList.contains('nav-overlay')) {
            close();
          }
        }}
      >
        <nav className="overlay-nav">
          <ul className="overlay-list">
            {links.map((link, index) => (
              <li
                className="overlay-item"
                style={{ '--i': index }}
                key={link.to}
              >
                <NavLink
                  to={link.to}
                  onClick={close}
                  className="overlay-link"
                  ref={index === 0 ? firstLinkRef : undefined}
                >
                  {link.label}
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
