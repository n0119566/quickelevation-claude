import axios from "axios";

const OPEN_ELEVATION_API = "https://api.open-elevation.com/api/v1/lookup";
const TOMTOM_API = "https://api.tomtom.com/search/2/search";
const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  name: string;
  coordinates: Coordinates;
}

export interface ElevationResult {
  elevation: number;
  coordinates: Coordinates;
}

// Get coordinates from browser geolocation
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Search for location using TomTom API
export const searchLocation = async (query: string): Promise<LocationResult[]> => {
  try {
    const response = await axios.get(
      `${TOMTOM_API}/${encodeURIComponent(query)}.json`,
      {
        params: {
          key: TOMTOM_API_KEY,
          countrySet: "US",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to search location");
    }

    return response.data.results.map((result: any) => ({
      name: result.address.freeformAddress,
      coordinates: {
        latitude: result.position.lat,
        longitude: result.position.lon,
      },
    }));
  } catch (error) {
    console.error("Error searching location:", error);
    throw error;
  }
};

// Get elevation data from Open Elevation API
export const getElevation = async (
  coordinates: Coordinates
): Promise<ElevationResult> => {
  try {
    const { latitude, longitude } = coordinates;
    const response = await axios.get(OPEN_ELEVATION_API, {
      params: {
        locations: `${latitude},${longitude}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to get elevation data");
    }

    const result = response.data.results[0];
    return {
      elevation: result.elevation,
      coordinates: {
        latitude: result.latitude,
        longitude: result.longitude,
      },
    };
  } catch (error) {
    console.error("Error getting elevation:", error);
    throw error;
  }
};