import * as React from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL from '@deck.gl/react';
import { PathLayer } from '@deck.gl/layers';
import { StationMarkers } from './Stations';
import Popup from '../Train/TrainData/Popup';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoidGhlb3J2b2x0IiwiYSI6ImNreGQ3c3hoZTNkbjUyb3BtMHVnc3ZldGYifQ.r5r7g8XYCkOivBeapa9gSw';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 144.966964346166,
  latitude: -37.8183051340585,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

export const positionOrigin = [144.966964346166, -37.8183051340585];

export const pathData = [
  {
    path: [
      [144.966964346166, -37.8183051340585],
      [144.967731536194, -37.8180840725787],
      [144.967915434574, -37.8180061406911],
      [144.968831710922, -37.8177335742904],
      [144.970386306518, -37.8173818877091],
      [144.971989018237, -37.8169318797019],
    ],
    name: 'Richmond',
    color: [255, 0, 0],
  },
];

function App() {
  const layers = [
    new PathLayer({
      data: pathData,
      getPath: (f) => f.path,
      getColor: (d) => d.color,
      getWidth: 10,
      widthMinPixels: 1,
      pickable: true,
    }),
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: 600, height: 400 }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/theorvolt/ckxd802bwenhq14jmeevpfu3t"
      >
        <StationMarkers />
      </Map>
      <Popup nextStation="Flinders Street" etaTime="7:30pm" occupancy="Light" />
    </DeckGL>
  );
}

export default App;
