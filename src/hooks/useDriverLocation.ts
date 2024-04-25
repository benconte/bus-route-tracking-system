import { useState, useEffect } from 'react';

interface DriverLocation {
  lat: number;
  lng: number;
}

const useDriverLocation = (initialLocation?: DriverLocation) => {
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(initialLocation || null);
  const [watchId, setWatchId] = useState<number | null>(null);
  // const logIntervalRef = useRef<number | null>(null);

  // const logDriverLocation = () => {
  //   if (driverLocation) {
  //     console.log('Driver Location:', driverLocation);
  //   }
  // };

  const isGeolocationAvailable = () => {
    return 'geolocation' in navigator;
  };

  const handleGeolocationError = (error: GeolocationPositionError) => {
    console.error('Geolocation error:', error.message);
  };

  const updateDriverLocation = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setDriverLocation({ lat: latitude, lng: longitude });
  };

  useEffect(() => {
    if (isGeolocationAvailable()) {
      const watchId = navigator.geolocation.watchPosition(updateDriverLocation, handleGeolocationError);
      setWatchId(watchId);

      // Start logging driver's location every 5 seconds
      // const logInterval = window.setInterval(logDriverLocation, 5000);
      // logIntervalRef.current = logInterval;
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    // Cleanup function to stop watching for location changes when the component unmounts
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      // if (logIntervalRef.current !== null) {
      //   clearInterval(logIntervalRef.current);
      // }
    };
  }, []);

  return driverLocation;
};

export default useDriverLocation;