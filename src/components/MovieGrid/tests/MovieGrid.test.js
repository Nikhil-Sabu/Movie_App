import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieGrid from '../MovieGrid';
import { mockMovies } from '../../../utils/testUtils';

describe('MovieGrid Component', () => {
  const defaultProps = {
    movies: mockMovies,
    selectedGenre: 'ALL',
    sortBy: 'release_date',
    onGenreChange: jest.fn(),
    onSortChange: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onSelect: jest.fn()
  };

  beforeEach(() => {
    Object.values(defaultProps).forEach(fn => {
      if (typeof fn === 'function') fn.mockClear();
    });
  });

  test('renders movie grid with movies', () => {
    render(<MovieGrid {...defaultProps} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Comedy Movie')).toBeInTheDocument();
    expect(screen.getByText('2 movies found')).toBeInTheDocument();
  });

  test('renders genre filter buttons', () => {
    render(<MovieGrid {...defaultProps} />);
    
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByText('ACTION')).toBeInTheDocument();
    expect(screen.getByText('COMEDY')).toBeInTheDocument();
  });

  test('calls onGenreChange when genre button is clicked', async () => {
    const user = userEvent.setup();
    render(<MovieGrid {...defaultProps} />);
    
    const actionButton = screen.getByText('ACTION');
    await user.click(actionButton);
    
    expect(defaultProps.onGenreChange).toHaveBeenCalledWith('ACTION');
  });

  test('calls onSortChange when sort option is changed', async () => {
    const user = userEvent.setup();
    render(<MovieGrid {...defaultProps} />);
    
    const sortSelect = screen.getByDisplayValue('RELEASE DATE');
    await user.selectOptions(sortSelect, 'title');
    
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('title');
  });

  test('shows no movies message when movies array is empty', () => {
    render(<MovieGrid {...defaultProps} movies={[]} />);
    
    expect(screen.getByText('No movies found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument();
  });
});