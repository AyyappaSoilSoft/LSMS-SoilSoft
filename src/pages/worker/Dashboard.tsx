import React, { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const factoryLocation: Location = {
  latitude: 17.385044, // Example latitude
  longitude: 78.486671, // Example longitude
  accuracy: 100,
};

const haversineDistance = (coords1: Location, coords2: Location): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371e3; // Radius of Earth in meters

  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
  const deltaLat = toRad(coords2.latitude - coords1.latitude);
  const deltaLon = toRad(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const WorkerDashboard: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  useEffect(() => {
    const updateLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({ latitude, longitude, accuracy });
          setError(null);
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    };

    updateLocation();
    const interval = setInterval(updateLocation, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    if (!location) return;
    const distance = haversineDistance(location, factoryLocation);
    if (distance <= factoryLocation.accuracy) {
      setIsCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString());
    } else {
      setError("You are not within the required range to check in.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Worker Dashboard</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      {location && (
        <div className="mb-4">
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy.toFixed(2)} meters</p>
          <p>Distance from Factory: {haversineDistance(location, factoryLocation).toFixed(2)} meters</p>
        </div>
      )}
      {!isCheckedIn ? (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleCheckIn}
          disabled={!location}
        >
          Check In
        </button>
      ) : (
        <p className="text-green-600">Checked in at {checkInTime}</p>
      )}
    </div>
  );
};

export default WorkerDashboard;
