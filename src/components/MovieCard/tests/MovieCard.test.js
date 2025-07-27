import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from '../MovieCard';
import { mockMovie } from '../../../utils/testUtils';

describe('MovieCard Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    mockOnSelect.mockClear();
  });

  test('renders movie card with movie information', () => {
    render(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByAltText('Test Movie')).toBeInTheDocument();
  });

  test('calls onSelect when card is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );
    
    const movieCard = screen.getByText('Test Movie').closest('.movie-card');
    await user.click(movieCard);
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockMovie);
  });

  test('shows context menu when three dots button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );
    
    
    const movieCard = screen.getByText('Test Movie').closest('.movie-card');
    await user.hover(movieCard);
    
    const contextButton = screen.getByLabelText('Movie options');
    await user.click(contextButton);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});