import * as React from 'react';
import { useState } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Dialog, { cardType } from '../Train/TrainData/Dialog';
import DeckGL from '@deck.gl/react';
import { IconLayer, PathLayer } from '@deck.gl/layers';
import stations from './data/stations.json';
import getPathData from './data/getPathData';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import getTrainPointsData from './data/getTrainPointsData';
import getNextStation from '../Train/TrainData/GetNextStation';
import getTrainLine from '../Train/TrainData/GetTrainLine';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Fuse from 'fuse.js';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';

export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoidGhlb3J2b2x0IiwiYSI6ImNreGQ3c3hoZTNkbjUyb3BtMHVnc3ZldGYifQ.r5r7g8XYCkOivBeapa9gSw';

export const iconMapping = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

export const positionOrigin = [144.966964346166, -37.8183051340585];

const options = {
  keys: ['stop_name'],
};

const fuse = new Fuse(stations, options);

function App() {
  const [paths, setPaths] = React.useState();
  // TODO: Preprocess these data points into the format
  const [zoom] = useState(13);
  const [hoverInfo, setHoverInfo] = useState({});
  const [trainInfo, setTrainInfo] = useState({});
  // train data
  const [nextStop, setNextStop] = useState();
  const [trainPoints, setTrainPoints] = useState({});
  const [trainName, setTrainName] = useState({});
  const [searchQuery, setSearchContents] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Viewport settings
  const INITIAL_VIEW_STATE = {
    longitude: 144.966964346166,
    latitude: -37.8183051340585,
    zoom: zoom,
    pitch: 0,
    bearing: 0,
  };

  const [viewState, setViewState] = useState({
    longitude: 144.966964346166,
    latitude: -37.8183051340585,
    zoom: zoom,
    pitch: 0,
    bearing: 0,
  });

  const inputHandler = (e) => {
    setSearchContents(e.target.value);
    setSearchResults(fuse.search(searchQuery).slice(0, 5));
  };

  const onClickSearchResultHandler = (station) => {
    setViewState((currViewState) => {
      return {
        ...currViewState,
        longitude: parseFloat(station.stop_lon),
        latitude: parseFloat(station.stop_lat),
      };
    });
    setSearchContents('');
    setSearchResults([]);
  };

  const hideTooltip = () => {
    setHoverInfo({});
    setTrainInfo({});
  };
  // var trainData = new Map();

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
            closeDialog={hideTooltip}
          />
        </div>
      );
    }
  }

  function renderTrainInfo(info) {
    return (
      <>
        {info.y && nextStop && (
          <div
            className="tooltip interactive"
            style={{ left: info.x, top: info.y, position: 'absolute' }}
            key={trainName.line_name}
          >
            <Dialog
              title={trainName.line_name}
              nextStation={nextStop.stop.name}
              eta={nextStop.arrival}
              occupancy={`${'Heavy'}%`}
              cardType={cardType.TRAIN}
              closeDialog={hideTooltip}
            />
          </div>
        )}
      </>
    );
  }

  const newPoints = stations.map((station) => {
    return {
      ID: station.stop_id,
      LOCATION_NAME: station.stop_name,
      COORDINATES: [parseFloat(station.stop_lon), parseFloat(station.stop_lat)],
    };
  });

  const expandTooltip = (info) => {
    if (info) {
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const showTrainInfo = (info) => {
    console.log(info);
    if (info) {
      setTrainInfo(info);
    } else {
      setTrainInfo({});
    }
  };

  // Train Paths
  React.useEffect(() => {
    // Get the train line paths
    const getPaths = async () => {
      await getPathData().then((response) => setPaths(response));
    };
    getPaths();

    const nextStation = async (trip_id) => {
      getNextStation(trip_id).then((res) => {
        setNextStop(res);
      });
    };

    const getTripId = async (trip_id) => {
      getTrainLine(trip_id).then((res) => {
        setTrainName(res);
      });
    };
    getTripId('379.T2.2-BEL-B-mjp-1.26.R');

    // For each train (id), call getNextStation
    // nextStation2();
    nextStation('379.T2.2-BEL-B-mjp-1.26.R');
  }, []);

  // periodic fetch and display
  // 15 seconds lurp
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getTrainPointsData();
      setTrainPoints(data.services);
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
      data: trainPoints ?? [],
      pickable: true,
      scenegraph:
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
      getPosition: (d) => d.coords,
      getOrientation: (d) => [0, Math.random() * 180, 90],
      _animations: {
        '*': { speed: 5 },
      },
      sizeScale: 250,
      _lighting: 'pbr',
      onClick: showTrainInfo,
    }),
  ];

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={(viewState) => {
        console.log(viewState);
        // TODO: extract this to a handler
        setViewState(viewState.viewState);
        hideTooltip();
      }}
      controller={true}
      layers={layers}
      onClick={() => {}}
      pickingRadius={20}
    >
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: 600, height: 400 }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        dragPan={false}
        cursor={'crosshair'}
      />
      {renderTooltip(hoverInfo)}
      {renderTrainInfo(trainInfo)}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          left: '8px',
        }}
      >
        <div
          style={{
            boxShadow:
              '0px 0px 2px rgba(0, 0, 0, 0.12), 0px 20px 20px rgba(0, 0, 0, 0.08)',
            border: 'solid 2px white',
            borderRadius: 32,
            backgroundColor: 'white',
            paddingRight: 16,
            marginBottom: 4,
          }}
        >
          <IconButton
            onClick={() => {}}
            style={{
              border: 'solid 2px white',
              backgroundColor: 'white',
              borderRadius: 32,
              cursor: 'pointer',
            }}
          >
            <SearchIcon />
          </IconButton>
          {/* TODO: Style the text input */}
          <input
            type="text"
            style={{
              border: 'none',
              borderWidth: 0,
              outlineStyle: 'none',
            }}
            onChange={inputHandler}
            value={searchQuery}
            placeholder="Search for a station"
          />
        </div>
        {searchQuery &&
          searchQuery.length > 0 &&
          searchResults &&
          searchResults.length > 0 && (
            <div
              style={{
                boxShadow:
                  '0px 0px 2px rgba(0, 0, 0, 0.12), 0px 20px 20px rgba(0, 0, 0, 0.08)',
                border: 'solid 2px white',
                borderRadius: 32,
                backgroundColor: 'white',
                paddingRight: 16,
                maxHeight: 400,
                padding: 12,
                cursor: 'pointer',
              }}
            >
              {searchResults.map((result) => {
                return (
                  <div key={result.item.stop_id}>
                    <div
                      onClick={() => onClickSearchResultHandler(result.item)}
                    >
                      <Typography variant="h5">
                        {result.item.stop_name}
                      </Typography>
                    </div>
                    <Divider />
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </DeckGL>
  );
}

export default App;
