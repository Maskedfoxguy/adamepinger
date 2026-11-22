import { render, screen } from '@testing-library/react';
import App from './App';

test('shows the homepage title', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1, name: 'Ádám Epinger' });
  expect(heading).toBeInTheDocument();
});
