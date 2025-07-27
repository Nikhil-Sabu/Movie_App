import React from 'react';
import { render } from '@testing-library/react';


export const mockMovie = {
  id: 1,
  title: "Test Movie",
  year: "2023",
  genre: "Action",
  rating: 8.5,
  runtime: "2h 30min",
  overview: "This is a test movie overview",
  poster: "https://example.com/movie/poster",
  url: "https://example.com/movie",
  releaseDate: "2023-01-01"
};

export const mockMovies = [
  mockMovie,
  {
    id: 2,
    title: "Comedy Movie",
    year: "2022",
    genre: "Comedy",
    rating: 7.2,
    runtime: "1h 45min",
    overview: "A funny movie",
    poster: "https://example.com/movie/poster",
    url: "https://example.com/movie",
    releaseDate: "2022-06-15"
  }
];


export const renderWithProps = (component, props = {}) => {
  return render(React.cloneElement(component, props));
};


export const createMockMovie = (overrides = {}) => ({
  ...mockMovie,
  ...overrides,
  id: overrides.id || Math.random()
});

export const waitForElement = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Element not found within timeout'));
        } else {
          setTimeout(check, 50);
        }
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 50);
        }
      }
    };
    
    check();
  });
};