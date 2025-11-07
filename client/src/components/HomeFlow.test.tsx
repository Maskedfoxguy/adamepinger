import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeHero from './HomeHero';

import ContactForm from './ContactForm';
import Footer from './Footer';

describe('HomeFlow Components', () => {
  test('HomeHero renders without crashing', () => {
    render(<HomeHero />);
    expect(screen.getByText(/Welcome to My Portfolio/i)).toBeInTheDocument();
  });

  

  test('ContactForm renders without crashing', () => {
    render(<ContactForm />);
    expect(screen.getByText(/Get In Touch/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  });

  test('Footer renders without crashing', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });
});
