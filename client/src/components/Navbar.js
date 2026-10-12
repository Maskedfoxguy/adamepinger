
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  NavLink,
  Link,
  useLocation,
} from 'react-router-dom';

import './Navbar.css';

import logo from '../assets/images/MFG Logo.png';
import magnifierIcon from '../assets/images/Origami Metallic Magnifying Glass.png';
import geoHamburger from '../assets/images/Metallic Origami Hamburger Menu Icon.png';

// Central admin session manager
import {
  isAdminSessionValid,
} from '../utils/adminSession';

function Navbar() {
  const [open, setOpen] = useState(false);

  // Check the session rather than localStorage.
  const [isAdminSession, setIsAdminSession] = useState(
    () => isAdminSessionValid()
  );

  const firstLinkRef = useRef(null);
  const location = useLocation();

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

  // Refresh session status whenever the page changes.
  useEffect(() => {
    setIsAdminSession(isAdminSessionValid());
  }, [location.pathname]);

  // Keep the navbar synchronized with session changes.
  useEffect(() => {
    const syncSessionState = () => {
      setIsAdminSession(isAdminSessionValid());
    };

    window.addEventListener('storage', syncSessionState);
    window.addEventListener('focus', syncSessionState);

    // Check periodically for an expired session.
    const interval = setInterval(syncSessionState, 10000);

    return () => {
      window.removeEventListener('storage', syncSessionState);
      window.removeEventListener('focus', syncSessionState);
      clearInterval(interval);
    };
  }, []);

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
