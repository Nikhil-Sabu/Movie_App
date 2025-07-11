import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddMovieModal from '../AddMovieModal';
import { mockMovie } from '../../../utils/testUtils';

describe('AddMovieModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  test('does not render when isOpen is false', () => {
    render(
      <AddMovieModal 
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );
    
    expect(screen.queryByText('ADD MOVIE')).not.toBeInTheDocument();
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
    expect(screen.getByPlaceholderText('Movie title')).toBeInTheDocument();
    expect(screen.getByText('SUBMIT')).toBeInTheDocument();
  });

  test('renders edit movie modal with pre-filled data', () => {
    render(
      <AddMovieModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        movie={mockMovie}
        mode="edit"
      />
    );
    
    expect(screen.getByText('EDIT MOVIE')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('UPDATE')).toBeInTheDocument();
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
    });
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
    
    // Fill out the form using more specific selectors
    await user.type(screen.getByPlaceholderText('Movie title'), 'New Movie');
    
    // Use label to find the date input
    const dateInput = screen.getByLabelText('RELEASE DATE');
    await user.type(dateInput, '2023-01-01');
    
    await user.type(screen.getByPlaceholderText('https://'), 'https://example.com');
    await user.type(screen.getByPlaceholderText('7.8'), '8.5');
    await user.type(screen.getByPlaceholderText('2h 30min'), '2h 15min');
    await user.type(screen.getByPlaceholderText('Movie description'), 'Great movie');
    
    // Select genre
    const genreButton = screen.getByText('Select Genre');
    await user.click(genreButton);
    
    // Wait for dropdown to appear and select Action
    await waitFor(() => {
      const actionCheckbox = screen.getByLabelText('Action');
      return user.click(actionCheckbox);
    });
    
    const submitButton = screen.getByText('SUBMIT');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Movie',
          rating: '8.5',
          genre: expect.stringContaining('Action')
        })
      );
    });
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
    
    // Use class selector since the button doesn't have accessible name
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});