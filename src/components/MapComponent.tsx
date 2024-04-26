import { useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import useDriverLocation from "../hooks/useDriverLocation";

interface MapProps {
  startingPoint: google.maps.LatLngLiteral;
  stops: google.maps.LatLngLiteral[];
  endingPoint: google.maps.LatLngLiteral;
}

const MapComponent: React.FC<MapProps> = ({
  startingPoint,
  stops,
  endingPoint,
}) => {
  const [, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setRoutePolyline] = useState<string>("");
  const driverLocation = useDriverLocation();
 
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_PLACES_API_KEY!,
  });

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const directionsService = new google.maps.DirectionsService();
      const request = {
        origin: startingPoint,
        destination: endingPoint,
        waypoints: stops.map((stop) => ({ location: stop })),
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const routePolyline = result
            ? result.routes[0].overview_polyline
            : "";
          setRoutePolyline(routePolyline);

          const newMap = new google.maps.Map(mapRef.current!, {
            zoom: 14,
            center: startingPoint,
            fullscreenControl: false, // Hide the fullscreen control
            mapTypeControl: false, // Hide the map type control
            streetViewControl: false, // Hide the street view control
          });

          const decodedPath =
            google.maps.geometry.encoding.decodePath(routePolyline);
          const routePath = new google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: "#245daf",
            strokeOpacity: 1.0,
            strokeWeight: 5,
          });
          routePath.setMap(newMap);

          const startingPointIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#FFFFFF",
            fillOpacity: 1,
            scale: 6,
            strokeColor: "#2b3a58",
            strokeWeight: 3,
          };

          const stopIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#FFFFFF",
            fillOpacity: 1,
            scale: 5,
            strokeColor: "#2b3a58",
            strokeWeight: 2,
          };

          const endingPointIcon = {
            path: "M 0,-4 c -2,0 -4,2 -4,4 0,3 4,7 4,7 0,0 4,-4 4,-7 0,-2 -2,-4 -4,-4 z M 0,0 m -4,0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0",
            fillColor: "#FF0000",
            fillOpacity: 1,
            scale: 2,
            strokeColor: "#FF0000",
            strokeWeight: 1,
          };

          new google.maps.Marker({
            position: startingPoint,
            map: newMap,
            icon: startingPointIcon,
          });

          stops.forEach((stop) => {
            new google.maps.Marker({
              position: stop,
              map: newMap,
              icon: stopIcon,
            });
          });

          new google.maps.Marker({
            position: endingPoint,
            map: newMap,
            icon: endingPointIcon,
          });

          if (driverLocation) {
            const driverMarker = new google.maps.Marker({
              position: driverLocation,
              map: newMap,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "blue",
                fillOpacity: 1,
                scale: 6,
                strokeColor: "white",
                strokeWeight: 2,
              },
            });

            // Add a listener to update the driver marker position when the location changes
            const updateDriverMarker = () => {
              if (driverMarker && driverLocation) {
                driverMarker.setPosition(driverLocation);
              }
            };
            updateDriverMarker();

            // Watch for location changes and update the driver marker
            const watchId =
              navigator.geolocation.watchPosition(updateDriverMarker);

            // Cleanup function to stop watching for location changes when the component unmounts
            return () => {
              navigator.geolocation.clearWatch(watchId);
            };
          }

          setMap(newMap);
        }
      });
    }
  }, [isLoaded, startingPoint, stops, endingPoint, driverLocation]);

  if (!isLoaded) {
    return <h3>Initializing map...</h3>;
  }

  return <div ref={mapRef} style={{ height: "100vh", width: "100vw" }} />;
};

export default MapComponent;
