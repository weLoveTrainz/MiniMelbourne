import Lilydale from './1033.T5.2-LIL-C-mjp-1.35.R.json';
import Belgrave from './232.T2.2-BEL-B-mjp-1.25.R.json';
import Glen_Waverley from './24.UT.2-GLW-F-mjp-1.4.H.json';
import Alamein from './9568.T5.2-ALM-C-mjp-1.2.H.json';
import Pakenam from './96.UT.2-PKM-G-mjp-1.14.R.json';
import Cranbourne from './4821.T5.2-CRB-F-mjp-1.2.H.json';
import Mernda from './6256.T5.2-MER-C-mjp-1.9.R.json';
import Hurstbridge from './8418.T2.2-HBG-B-mjp-1.15.R.json';
import Sunbury from './85.UT.2-SYM-G-mjp-1.17.R.json';
import Cragieburn from './4821.T5.2-CRB-F-mjp-1.2.H.json';
import Upfield from './3989.T2.2-UFD-G-mjp-1.2.H.json';
import Frankston from './1973.T5.2-FKN-F-mjp-1.12.R.json';
import Werribee from './2.UT.2-WBE-L-mjp-1.7.H.json';
import Williamstown from './3242.UQ.2-WMN-K-mjp-1.1.H.json';
import Sandringham from './1952.T5.2-SDM-E-mjp-1.2.R.json';

const lines = {
  Lilydale: '1033.T5.2-LIL-C-mjp-1.35.R',
  Belgrave: '232.T2.2-BEL-B-mjp-1.25.R',
  'Glen Waverley': '24.UT.2-GLW-F-mjp-1.4.H',
  Alamein: '9568.T5.2-ALM-C-mjp-1.2.H',
  Pakenam: '96.UT.2-PKM-G-mjp-1.14.R',
  Cranbourne: '4821.T5.2-CRB-F-mjp-1.2.H',
  Mernda: '6256.T5.2-MER-C-mjp-1.9.R',
  Hurstbridge: '8418.T2.2-HBG-B-mjp-1.15.R',
  Sunbury: '85.UT.2-SYM-G-mjp-1.17.R',
  Craigieburn: '3988.T5.2-B31-D-mjp-1.12.R',
  Upfield: '3989.T2.2-UFD-G-mjp-1.2.H',
  Frankston: '1973.T5.2-FKN-F-mjp-1.12.R',
  Werribee: '2.UT.2-WBE-L-mjp-1.7.H',
  Williamstown: '3242.UQ.2-WMN-K-mjp-1.1.H',
  Sandringham: '1952.T5.2-SDM-E-mjp-1.2.R',
};

export const tripIdToLine = Object.fromEntries(
  Object.entries(lines).map((a) => a.reverse())
);

export const tripToLine = (trip_id) => {
  // Given tripid-> line + direction, direction may be wrong
  var splitted = trip_id.split("."); 
  var line = splitted[2].split("-")[1];
  var dir = splitted.at(-1)=="R" ? "(To City)" : "(From City)";


  switch (line) { // Check by
    case "LIL":
      return `Lilydale ${dir}`;
    case "BEL":
      return `Belgrave ${dir}`;
    case "GLW":
      return `Glen Waverley ${dir}`;
    case "ALM":
      return `Alamein ${dir}`;
    case "PKM":
      return `Pakenham ${dir}`;
    case "CRB":
      return `Cranbourne ${dir}`;
    case "MER":
      return `Mernda ${dir}`;
    case "HBG":
      return `Hurstbridge ${dir}`;
    case "SYM":
      return `SYM ${dir}`;
    case "B31":
      return `Craigieburn ${dir}`;
    case "UFD":
      return `Upfield ${dir}`;
    case "FKN":
      return `Frankston ${dir}`;
    case "WBE":
      return `Werribee ${dir}`;
    case "WMN":
      return `Williamstown ${dir}`;
    case "SDM":
      return `Sandringham ${dir}`;
  }
}

export const trip_ids = [
  '1033.T5.2-LIL-C-mjp-1.35.R',
  '232.T2.2-BEL-B-mjp-1.25.R',
  '24.UT.2-GLW-F-mjp-1.4.H',
  '9568.T5.2-ALM-C-mjp-1.2.H',
  '96.UT.2-PKM-G-mjp-1.14.R',
  '4821.T5.2-CRB-F-mjp-1.2.H',
  '6256.T5.2-MER-C-mjp-1.9.R',
  '8418.T2.2-HBG-B-mjp-1.15.R',
  '85.UT.2-SYM-G-mjp-1.17.R',
  '3988.T5.2-B31-D-mjp-1.12.R',
  '3989.T2.2-UFD-G-mjp-1.2.H',
  '1973.T5.2-FKN-F-mjp-1.12.R',
  '2.UT.2-WBE-L-mjp-1.7.H',
  '3242.UQ.2-WMN-K-mjp-1.1.H',
  '1952.T5.2-SDM-E-mjp-1.2.R',
];

// Minutes

export const getPathPointByTripId = (trip_id, counter) => {
  // const arrayLength = 100;
  console.log(counter);
  const arrayLength = getPathFromTripId(trip_id)['shape_file'].length;
  const currTime = get24HourTimeInSeconds();
  console.log(currTime);
  // console.log(currTime, 'currtime');
  // console.log(arrayLength, 'arraylength');

  // const time = ((tripTime % currTime) * arrayLength) / (tripTime * 60);
  // console.log(time, 'time');
  // const index = counter % arrayLength
  const index = Math.floor(currTime) % arrayLength;

  // const index = Math.floor();
  const coords = getPathFromTripId(trip_id)['shape_file'][index];
  console.log({ trip_id: trip_id, index });
  return coords;
};

// map from time -> an indexd
// time % length of list
// length of list % ()
// time = current time
// time + 1
// c = current datetime
//
//

const get24HourTimeInSeconds = () => {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const diff = now.getTime() - midnight.getTime();
  console.log(diff, 'diff');
  return diff / 500;
};

const getPathFromTripId = (trip_id) => {
  switch (trip_id) {
    case '1033.T5.2-LIL-C-mjp-1.35.R':
      return Lilydale;
    case '232.T2.2-BEL-B-mjp-1.25.R':
      return Belgrave;
    case '24.UT.2-GLW-F-mjp-1.4.H':
      return Glen_Waverley;
    case '9568.T5.2-ALM-C-mjp-1.2.H':
      return Alamein;
    case '96.UT.2-PKM-G-mjp-1.14.R':
      return Pakenam;
    case '4821.T5.2-CRB-F-mjp-1.2.H':
      return Cranbourne;
    case '6256.T5.2-MER-C-mjp-1.9.R':
      return Mernda;
    case '8418.T2.2-HBG-B-mjp-1.15.R':
      return Hurstbridge;
    case '85.UT.2-SYM-G-mjp-1.17.R':
      return Sunbury;
    case '3988.T5.2-B31-D-mjp-1.12.R':
      return Cragieburn;
    case '3989.T2.2-UFD-G-mjp-1.2.H':
      return Upfield;
    case '1973.T5.2-FKN-F-mjp-1.12.R':
      return Frankston;
    case '2.UT.2-WBE-L-mjp-1.7.H':
      return Werribee;
    case '3242.UQ.2-WMN-K-mjp-1.1.H':
      return Williamstown;
    case '1952.T5.2-SDM-E-mjp-1.2.R':
      return Sandringham;
    default:
      return Glen_Waverley;
  }
};
