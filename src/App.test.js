import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    
    // Test that the main components are rendered
    expect(screen.getByText('FIND YOUR MOVIE')).toBeInTheDocument();
    expect(screen.getByText('+ ADD MOVIE')).toBeInTheDocument();
  });

  test('renders header and footer with logo', () => {
    render(<App />);
    
    // Check that both Nix elements exist (header and footer)
    const nixElements = screen.getAllByText('Nix');
    expect(nixElements).toHaveLength(2);
    
    const moviesElements = screen.getAllByText('Movies');
    expect(moviesElements).toHaveLength(2);
  });

  test('renders movie grid', () => {
    render(<App />);
    
    // Check that movies are displayed
    expect(screen.getByText(/movies? found/)).toBeInTheDocument();
  });
});