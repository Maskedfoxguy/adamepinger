// Verifies that the app renders the homepage heading by default.
import { render, screen } from '@testing-library/react';
import App from './App';

test('shows the homepage title', () => {
  render(<App />);
  const heading = screen.getByText(/adam epinger/i); // Ensure the landing page headline is visible.
  expect(heading).toBeInTheDocument();
});
