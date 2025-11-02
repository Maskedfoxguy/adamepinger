// Verifies that the Navbar component renders all navigation links including Login.
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

test('renders all navigation links including login', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  
  // Verify all expected navigation links are present
  expect(screen.getByText('About')).toBeInTheDocument();
  expect(screen.getByText('Projects')).toBeInTheDocument();
  expect(screen.getByText('Contacts')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('login link points to /login route', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  
  const loginLink = screen.getByText('Login').closest('a');
  expect(loginLink).toHaveAttribute('href', '/login');
});
