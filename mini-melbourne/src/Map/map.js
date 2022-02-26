import React, { useRef, useEffect, useState } from "react";
import Popup from "../Train/TrainData/Popup";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./map.css";
import stations from "./data/stations.json";
import { MapboxLayer } from "@deck.gl/mapbox";
import { PathLayer } from "@deck.gl/layers";
import cardType from '../Train/TrainData/Popup'

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhlb3J2b2x0IiwiYSI6ImNreGQ3c3hoZTNkbjUyb3BtMHVnc3ZldGYifQ.r5r7g8XYCkOivBeapa9gSw";

const data = [
  {
    path: [
      [144.966964346166, -37.8183051340585],
      [144.967731536194, -37.8180840725787],
      [144.967915434574, -37.8180061406911],
      [144.968831710922, -37.8177335742904],
      [144.970386306518, -37.8173818877091],
      [144.971989018237, -37.8169318797019],
    ],
    name: "Richmond",
    color: [255, 0, 0],
  },
];

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
      style: "mapbox://styles/theorvolt/ckxd802bwenhq14jmeevpfu3t",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    const deckLayer = new MapboxLayer({
      id: "path-layer",
      type: PathLayer,
      data,
      pickable: true,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: (d) => d.path,
      getColor: (d) => d.color,
      getWidth: (d) => 0.1,
    });

    map.on("load", () => {
      setMap(map);
      map.addLayer(deckLayer);
    });

    // popup stuff 
    // create the popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
      'Construction on the Washington Monument began in 1848.'
      );

      stations.map((station) => {
        return new mapboxgl.Marker()
          .setLngLat([station.stop_lon, station.stop_lat])
          .setPopup(popup)
          .addTo(map);
      });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (map) {
      
    }
  }, [map]);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
      <Popup nextStation="Flinders Street" etaTime="7:30pm" occupancy="Light" type={cardType.TRAIN} />
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
}
