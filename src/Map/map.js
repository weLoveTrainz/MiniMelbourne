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
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Fuse from 'fuse.js';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import getTripData from './data/getTripData';
import Circle from '../assets/Circle.glb';
import { colours } from './data/getPathData';
import Train from '../assets/AWT-Train.png';
import mapboxgl from 'mapbox-gl'; // This is a dependency of react-map-gl even if you didn't explicitly install it
import {
  tripIdToLine,
  tripToLine,
  trip_ids,
  getPathPointByTripId,
} from './data/getPathPoint';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoidGhlb3J2b2x0IiwiYSI6ImNreGQ3c3hoZTNkbjUyb3BtMHVnc3ZldGYifQ.r5r7g8XYCkOivBeapa9gSw';

export const iconMapping = {
  marker: { x: 0, y: 0, width: 200, height: 200, mask: false, anchorY: 200 },
};

export const positionOrigin = [144.966964346166, -37.8183051340585];

const options = {
  keys: ['stop_name'],
};

const fuse = new Fuse(stations, options);

function App() {

  const [paths, setPaths] = React.useState();
  const [counter, setCounter] = React.useState(0);
  // TODO: Preprocess these data points into the format
  const [zoom] = useState(15);
  const [hoverInfo, setHoverInfo] = useState({});
  const [trainInfo, setTrainInfo] = useState({});
  // train data
  const [trainPoints, setTrainPoints] = useState({});
  const [nextStations, setNextStations] = useState({});
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
    pitch: 100,
    bearing: -20,
  });
  //var ws = null; // Define websockets

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
  const occupancyInfo = (occ_num) => {
    /* Gets Occupancy Information
    */
    switch (occ_num) {
      case 0:
        return "Empty";
      case 1:
        return "Many seats available";
      case 2:
        return "Few seats available";
      case 3:
        return "Standing room only";
      case 4:
        return "Crushed - Standing room only";
      case 5:
        return "Full";
      case 6:
        return "Not accepting passengers";
      case 7:
        return "No data";
      case 8:
        return "Not boardable";
      case null:
        return "No data";
    }
  }

  function renderTrainInfo(info) {
    /*
    Train card


    */
    return (
      info.object &&
      info.object.data &&
      info.object.data.data &&
      info.y && (
        <div
          className="tooltip interactive"
          style={{ left: info.x, top: info.y, position: 'absolute' }}
        >
          <Dialog
            title={info.object.data && info.object.data.trainName}
            nextStation={
              info.object.data.data.stop
                ? info.object.data.data.stop
                : 'Trip Completed'
            }
            eta={
              info.object.data.data
                ? info.object.data.data.arrival
                : 'Trip Completed'
            }
            occupancy={`${occupancyInfo(info.object.data.data.occupancy)}`}
            cardType={cardType.TRAIN}
            closeDialog={hideTooltip}
            trip_id={info.object.trip_id}
            vehicle_id={info.object.vehicle_id}
            color={`rgb(${info.object.color.join(', ')})`}
          />
        </div>
      )
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


    const getNextStationData = async () => {
      await getTripData().then((response) => {
        setNextStations(response);

      });
    };

    getNextStationData();
  }, []);

  // periodic fetch and display
  // 15 seconds lurp
  React.useEffect(() => {
    const interval = setInterval(async () => {
      //ws = new WebSocket("ws://")
      const data = await getTrainPointsData();

      // NOT TO BE USED
      if (!data) {
        setCounter((curr) => (curr += 1));
        const data = trip_ids.map((trip_id) => ({
          coords: getPathPointByTripId(trip_id, counter),
          trip_id: trip_id,
          data: {
            tripId: trip_id,
            trainName: `${tripIdToLine[trip_id]}`,
            data: {
              stop: null,
              arrival: null,
            },
          },
          color: [2, 132, 48],
        }));
        setTrainPoints(data);
      } else {
        // LOOK HERE

        const new_data = [];
        data.services.map((obj) =>
          new_data.push({
            coords: [obj.longitude, obj.latitude],
            trip_id: obj.trip_id,
            start_time: obj.start_time,
            data: {
              tripId: obj.trip_id,
              trainName: `${tripToLine(obj.trip_id)}`,
              data: {
                stop: obj.next_stop,
                arrival: obj.arrival,
                occupancy: obj.occupancy
              },
            }, //nextStations.filter((stop) => stop.tripId === obj.trip_id)[0], // This may be undefined
            color: getColour(obj.trip_id),
          })
        );
        setTrainPoints(new_data);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  const getColour = (routeName) => {
    for (const [name, colour] of Object.entries(colours)) {
      if (routeName.includes(name)) {
        return colour;
      }
    }
  };

  const layers = [
    new PathLayer({
      data: paths,
      getPath: (f) => f.path,
      getColor: (d) => d.color,
      getWidth: 20,
      widthMinPixels: 1,
      pickable: true,
    }),
    new IconLayer({
      id: 'icon-lnglat',
      pickable: true,
      data: newPoints,
      iconAtlas: Train,
      iconMapping,
      sizeScale: 20,
      getPosition: (d) => {
        return d.COORDINATES;
      },
      getColor: (d) => [64, 64, 72],
      getIcon: (d) => {
        return 'marker';
      },
      getSize: (d) => {
        return 2;
      },
      opacity: 0.8,
      onClick: expandTooltip,
    }),
    new ScenegraphLayer({
      id: 'scenegraph-layer',
      data: trainPoints ?? [],
      pickable: true,
      scenegraph: Circle,
      getPosition: (d) => d.coords,
      getOrientation: (d) => [0, 180, 90],
      _animations: {
        '*': { speed: 5 },
      },
      getSize: (d) => {
        return 8;
      },
      sizeScale: 40,
      _lighting: 'pbr',
      getColor: (d) => d.color,
      onClick: showTrainInfo,
    }),
  ];

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={(viewState) => {
        // TODO: extract this to a handler
        setViewState(viewState.viewState);
        hideTooltip();
      }}
      controller={true}
      layers={layers}
      onClick={() => { }}
      pickingRadius={20}
    >
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: 600, height: 400 }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/theorvolt/ckxd802bwenhq14jmeevpfu3t"
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
            onClick={() => { }}
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
