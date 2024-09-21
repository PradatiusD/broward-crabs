'use client'
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useCallback, useState } from "react";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  console.log(map)
  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const defaultCenter = {
    lat: 40.73061, // Default center point (NYC coordinates)
    lng: -73.935242,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;