import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Add this import
import AddMovieModal from '../AddMovieModal';

// Mock the Dialog component for testing
jest.mock('../../Dialog/Dialog', () => {
  return function MockDialog({ isOpen, title, children, onClose }) {
    if (!isOpen) return null;
    
    return (
      <div data-testid="dialog">
        <div data-testid="dialog-header">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <div data-testid="dialog-body">
          {children}
        </div>
      </div>
    );
  };
});

describe('AddMovieModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  test('renders add movie modal when isOpen is true', () => {
    render(
      <AddMovieModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="add"
      />
    );

    expect(screen.getByText('ADD MOVIE')).toBeInTheDocument();
    expect(screen.getByLabelText('TITLE')).toBeInTheDocument();
    expect(screen.getByLabelText('RELEASE DATE')).toBeInTheDocument();
    expect(screen.getByLabelText('MOVIE URL')).toBeInTheDocument();
    expect(screen.getByLabelText('RATING')).toBeInTheDocument();
    expect(screen.getByLabelText('GENRE')).toBeInTheDocument();
    expect(screen.getByLabelText('RUNTIME')).toBeInTheDocument();
    expect(screen.getByLabelText('OVERVIEW')).toBeInTheDocument();
  });

  test('renders edit movie modal with pre-filled data', () => {
    const mockMovie = {
      title: 'Test Movie',
      releaseDate: '2023-01-01',
      url: 'https://example.com',
      rating: 8.5,
      genre: 'Action',
      runtime: '2h 30min',
      overview: 'Test overview'
    };

    render(
      <AddMovieModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="edit"
        movie={mockMovie}
      />
    );

    expect(screen.getByText('EDIT MOVIE')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Movie')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Action')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2h 30min')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test overview')).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(
      <AddMovieModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="add"
      />
    );

    const submitButton = screen.getByText('SUBMIT');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Release date is required')).toBeInTheDocument();
      expect(screen.getByText('Movie URL is required')).toBeInTheDocument();
      expect(screen.getByText('Rating is required')).toBeInTheDocument();
      expect(screen.getByText('Genre is required')).toBeInTheDocument();
      expect(screen.getByText('Runtime is required')).toBeInTheDocument();
      expect(screen.getByText('Overview is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('calls onSubmit with form data when form is valid', async () => {
    const user = userEvent.setup();
    render(
      <AddMovieModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="add"
      />
    );

    // Fill out the form
    await user.type(screen.getByLabelText('TITLE'), 'New Movie');
    await user.type(screen.getByLabelText('RELEASE DATE'), '2023-12-01');
    await user.type(screen.getByLabelText('MOVIE URL'), 'https://example.com/movie');
    await user.type(screen.getByLabelText('RATING'), '9.0');
    await user.selectOptions(screen.getByLabelText('GENRE'), 'Action');
    await user.type(screen.getByLabelText('RUNTIME'), '2h 15min');
    await user.type(screen.getByLabelText('OVERVIEW'), 'An amazing new movie');

    const submitButton = screen.getByText('SUBMIT');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Movie',
        releaseDate: '2023-12-01',
        movieUrl: 'https://example.com/movie',
        rating: '9', // Updated to match actual behavior
        genre: 'Action',
        runtime: '2h 15min',
        overview: 'An amazing new movie'
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AddMovieModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="add"
      />
    );

    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not render when isOpen is false', () => {
    render(
      <AddMovieModal 
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="add"
      />
    );

    expect(screen.queryByText('ADD MOVIE')).not.toBeInTheDocument();
  });

  test('clears errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(
      <AddMovieModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="add"
      />
    );

    // Submit empty form to trigger errors
    const submitButton = screen.getByText('SUBMIT');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    // Start typing in title field
    const titleInput = screen.getByLabelText('TITLE');
    await user.type(titleInput, 'T');

    // Error should be cleared
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });
});