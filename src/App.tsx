import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ElevationDisplay } from "./components/ElevationDisplay";
import { LocationSearch } from "./components/LocationSearch";
import { CurrentLocationButton } from "./components/CurrentLocationButton";
import { LocationResult } from "./api/location";
import { Toaster } from "./components/ui/toaster";
import { Mountain } from "lucide-react";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name?: string;
  } | null>(null);

  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocation({
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      name: location.name,
    });
  };

  const handleCurrentLocation = (latitude: number, longitude: number) => {
    setSelectedLocation({
      latitude,
      longitude,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <header className="py-6 px-4 border-b bg-background">
          <div className="container max-w-4xl mx-auto flex items-center">
            <Mountain className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">QuickElevation</h1>
          </div>
        </header>
        
        <main className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="grid gap-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <LocationSearch onLocationSelect={handleLocationSelect} />
                </div>
                
                <div className="flex flex-col gap-4">
                  <CurrentLocationButton onLocationDetected={handleCurrentLocation} />
                  
                  {selectedLocation && (
                    <ElevationDisplay
                      latitude={selectedLocation.latitude}
                      longitude={selectedLocation.longitude}
                      locationName={selectedLocation.name}
                    />
                  )}
                </div>
              </div>
              
              {!selectedLocation && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold mb-2">
                    Find Elevation Data Quickly
                  </h2>
                  <p className="text-muted-foreground">
                    Search for a location or use your current position to get precise elevation data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <footer className="py-6 px-4 border-t">
          <div className="container max-w-4xl mx-auto text-center text-sm text-muted-foreground">
            <p>© 2025 QuickElevation. Powered by Open Elevation and TomTom APIs.</p>
          </div>
        </footer>
      </div>
      
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;