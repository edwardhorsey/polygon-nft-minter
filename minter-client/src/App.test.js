import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Minter component', () => {
  render(<App />);
  const linkElement = screen.getByText(/Alchemy NFT Minter/i);
  expect(linkElement).toBeInTheDocument();
});
