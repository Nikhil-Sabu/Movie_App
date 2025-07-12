import '@testing-library/jest-dom';

// Mock createPortal for testing
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

// Mock focus-trap-react for testing
jest.mock('focus-trap-react', () => {
  return function MockFocusTrap({ children }) {
    return children;
  };
});