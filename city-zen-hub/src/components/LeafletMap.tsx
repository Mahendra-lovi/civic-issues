import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapIssue {
  id: number;
  title: string;
  coordinates: { lat: number; lng: number };
  status: string;
  category: string;
  urgency: string;
}

interface LeafletMapProps {
  mapIssues: MapIssue[];
  filterStatus: string;
  filterCategory: string;
}

const LeafletMap = ({ mapIssues, filterStatus, filterCategory }: LeafletMapProps) => {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Simulate loading time for the map
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-red-500 text-white";
      case "in-progress":
        return "bg-yellow-500 text-white";
      case "resolved":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredIssues = mapIssues
    .filter(issue => filterStatus === "all" || issue.status === filterStatus)
    .filter(issue => filterCategory === "all" || issue.category.toLowerCase().replace(' ', '-') === filterCategory);

  return (
    <div className="h-full w-full relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center z-20">
          <div className="text-center">
            <Navigation className="h-8 w-8 text-blue-600 mx-auto mb-2 animate-spin" />
            <p className="text-blue-600 font-medium">Loading interactive map...</p>
            <p className="text-sm text-gray-500 mt-1">Getting your location</p>
          </div>
        </div>
      )}

      <MapContainer
        center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [40.7128, -74.0060]}
        zoom={currentLocation ? 15 : 12}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current location marker */}
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">Your Location</h3>
                <p className="text-xs text-gray-600">
                  Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Issue markers */}
        {filteredIssues.map((issue) => (
          <Marker
            key={`marker-${issue.id}`}
            position={[issue.coordinates.lat, issue.coordinates.lng]}
          >
            <Popup>
              <div className="p-3 min-w-[220px]">
                <h3 className="font-bold text-base mb-2 text-gray-800">{issue.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(issue.urgency)}`}>
                      {issue.urgency.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-sm font-medium text-gray-700 mb-1">Category:</p>
                    <p className="text-sm text-gray-600">{issue.category}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {issue.id}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map info overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-gray-700">
            {filteredIssues.length} issues displayed
          </span>
        </div>
        {currentLocation && (
          <div className="text-xs text-gray-500 mt-1">
            Location tracking enabled
          </div>
        )}
      </div>
    </div>
  );
};

export default LeafletMap;
