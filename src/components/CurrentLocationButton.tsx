import { useState } from "react";
import { Button } from "./ui/button";
import { Locate, Loader2 } from "lucide-react";
import { getCurrentLocation } from "../api/location";
import { useToast } from "../hooks/use-toast";

interface CurrentLocationButtonProps {
  onLocationDetected: (latitude: number, longitude: number) => void;
}

export function CurrentLocationButton({
  onLocationDetected,
}: CurrentLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const coords = await getCurrentLocation();
      onLocationDetected(coords.latitude, coords.longitude);
      toast({
        title: "Current location detected",
        description: "Fetching elevation data...",
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      toast({
        title: "Location error",
        description: "Could not access your location. Please check browser permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGetCurrentLocation}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Locate className="h-4 w-4 mr-2" />
      )}
      Use Current Location
    </Button>
  );
}