
import React, { useEffect } from 'react';

import {
  RouterProvider,
  Outlet,
  createBrowserRouter,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import ContactsPage from './pages/ContactsPage.tsx';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

// NEW: Central admin session management
import {
  getAdminToken,
  isAdminSessionValid,
  clearAdminSession,
  startAdminSessionMonitor,
} from './utils/adminSession';

import './App.css';

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't start a monitor if nobody is logged in.
    if (!getAdminToken()) {
      return;
    }

    // Remove expired sessions immediately.
    if (!isAdminSessionValid()) {
      clearAdminSession();

      if (location.pathname.startsWith('/admin')) {
        navigate('/login', { replace: true });
      }

      return;
    }

    // Start tracking website activity.
    const stopMonitoring = startAdminSessionMonitor(() => {
      // Clear expired session information.
      clearAdminSession();

      // Redirect when inside the admin area.
      if (window.location.pathname.startsWith('/admin')) {
        navigate('/login', { replace: true });
      }
    });

    // Stop old listeners when the layout changes
    // or the component is unmounted.
    return () => {
      stopMonitoring();
    };
  }, [location.pathname, navigate]);

  return (
    <div className="App">
      <div className="glass-layer"></div>

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

const futureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'about',
          element: <AboutPage />,
        },
        {
          path: 'projects',
          element: <ProjectsPage />,
        },
        {
          path: 'contacts',
          element: <ContactsPage />,
        },
        {
          path: 'login',
          element: <AdminLoginPage />,
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: 'admin/dashboard',
              element: <AdminDashboardPage />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: futureFlags,
  }
);

function App() {
  return (
    <RouterProvider
      router={router}
      future={futureFlags}
    />
  );
}

export default App;
