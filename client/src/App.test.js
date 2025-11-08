import { render, screen } from '@testing-library/react';
import App from './App';

test('shows the homepage title', () => {
  render(<App />);
  const heading = screen.getByText(/adam epinger/i);
  expect(heading).toBeInTheDocument();
});
