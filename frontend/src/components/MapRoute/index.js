import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapRoute = () => {
  const [mapConfig, setMapConfig] = useState({
    center: [20.5937, 78.9629],
    zoom: 5,
  });

  useEffect(() => {
    const fetchMapConfig = async () => {
      const response = await fetch("http://localhost:3000/map");
      const data = await response.json();
      if (response.ok) {
        setMapConfig({ center: data.center, zoom: data.zoom });
      }
    };
    fetchMapConfig();
  }, []);

  return (
    <MapContainer
      center={mapConfig.center}
      zoom={mapConfig.zoom}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default MapRoute;
