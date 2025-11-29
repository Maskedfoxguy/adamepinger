import React from 'react';
import {
  RouterProvider,
  Outlet,
  createBrowserRouter,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import ContactsPage from './pages/ContactsPage.tsx';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './App.css';

function AppLayout() {
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
        { index: true, element: <HomePage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'contacts', element: <ContactsPage /> },
        { path: 'login', element: <AdminLoginPage /> },
        { path: 'admin/dashboard', element: <AdminDashboardPage /> },
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