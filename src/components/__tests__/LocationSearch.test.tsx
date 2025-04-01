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
  let queryClient: QueryClient;
  const mockOnLocationSelect = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
        },
      },
    });
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
    
    expect(screen.getByText('Search Location')).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter city, address, or landmark/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
});