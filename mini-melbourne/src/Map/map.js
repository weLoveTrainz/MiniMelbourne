import * as React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL from '@deck.gl/react';
import { LineLayer, PathLayer } from '@deck.gl/layers';
import { StationMarkers } from './Stations';

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

const pathData = [
  {
    path: [
      [144.966964346166, -37.8183051340585],
      [144.967731536194, -37.8180840725787],
      [144.967915434574, -37.8180061406911],
      [144.968831710922, -37.8177335742904],
      [144.970386306518, -37.8173818877091],
      [144.971989018237, -37.8169318797019],
    ],
    name: 'Richmond - Millbrae',
    color: [255, 0, 0],
  },
];

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [144.966964346166, -37.8183051340585],
    targetPosition: [144.971989018237, -37.8169318797019],
  },
];

export const positionOrigin = [144.966964346166, -37.8183051340585];

export const zigzag = [
  {
    // Big zigzag
    path: new Array(12)
      .fill(0)
      .map((d, i) => [
        positionOrigin[0] + i * i * 0.001,
        positionOrigin[1] + (Math.cos(i * Math.PI) * 0.2) / (i + 4),
      ]),
  },
  {
    // Tiny zigzag
    path: new Array(12)
      .fill(0)
      .map((d, i) => [
        positionOrigin[0] - 0.001 - i * i * 1e-5,
        positionOrigin[1] + (Math.cos(i * Math.PI) * 2e-3) / (i + 4),
      ]),
  },
  {
    // Tiny circle
    path: new Array(25)
      .fill(0)
      .map((d, i) => [
        positionOrigin[0] + Math.cos((i / 12) * Math.PI) * 2e-5,
        positionOrigin[1] + Math.sin((i / 12) * Math.PI) * 2e-5,
      ]),
  },
  {
    // A-B-A
    path: [
      [positionOrigin[0] - 0.005, positionOrigin[1] + 0.005],
      [positionOrigin[0] - 0.005, positionOrigin[1] - 0.005],
      [positionOrigin[0] - 0.005, positionOrigin[1] + 0.005],
    ],
  },
];

function App() {
  const layers = [
    new LineLayer({ id: 'line-layer', data }),
    new PathLayer({
      data: zigzag,
      getPath: (f) => f.path,
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
        initialViewState={{
          longitude: 144.966964346166,
          latitude: -37.8183051340585,
          zoom: 14,
        }}
        style={{ width: 600, height: 400 }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/theorvolt/ckxd802bwenhq14jmeevpfu3t"
      >
        <StationMarkers />
      </Map>
    </DeckGL>
  );
}

export default App;
