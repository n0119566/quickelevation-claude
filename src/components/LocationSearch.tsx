import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Search, MapPin, Loader2 } from "lucide-react";
import { LocationResult, searchLocation } from "../api/location";
import { useToast } from "../hooks/use-toast";

interface LocationSearchProps {
  onLocationSelect: (location: LocationResult) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const {
    data: locations,
    isLoading,
    isError,
    refetch,
  } = useQuery<LocationResult[]>({
    queryKey: ["locations", searchQuery],
    queryFn: () => searchLocation(searchQuery),
    enabled: false,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a location",
        variant: "destructive",
      });
      return;
    }
    
    refetch();
  };

  const handleLocationSelect = (location: LocationResult) => {
    onLocationSelect(location);
    setSearchQuery("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter city, address, or landmark"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>
          
          {isError && (
            <p className="text-destructive text-sm">
              Error searching location. Please try again.
            </p>
          )}
          
          {locations && locations.length > 0 && (
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Results</h3>
              <ul className="space-y-1 max-h-40 overflow-auto rounded-md border p-2">
                {locations.map((location, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      className="w-full text-left px-2 py-1 hover:bg-accent rounded-sm flex items-center gap-2 text-sm"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {location.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {locations && locations.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No locations found. Try a different search.
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}