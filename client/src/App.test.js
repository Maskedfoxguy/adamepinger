// Verifies that the home page shows the bio headline returned by the API.
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn((input) => {
    if (typeof input === 'string' && input.startsWith('/api/about')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            headline: 'Test Headline',
            summary: 'A short summary.',
            highlights: [],
          }),
      });
    }

    if (typeof input === 'string' && input.startsWith('/api/portfolio')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      });
    }

    if (typeof input === 'string' && input.startsWith('/auth/login')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ authToken: 'test-token' }),
      });
    }

    return Promise.reject(new Error(`Unhandled fetch request for ${input}`));
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('shows the homepage headline from the API', async () => {
  render(<App />);
  const heading = await screen.findByRole('heading', { name: /test headline/i });
  expect(heading).toBeInTheDocument();
});
