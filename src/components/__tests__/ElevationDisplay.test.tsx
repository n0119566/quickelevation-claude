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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  const renderWithQueryClient = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };
  
  it('displays loading state initially', () => {
    // Mock the getElevation function to never resolve
    vi.mocked(locationApi.getElevation).mockImplementation(() => new Promise(() => {}));
    
    renderWithQueryClient(
      <ElevationDisplay latitude={40.7128} longitude={-74.006} />
    );
    
    expect(screen.getByText(/loading elevation data/i)).toBeInTheDocument();
  });
  
  it('displays elevation data when loaded', async () => {
    // Mock the getElevation function to return data
    vi.mocked(locationApi.getElevation).mockResolvedValue({
      elevation: 10.5,
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    });
    
    renderWithQueryClient(
      <ElevationDisplay latitude={40.7128} longitude={-74.006} />
    );
    
    // Wait for data to be displayed
    await waitFor(() => {
      expect(screen.getByText(/10.5 meters/i)).toBeInTheDocument();
      expect(screen.getByText(/34.4 feet/i)).toBeInTheDocument();
    });
  });
  
  it('displays location name when provided', async () => {
    // Mock the getElevation function to return data
    vi.mocked(locationApi.getElevation).mockResolvedValue({
      elevation: 10.5,
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    });
    
    renderWithQueryClient(
      <ElevationDisplay 
        latitude={40.7128} 
        longitude={-74.006} 
        locationName="New York, NY, USA" 
      />
    );
    
    // Wait for data to be displayed
    await waitFor(() => {
      expect(screen.getByText(/new york, ny, usa/i)).toBeInTheDocument();
    });
  });
  
  it('displays coordinates when no location name is provided', async () => {
    // Mock the getElevation function to return data
    vi.mocked(locationApi.getElevation).mockResolvedValue({
      elevation: 10.5,
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    });
    
    renderWithQueryClient(
      <ElevationDisplay latitude={40.7128} longitude={-74.006} />
    );
    
    // Wait for data to be displayed
    await waitFor(() => {
      expect(screen.getByText(/40.712800, -74.006000/i)).toBeInTheDocument();
    });
  });
});