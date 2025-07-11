import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the movie data to avoid dependency on external data
jest.mock('../data/movies', () => ({
  mockMovies: [
    {
      id: 1,
      title: "Test Movie",
      year: "2023",
      genre: "Action & Adventure",
      rating: 8.5,
      runtime: "2h 30min",
      overview: "Test overview",
      poster: "https://example.com/poster.jpg",
      url: "https://example.com/movie",
      releaseDate: "2023-01-01"
    }
  ]
}));

describe('App Integration Tests', () => {
  test('renders main components', () => {
    render(<App />);
    
    // Check for logo text (appears in both header and footer)
    const nixElements = screen.getAllByText('Nix');
    expect(nixElements.length).toBeGreaterThanOrEqual(1);
    
    const moviesElements = screen.getAllByText('Movies');
    expect(moviesElements.length).toBeGreaterThanOrEqual(1);
    
    expect(screen.getByText('FIND YOUR MOVIE')).toBeInTheDocument();
    expect(screen.getByText('1 movie found')).toBeInTheDocument();
  });

  test('renders header with add movie button', () => {
    render(<App />);
    
    expect(screen.getByText('+ ADD MOVIE')).toBeInTheDocument();
  });

  test('search functionality works', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('What do you want to watch?');
    await user.type(searchInput, 'Test');
    
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  test('genre filtering works', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const actionButton = screen.getByText('ACTION');
    await user.click(actionButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  test('add movie modal opens when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const addButton = screen.getByText('+ ADD MOVIE');
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('ADD MOVIE')).toBeInTheDocument();
    });
  });

  test('movie detail modal opens when movie card is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const movieCard = screen.getByText('Test Movie');
    await user.click(movieCard);
    
    await waitFor(() => {
      expect(screen.getByText('Test overview')).toBeInTheDocument();
    });
  });

  test('displays correct movie count', () => {
    render(<App />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // count badge
    expect(screen.getByText('1 movie found')).toBeInTheDocument();
  });

  test('renders all genre filter buttons', () => {
    render(<App />);
    
    const genres = ['ALL', 'ACTION', 'CRIME', 'HORROR', 'COMEDY', 'DOCUMENTARY', 'DRAMA'];
    
    genres.forEach(genre => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });
  });

  test('renders sort dropdown with options', () => {
    render(<App />);
    
    expect(screen.getByText('SORT BY')).toBeInTheDocument();
    expect(screen.getByDisplayValue('RELEASE DATE')).toBeInTheDocument();
  });
});