import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { MapPin, AlertTriangle, CheckCircle, Clock } from "lucide-react";
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
  description?: string;
}

interface MapsProps {
  mapIssues: MapIssue[];
  filterStatus: string;
  filterCategory: string;
}

const Maps = ({ mapIssues, filterStatus, filterCategory }: MapsProps) => {
  const [selectedIssue, setSelectedIssue] = useState<MapIssue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Simulate loading time for the map
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
        return <AlertTriangle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return { bg: "bg-red-500", text: "text-red-700", border: "border-red-200" };
      case "in-progress":
        return { bg: "bg-orange-500", text: "text-orange-700", border: "border-orange-200" };
      case "resolved":
        return { bg: "bg-green-500", text: "text-green-700", border: "border-green-200" };
      default:
        return { bg: "bg-gray-500", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const getUrgencyRadius = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return 100;
      case "medium":
        return 75;
      case "low":
        return 50;
      default:
        return 50;
    }
  };

  const filteredIssues = mapIssues
    .filter(issue => filterStatus === "all" || issue.status === filterStatus)
    .filter(issue => filterCategory === "all" || issue.category.toLowerCase().replace(' ', '-') === filterCategory);

  return (
    <div className="h-full w-full relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg flex items-center justify-center z-20">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2 animate-bounce" />
            <p className="text-purple-600 font-medium">Initializing Maps Component...</p>
            <p className="text-sm text-gray-500 mt-1">Setting up interactive features</p>
          </div>
        </div>
      )}

      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredIssues.map((issue) => {
          const colors = getStatusColor(issue.status);
          const radius = getUrgencyRadius(issue.urgency);

          return (
            <div key={`issue-${issue.id}`}>
              {/* Impact radius circle */}
              <Circle
                center={[issue.coordinates.lat, issue.coordinates.lng]}
                radius={radius}
                pathOptions={{
                  color: colors.bg.replace('bg-', '#'),
                  fillColor: colors.bg.replace('bg-', '#'),
                  fillOpacity: 0.1,
                  weight: 2
                }}
              />

              {/* Issue marker */}
              <Marker
                position={[issue.coordinates.lat, issue.coordinates.lng]}
                eventHandlers={{
                  click: () => setSelectedIssue(issue),
                }}
              >
                <Popup>
                  <div className="p-4 min-w-[280px] max-w-[320px]">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-full ${colors.bg} ${colors.text}`}>
                        {getStatusIcon(issue.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 text-gray-800">{issue.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                            {issue.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${colors.border} ${colors.text}`}>
                            {issue.urgency.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Category:</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{issue.category}</p>
                      </div>

                      {issue.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{issue.description}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="font-medium text-blue-700">Coordinates</p>
                          <p className="text-blue-600">
                            {issue.coordinates.lat.toFixed(4)}, {issue.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <p className="font-medium text-green-700">Issue ID</p>
                          <p className="text-green-600">#{issue.id}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Click on map to close • Impact radius: {radius}m
                        </p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>

      {/* Enhanced info overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl z-10 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-5 w-5 text-purple-600" />
          <span className="font-bold text-gray-800">Smart Maps</span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Issues:</span>
            <span className="font-medium text-gray-800">{filteredIssues.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active Radius:</span>
            <span className="font-medium text-purple-600">Dynamic</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Interactive:</span>
            <span className="font-medium text-green-600">Enabled</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10 border border-gray-200">
        <p className="text-xs font-bold text-gray-700 mb-2">Legend</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Reported</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;
