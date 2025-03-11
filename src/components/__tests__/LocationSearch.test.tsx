import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LocationSearch } from '../LocationSearch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the toast provider
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the API call
vi.mock('../../api/location', () => ({
  searchLocation: vi.fn().mockResolvedValue([
    {
      name: 'New York, NY, USA',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    {
      name: 'New York Mills, NY, USA',
      coordinates: {
        latitude: 43.1056,
        longitude: -75.2918,
      },
    },
  ]),
}));

describe('LocationSearch', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  const mockOnLocationSelect = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  const renderWithQueryClient = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };
  
  it('renders the search form correctly', () => {
    renderWithQueryClient(<LocationSearch onLocationSelect={mockOnLocationSelect} />);
    
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter city, address, or landmark/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
  
  it('allows typing in the search input', () => {
    renderWithQueryClient(<LocationSearch onLocationSelect={mockOnLocationSelect} />);
    
    const searchInput = screen.getByPlaceholderText(/enter city, address, or landmark/i);
    fireEvent.change(searchInput, { target: { value: 'New York' } });
    
    expect(searchInput).toHaveValue('New York');
  });
  
  it('handles location selection', async () => {
    renderWithQueryClient(<LocationSearch onLocationSelect={mockOnLocationSelect} />);
    
    // Enter search text
    const searchInput = screen.getByPlaceholderText(/enter city, address, or landmark/i);
    fireEvent.change(searchInput, { target: { value: 'New York' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /search/i }));
    
    // Wait for search results to be displayed
    await waitFor(() => {
      expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
    });
    
    // Click on a search result
    fireEvent.click(screen.getByText('New York, NY, USA'));
    
    // Verify that onLocationSelect was called with the correct data
    expect(mockOnLocationSelect).toHaveBeenCalledWith({
      name: 'New York, NY, USA',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    });
  });
});