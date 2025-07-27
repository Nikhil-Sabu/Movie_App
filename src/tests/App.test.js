import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';


jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} }))
  }
}));


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


jest.mock('../data/movies', () => ({
  movies: []
}));

describe('App Component Integration Tests', () => {
  beforeEach(() => {
    
    jest.clearAllMocks();
  });

  test('renders main application components', async () => {
    render(<App />);
    
    
    await waitFor(() => {
      expect(screen.getByText('FIND YOUR MOVIE')).toBeInTheDocument();
    });
    
    
    expect(screen.getByText('ADD MOVIE')).toBeInTheDocument();
    expect(screen.getByText('Nix')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
  });

  test('handles empty movie state', async () => {
    render(<App />);
    
    
    await waitFor(() => {
      expect(screen.getByText(/0.*movies?.*found/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});