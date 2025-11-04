// App.tsx
// Main app layout + router for the portfolio app (TypeScript version).
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

function AppLayout(): JSX.Element {
  return (
    <div className="App">
      {/* glass effect layer as the first child */}
      <div className="glass-layer" />

      <Navbar />
      <main>
        <Outlet />
      </main>
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
} as const;

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
        { path: 'login', element: <AdminLoginPage /> },
      ],
    },
  ],
  {
    // Router types accept this future option object; keep as-is
    future: futureFlags,
  }
);

export default function App(): JSX.Element {
  return <RouterProvider router={router} future={futureFlags} />;
}