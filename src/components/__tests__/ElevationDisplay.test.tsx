import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { ElevationDisplay } from '../ElevationDisplay';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as locationApi from '../../api/location';

// Mock the API call
vi.mock('../../api/location', () => ({
  getElevation: vi.fn(),
}));

describe('ElevationDisplay', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          // This is important for tests
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
  
  it('renders the component with the right title', () => {
    vi.mocked(locationApi.getElevation).mockImplementation(() => new Promise(() => {}));
    
    renderWithQueryClient(
      <ElevationDisplay latitude={40.7128} longitude={-74.006} />
    );
    
    expect(screen.getByText('Elevation Data')).toBeInTheDocument();
    expect(screen.getByText(/loading elevation data/i)).toBeInTheDocument();
  });
});