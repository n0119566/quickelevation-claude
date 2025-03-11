import { useQuery } from "@tanstack/react-query";
import { ElevationResult, getElevation } from "../api/location";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, Mountain } from "lucide-react";

interface ElevationDisplayProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

export function ElevationDisplay({
  latitude,
  longitude,
  locationName,
}: ElevationDisplayProps) {
  const { data, isLoading, isError } = useQuery<ElevationResult>({
    queryKey: ["elevation", latitude, longitude],
    queryFn: () => getElevation({ latitude, longitude }),
    enabled: !!latitude && !!longitude,
  });

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="h-5 w-5" />
          Elevation Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && <p className="text-muted-foreground">Loading elevation data...</p>}
          
          {isError && (
            <p className="text-destructive">
              Failed to load elevation data. Please try again.
            </p>
          )}
          
          {data && (
            <>
              <div className="grid gap-1">
                <h3 className="font-medium">Location</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {locationName || formatCoordinates(latitude, longitude)}
                </p>
              </div>
              
              <div className="grid gap-1">
                <h3 className="font-medium">Coordinates</h3>
                <p className="text-sm text-muted-foreground">
                  {formatCoordinates(data.coordinates.latitude, data.coordinates.longitude)}
                </p>
              </div>
              
              <div className="grid gap-1">
                <h3 className="font-medium">Elevation</h3>
                <p className="text-2xl font-bold">
                  {data.elevation.toFixed(1)} meters
                </p>
                <p className="text-md">
                  {(data.elevation * 3.28084).toFixed(1)} feet
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}