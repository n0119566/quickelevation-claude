import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CurrentLocationButton } from '../CurrentLocationButton';
import * as locationApi from '../../api/location';

// Mock the toast provider
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the location API
vi.mock('../../api/location', () => ({
  getCurrentLocation: vi.fn(),
  getLocationNameFromCoordinates: vi.fn(),
}));

describe('CurrentLocationButton', () => {
  const mockOnLocationDetected = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the button correctly', () => {
    render(<CurrentLocationButton onLocationDetected={mockOnLocationDetected} />);
    
    expect(screen.getByRole('button', { name: /use current location/i })).toBeInTheDocument();
  });
  
  it('calls onLocationDetected when location is successfully retrieved', async () => {
    // Mock the getCurrentLocation function to return coordinates
    vi.mocked(locationApi.getCurrentLocation).mockResolvedValue({
      latitude: 40.7128,
      longitude: -74.006,
    });
    
    // Mock the getLocationNameFromCoordinates function
    vi.mocked(locationApi.getLocationNameFromCoordinates).mockResolvedValue('New York');
    
    render(<CurrentLocationButton onLocationDetected={mockOnLocationDetected} />);
    
    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /use current location/i }));
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockOnLocationDetected).toHaveBeenCalledWith(40.7128, -74.006, 'New York');
    });
  });
  
  it('handles errors when location retrieval fails', async () => {
    // Mock the getCurrentLocation function to throw an error
    vi.mocked(locationApi.getCurrentLocation).mockRejectedValue(new Error('Location error'));
    
    render(<CurrentLocationButton onLocationDetected={mockOnLocationDetected} />);
    
    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /use current location/i }));
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockOnLocationDetected).not.toHaveBeenCalled();
    });
  });
  
  it('falls back to just coordinates if getting location name fails', async () => {
    // Mock the getCurrentLocation function to return coordinates
    vi.mocked(locationApi.getCurrentLocation).mockResolvedValue({
      latitude: 40.7128,
      longitude: -74.006,
    });
    
    // Mock the getLocationNameFromCoordinates function to fail
    vi.mocked(locationApi.getLocationNameFromCoordinates).mockRejectedValue(new Error('Failed to get location name'));
    
    render(<CurrentLocationButton onLocationDetected={mockOnLocationDetected} />);
    
    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /use current location/i }));
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockOnLocationDetected).toHaveBeenCalledWith(40.7128, -74.006);
    });
  });
});