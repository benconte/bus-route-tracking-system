import { useEffect, useState } from "react";

const useEtaToNextStop = (
  driverLocation: google.maps.LatLngLiteral | null,
  nextStop: google.maps.LatLngLiteral | null
): number | null => {
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    if (driverLocation && nextStop) {
      const directionsService = new google.maps.DirectionsService();
      const request: google.maps.DirectionsRequest = {
        origin: driverLocation,
        destination: nextStop,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0];
          const legs = route.legs;
          if (legs && legs.length > 0) {
            const duration = legs[0].duration?.value; // Duration in seconds
            if (duration !== undefined) {
              setEta(duration);
            } else {
              console.error("Duration not available");
              setEta(null);
            }
          } else {
            console.error("No route legs found");
            setEta(null);
          }
        } else {
          console.error(`DirectionsService failed due to: ${status}`);
          setEta(null);
        }
      });
    }
  }, [driverLocation, nextStop]);

  return eta;
};

export default useEtaToNextStop;
