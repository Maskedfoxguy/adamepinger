// Creates the data router and layout shell for the portfolio app.
import React from 'react';
import {
  RouterProvider,
  Outlet,
  createBrowserRouter,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactsPage from './pages/ContactsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import './App.css';

function AppLayout() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

const futureFlags = {
  v7_startTransition: true, // Opt in now so the app is ready for React Router v7 behaviour.
  v7_relativeSplatPath: true, // Matches the upcoming relative path resolution rules.
  v7_fetcherPersist: true, // Mirrors the new fetcher lifecycle so no surprises on upgrade.
  v7_normalizeFormMethod: true, // Aligns HTML form method casing with the next major release.
  v7_partialHydration: true, // Ensures hydration matches the v7 expectations.
  v7_skipActionErrorRevalidation: true, // Prevents unexpected refetching after action errors in v7.
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'contacts', element: <ContactsPage /> },
        { path: 'auth/login', element: <AdminLoginPage /> },
      ],
    },
  ],
  {
    future: futureFlags,
  }
);

function App() {
  return <RouterProvider router={router} future={futureFlags} />;
}

export default App;
