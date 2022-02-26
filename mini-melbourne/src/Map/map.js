import * as React from 'react';
import {useState} from 'react';
import Map, {
  Popup,
  NavigationControl,
  GeolocateControl
} from 'react-map-gl';
import {LineLayer} from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StationMarkers } from './Stations';
import Dialog, { cardType } from '../Train/TrainData/Dialog';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoidGhlb3J2b2x0IiwiYSI6ImNreGQ3c3hoZTNkbjUyb3BtMHVnc3ZldGYifQ.r5r7g8XYCkOivBeapa9gSw';

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

  const layers = [new LineLayer({ id: 'line-layer', pathData })];
  const [popupInfo, setPopupInfo] = useState(null);
  const [zoom, setZoom] = useState(13);

  // Viewport settings
  const INITIAL_VIEW_STATE = {
    longitude: 144.966964346166,
    latitude: -37.8183051340585,
    zoom: zoom,
    pitch: 0,
    bearing: 0,
  };

  return (
    // <DeckGL
    //   initialViewState={INITIAL_VIEW_STATE}
    //   controller={{dragPan: false}}
    //   layers={layers} 
    // >
    <>
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: 600, height: 400 }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/theorvolt/ckxd802bwenhq14jmeevpfu3t"
      >
        <NavigationControl position="top-left"  onViewportChange={(viewport) => setZoom(viewport)}/>
        <GeolocateControl position="top-left" />
        <StationMarkers setPopupInfo={setPopupInfo}/>
        <StationMarkers setPopupInfo={setPopupInfo}/>
        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={Number(popupInfo.stop_lon)}
            latitude={Number(popupInfo.stop_lat)}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
          >
            <Dialog title={popupInfo.stop_name} cardType={cardType.STATION}/>
          </Popup>
        )}
      </Map>
    </>
  );
}

export default App;
