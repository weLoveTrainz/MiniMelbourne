import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './map.css';
import stations from './data/stations.json';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW5naWVneWkiLCJhIjoiY2t6eHo3bnZ3MDZkNTJvbnRhb3pucHNzMCJ9.M0LQFtd2bK54Z1UTDtzhAw';

export default function Map() {
  const [lng, setLng] = useState(144.966964346166);
  const [lat, setLat] = useState(-37.8183051340585);
  const [zoom, setZoom] = useState(10);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    map.on('load', () => {
      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (map) {
      stations.map((station) => {
        new mapboxgl.Marker()
          .setLngLat([station.stop_lon, station.stop_lat])
          .addTo(map);
      });
    }
  }, [map]);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
}
