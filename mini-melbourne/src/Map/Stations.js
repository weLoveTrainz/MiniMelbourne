import stations from './data/stations.json';
import marker from './marker.png';
import Map, { Marker } from 'react-map-gl';

export const StationMarkers = () => {
  return (
    <>
      {stations.map((station) => {
        return (
          <Marker
            longitude={station.stop_lon}
            latitude={station.stop_lat}
            anchor="bottom"
          >
            <img src={marker} />
          </Marker>
        );
      })}
    </>
  );
};
