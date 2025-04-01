import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { getLocationNameFromCoordinates } from '../location';

// Mock axios
vi.mock('axios');

describe('location API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLocationNameFromCoordinates', () => {
    it('should return city and state when both available', async () => {
      // Mock axios response
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: {
          addresses: [
            {
              address: {
                municipality: 'New York',
                localName: 'Manhattan',
                countrySubdivision: 'New York'
              }
            }
          ]
        }
      });

      const result = await getLocationNameFromCoordinates({ latitude: 40.7128, longitude: -74.006 });
      expect(result).toBe('New York, New York');
    });

    it('should fall back to localName and state when municipality is unavailable', async () => {
      // Mock axios response
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: {
          addresses: [
            {
              address: {
                localName: 'Manhattan',
                countrySubdivision: 'New York'
              }
            }
          ]
        }
      });

      const result = await getLocationNameFromCoordinates({ latitude: 40.7128, longitude: -74.006 });
      expect(result).toBe('Manhattan, New York');
    });

    it('should return only state when city info is unavailable', async () => {
      // Mock axios response
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: {
          addresses: [
            {
              address: {
                countrySubdivision: 'New York'
              }
            }
          ]
        }
      });

      const result = await getLocationNameFromCoordinates({ latitude: 40.7128, longitude: -74.006 });
      expect(result).toBe('New York');
    });

    it('should return "Unknown Location" when no address details are available', async () => {
      // Mock axios response
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: {
          addresses: [
            {
              address: {}
            }
          ]
        }
      });

      const result = await getLocationNameFromCoordinates({ latitude: 40.7128, longitude: -74.006 });
      expect(result).toBe('Unknown Location');
    });

    it('should throw an error when API request fails', async () => {
      // Mock axios response for failure
      vi.mocked(axios.get).mockRejectedValue(new Error('API request failed'));

      await expect(getLocationNameFromCoordinates({ latitude: 40.7128, longitude: -74.006 }))
        .rejects.toThrow('API request failed');
    });

    it('should throw an error when response has no addresses', async () => {
      // Mock axios response with no addresses
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: {
          addresses: []
        }
      });

      await expect(getLocationNameFromCoordinates({ latitude: 40.7128, longitude: -74.006 }))
        .rejects.toThrow('Failed to get location name');
    });
  });
});