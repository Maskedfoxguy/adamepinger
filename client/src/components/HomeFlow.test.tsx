import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeHero from './HomeHero';

import ContactForm from './ContactForm';
import Footer from './Footer';

describe('HomeFlow Components', () => {
  test('HomeHero shows the current homepage heading and introduction', () => {
    render(<HomeHero />);
    expect(screen.getByRole('heading', { level: 1, name: 'Ádám Epinger' })).toBeVisible();
    expect(screen.getByText(/Web Developer\./i)).toBeVisible();
  });

  test('reveals the email address when requested', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const email = 'adam.epinger@email.com';
    expect(screen.queryByText(email)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reveal Email' }));

    expect(screen.getByText(email)).toBeVisible();
  });

  test('Footer renders without crashing', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });
});
