import stations from './data/stations.json';
import { Marker } from 'react-map-gl';

import Pin from './Pin';

export const StationMarkers = (props) => {
  return (
    <>
      {stations.map((station) => {
        return (
          <Marker
            longitude={station.stop_lon}
            latitude={station.stop_lat}
            anchor="bottom"
          >
          <Pin onClick={() => props.setPopupInfo(station)} />
          </Marker>
        );
      })}
    </>
  );
};
