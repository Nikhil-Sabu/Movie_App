import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from '../Dialog';

describe('Dialog Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders dialog when isOpen is true', () => {
    render(
      <Dialog isOpen={true} title="Test Dialog" onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>
    );

    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <Dialog isOpen={false} title="Test Dialog" onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>
    );

    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Dialog isOpen={true} title="Test Dialog" onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>
    );

    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when escape key is pressed', () => {
    render(
      <Dialog isOpen={true} title="Test Dialog" onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});