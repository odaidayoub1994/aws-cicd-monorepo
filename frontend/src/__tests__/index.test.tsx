import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'mock-font-variable' }),
}));

describe('Home page', () => {
  it('renders the heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'AWS CI/CD Monorepo',
    );
  });

  it('renders the Manage Values link', () => {
    render(<Home />);
    expect(screen.getByText('Manage Values')).toBeInTheDocument();
  });
});
