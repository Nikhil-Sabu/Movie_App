import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  const mockOnAddMovie = jest.fn();

  beforeEach(() => {
    mockOnAddMovie.mockClear();
  });

  test('renders header with logo', () => {
    const { container } = render(<Header onAddMovie={mockOnAddMovie} />);
    
    
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    
    
    expect(screen.getByText('Nix')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
  });

  test('renders add movie button', () => {
    render(<Header onAddMovie={mockOnAddMovie} />);
    
    const addButton = screen.getByText('ADD MOVIE');
    expect(addButton).toBeInTheDocument();
  });

  test('calls onAddMovie when add button is clicked', () => {
    render(<Header onAddMovie={mockOnAddMovie} />);
    
    const addButton = screen.getByText('ADD MOVIE');
    fireEvent.click(addButton);
    
    expect(mockOnAddMovie).toHaveBeenCalledTimes(1);
  });

  test('has correct CSS classes', () => {
    const { container } = render(<Header onAddMovie={mockOnAddMovie} />);
    
    expect(container.querySelector('.header')).toBeInTheDocument();
    expect(container.querySelector('.logo')).toBeInTheDocument();
    expect(container.querySelector('.nix')).toBeInTheDocument();
    expect(container.querySelector('.mov')).toBeInTheDocument();
  });
});