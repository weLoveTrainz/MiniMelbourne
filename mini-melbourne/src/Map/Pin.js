import * as React from 'react';
import marker from './marker.png';

const pinStyle = {
  cursor: 'pointer',
  fill: '#d00',
  stroke: 'none'
};

function Pin({onClick}) {
  return (
    <div onClick={onClick}>
      <img src={marker} onClick={onClick}  style={pinStyle} alt="popup"/>
    </div>
  );
}

export default React.memo(Pin);