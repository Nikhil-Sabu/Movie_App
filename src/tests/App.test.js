import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock axios to prevent the import error
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} }))
  }
}));

// Mock the movieService
jest.mock('../services/movieService', () => ({
  movieService: {
    getAllMovies: jest.fn(() => Promise.resolve({ 
      data: [] 
    })),
    getMovieById: jest.fn(() => Promise.resolve({ data: {} })),
    createMovie: jest.fn(() => Promise.resolve({ data: {} })),
    updateMovie: jest.fn(() => Promise.resolve({ data: {} })),
    deleteMovie: jest.fn(() => Promise.resolve({ data: {} }))
  }
}));

// Mock the movies data
jest.mock('../data/movies', () => ({
  movies: []
}));

describe('App Component Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders main application components', async () => {
    render(<App />);
    
    // Wait for the app to load
    await waitFor(() => {
      expect(screen.getByText('FIND YOUR MOVIE')).toBeInTheDocument();
    });
    
    // Check for main components
    expect(screen.getByText('ADD MOVIE')).toBeInTheDocument();
    expect(screen.getByText('Nix')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
  });

  test('handles empty movie state', async () => {
    render(<App />);
    
    // Wait for component to load and show empty state
    await waitFor(() => {
      expect(screen.getByText(/0.*movies?.*found/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});