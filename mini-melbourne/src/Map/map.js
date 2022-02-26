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

export async function getPathData() {
  const lines = {
    'Lilydale': '1033.T5.2-LIL-C-mjp-1.35.R',
    'Belgrave': '232.T2.2-BEL-B-mjp-1.25.R',
    'Glen Waverley': '24.UT.2-GLW-F-mjp-1.4.H',
    'Alamein': '9568.T5.2-ALM-C-mjp-1.2.H',
    'Pakenam': '96.UT.2-PKM-G-mjp-1.14.R',
    'Cranbourne': '4821.T5.2-CRB-F-mjp-1.2.H',
    'Mernda': '6256.T5.2-MER-C-mjp-1.9.R',
    'Hurstbridge': '8418.T2.2-HBG-B-mjp-1.15.R',
    'Sunbury': '85.UT.2-SYM-G-mjp-1.17.R',
    'Craigieburn': '3988.T5.2-B31-D-mjp-1.12.R',
    'Upfield': '3989.T2.2-UFD-G-mjp-1.2.H',
    'Frankston': '1973.T5.2-FKN-F-mjp-1.12.R',
    'Werribee': '2.UT.2-WBE-L-mjp-1.7.H',
    'Williamstown': '3242.UQ.2-WMN-K-mjp-1.1.H',
    'Sandringham': '1952.T5.2-SDM-E-mjp-1.2.R'
  }

  const colours = {
    'Lilydale': [21, 44, 107],
    'Belgrave': [21, 44, 107],
    'Glen Waverley': [21, 44, 107],
    'Alamein': [21, 44, 107],
    'Pakenam': [39, 159, 213],
    'Cranbourne': [39, 159, 213],
    'Mernda': [190, 16, 20],
    'Hurstbridge': [190, 16, 20],
    'Sunbury': [255, 190, 0],
    'Craigieburn': [255, 190, 0],
    'Upfield': [255, 190, 0],
    'Frankston': [2, 132, 48],
    'Werribee': [2, 132, 48],
    'Williamstown': [2, 132, 48],
    'Sandringham': [241, 120, 175]
  }

  let pathData = []

  for(const [name, id] of Object.entries(lines)) {
    let response = await fetch(`http://118.139.86.189:8080/shape/${id}`)

    let json = await response.json()

    pathData.push({
      path: json.shape_file,
      name: name,
      color: colours[name]
    })
  }

  console.log(pathData)
}

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
