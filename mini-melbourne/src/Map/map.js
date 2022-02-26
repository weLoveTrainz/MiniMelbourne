import * as React from 'react';
import { useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Dialog, { cardType } from '../Train/TrainData/Dialog';
import DeckGL from '@deck.gl/react';
import { IconLayer, PathLayer } from '@deck.gl/layers';
import stations from './data/stations.json';
import getPathData from './data/getPathData';
import samplePathData from './data/100.T2.2-GLW-B-mjp-1.2.H.json';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import getNextStation from '../Train/TrainData/GetNextStation';

export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoidGhlb3J2b2x0IiwiYSI6ImNreGQ3c3hoZTNkbjUyb3BtMHVnc3ZldGYifQ.r5r7g8XYCkOivBeapa9gSw';

export const iconMapping = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

export const positionOrigin = [144.966964346166, -37.8183051340585];

function renderTooltip(info) {
  if (info.y) {
    return (
      <div
        className="tooltip interactive"
        style={{ left: info.x, top: info.y, position: 'absolute' }}
      >
        <Dialog
          title={info.object.LOCATION_NAME}
          cardType={cardType.STATION}
          occupancy={`${Math.floor(Math.random() * 100) + 1}%`}
        />
      </div>
    );
  }
}

function App() {
  const [paths, setPaths] = React.useState();
  // TODO: Preprocess these data points into the format
  const [zoom, setZoom] = useState(13);
  const [hoverInfo, setHoverInfo] = useState({});
  const [count, setCount] = useState(0);
  const [trainPoint, setTrainPoint] = useState([
    {
      ID: 'train_id',
      COORDINATES: [144.966964346166, -37.8183051340585],
    },
  ]);

  const newPoints = stations.map((station) => {
    return {
      ID: station.stop_id,
      LOCATION_NAME: station.stop_name,
      COORDINATES: [parseFloat(station.stop_lon), parseFloat(station.stop_lat)],
    };
  });

  const hideTooltip = () => {
    setHoverInfo({});
  };

  const expandTooltip = (info) => {
    if (info) {
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  // Viewport settings
  const INITIAL_VIEW_STATE = {
    longitude: 144.966964346166,
    latitude: -37.8183051340585,
    zoom: zoom,
    pitch: 0,
    bearing: 0,
  };
  React.useEffect(() => {
    // Get the train line paths
    const getPaths = async () => {
      await getPathData().then((response) => setPaths(response));
    };
    getPaths();
  }, []);

  // periodic fetch and display
  // 15 seconds lurp
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount += 1));
      setTrainPoint([
        {
          ID: 'train_id',
          COORDINATES: samplePathData.shape_file[count],
        },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  });

  const layers = [
    new PathLayer({
      data: paths,
      getPath: (f) => f.path,
      getColor: (d) => d.color,
      getWidth: 10,
      widthMinPixels: 1,
      pickable: true,
    }),
    new IconLayer({
      id: 'icon-lnglat',
      pickable: true,
      data: newPoints,
      iconAtlas:
        'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping,
      sizeScale: 20,
      getPosition: (d) => {
        return d.COORDINATES;
      },
      getColor: (d) => [64, 64, 72],
      getIcon: (d) => {
        // return  (d.PLACEMENT === 'SW' ? 'marker' : 'marker-warning')
        return 'marker';
      },
      getSize: (d) => {
        // return (d.RACKS > 2 ? 2 : 1)
        return 1;
      },
      opacity: 0.8,
      onClick: expandTooltip,
    }),
    new ScenegraphLayer({
      id: 'scenegraph-layer',
      data: trainPoint,
      pickable: true,
      scenegraph:
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
      getPosition: (d) => d.COORDINATES,
      getOrientation: (d) => [0, Math.random() * 180, 90],
      _animations: {
        '*': { speed: 5 },
      },
      sizeScale: 250,
      _lighting: 'pbr',
    }),
  ];

  console.log(samplePathData);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      onClick={() => {}}
      onViewStateChange={hideTooltip}
      pickingRadius={20}
    >
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: 600, height: 400 }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/theorvolt/ckxd802bwenhq14jmeevpfu3t"
        dragPan={false}
        cursor={'crosshair'}
      >
        <NavigationControl
          position="top-left"
          onViewportChange={(viewport) => setZoom(viewport)}
        />
      </Map>
      {renderTooltip(hoverInfo)}
    </DeckGL>
  );
}

export default App;

// new IconLayer({
//   id: 'trains',
//   pickable: true,
//   data: trainPoint,
//   iconAtlas:
//     'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
//   iconMapping,
//   sizeScale: 100,
//   getPosition: (d) => {
//     return d.COORDINATES;
//   },
//   getColor: (d) => [64, 64, 72],
//   getIcon: (d) => {
//     // return  (d.PLACEMENT === 'SW' ? 'marker' : 'marker-warning')
//     return 'marker';
//   },
//   getSize: (d) => {
//     // return (d.RACKS > 2 ? 2 : 1)
//     return 1;
//   },
//   opacity: 0.8,
//   onClick: expandTooltip,
// }),
