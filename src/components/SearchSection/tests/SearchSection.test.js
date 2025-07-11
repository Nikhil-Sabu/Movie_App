import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchSection from '../SearchSection';

describe('SearchSection Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search section with title and input', () => {
    render(<SearchSection onSearch={mockOnSearch} />);
    
    expect(screen.getByText('FIND YOUR MOVIE')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What do you want to watch?')).toBeInTheDocument();
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });

  test('calls onSearch when typing in input (live search)', async () => {
    const user = userEvent.setup();
    render(<SearchSection onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('What do you want to watch?');
    await user.type(searchInput, 'test');
    
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  test('shows clear button when there is search term', async () => {
    const user = userEvent.setup();
    render(<SearchSection onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('What do you want to watch?');
    await user.type(searchInput, 'test');
    
    expect(screen.getByText('CLEAR')).toBeInTheDocument();
  });

  test('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchSection onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('What do you want to watch?');
    await user.type(searchInput, 'test');
    
    const clearButton = screen.getByText('CLEAR');
    await user.click(clearButton);
    
    expect(searchInput.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});