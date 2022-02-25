import React, { useRef, useEffect, useState } from 'react';
import Popup from '../Train/TrainData/Popup';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './map.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW5naWVneWkiLCJhIjoiY2t6eHo3bnZ3MDZkNTJvbnRhb3pucHNzMCJ9.M0LQFtd2bK54Z1UTDtzhAw';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(144.966964346166);
  const [lat, setLat] = useState(-37.8183051340585);
  const [zoom, setZoom] = useState(15);

  const coordinates = [
    [[144.966964346166, -37.8183051340585],
    [144.967731536194, -37.8180840725787],
    [144.967915434574, -37.8180061406911],
    [144.968831710922, -37.8177335742904],
    [144.970386306518, -37.8173818877091],
    [144.971989018237, -37.8169318797019]],
  ]

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
    map.current.addControl(new mapboxgl.NavigationControl());
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("load", () => {
      map.current.addSource("lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: coordinates.map(elem => ({
            type: "Feature",
            properties: {
              color: "#F7455D", // red
            },
            geometry: {
              type: "LineString",
              coordinates: elem
            },
          })
          )
        },
      });
      map.current.addLayer({
        id: "lines",
        type: "line",
        source: "lines",
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
        'paint': {
          'line-width': 3,
          // Use a get expression (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
          // to set the line-color to a feature property value.
          'line-color': ['get', 'color']
        },
      });
    });
  });

  return (
    <div>
      <h1>Hello</h1>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <Popup nextStation="Flinders Street" etaTime="7:30pm" occupancy="Light"/>
    </div>
  );
}
