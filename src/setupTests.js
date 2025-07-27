import '@testing-library/jest-dom';


jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));


jest.mock('focus-trap-react', () => {
  return function MockFocusTrap({ children }) {
    return children;
  };
});