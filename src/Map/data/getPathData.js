import Lilydale from './1033.T5.2-LIL-C-mjp-1.35.R.json';
import Belgrave from './232.T2.2-BEL-B-mjp-1.25.R.json';
import Glen_Waverley from './24.UT.2-GLW-F-mjp-1.4.H.json';
import Alamein from './9568.T5.2-ALM-C-mjp-1.2.H.json';
import Pakenam from './96.UT.2-PKM-G-mjp-1.14.R.json';
import Cranbourne from './4821.T5.2-CRB-F-mjp-1.2.H.json';
import Mernda from './6256.T5.2-MER-C-mjp-1.9.R.json';
import Hurstbridge from './8418.T2.2-HBG-B-mjp-1.15.R.json';
import Sunbury from './85.UT.2-SYM-G-mjp-1.17.R.json';
import Craigieburn from './3988.T5.2-B31-D-mjp-1.12.R.json';
import Upfield from './3989.T2.2-UFD-G-mjp-1.2.H.json';
import Frankston from './1973.T5.2-FKN-F-mjp-1.12.R.json';
import Werribee from './2.UT.2-WBE-L-mjp-1.7.H.json';
import Williamstown from './3242.UQ.2-WMN-K-mjp-1.1.H.json';
import Sandringham from './1952.T5.2-SDM-E-mjp-1.2.R.json';


const line_file = {
  'Lilydale': Lilydale,
  'Belgrave': Belgrave,//
  'Glen Waverley': Glen_Waverley, //
  'Alamein': Alamein, //
  Pakenam: Pakenam, //
  Cranbourne: Cranbourne,
  Mernda: Mernda,
  Hurstbridge: Hurstbridge, //
  Sunbury: Sunbury,
  Craigieburn: Craigieburn, //
  Upfield: Upfield,
  Frankston: Frankston,
  Werribee: Werribee,
  Williamstown:Williamstown,
  Sandringham:Sandringham,
};

const lines = {
  Lilydale: '1033.T5.2-LIL-C-mjp-1.35.R',
  Belgrave: '1.T2.2-BEL-E-mjp-1.20.R',//
  'Glen Waverley': '1145.T0.2-GLW-G-mjp-1.7.R', //
  Alamein: '1374.T0.2-ALM-H-mjp-1.2.H', //
  Pakenam: '1.T5.2-PKM-D-mjp-1.4.H', //
  Cranbourne: '4821.T5.2-CRB-F-mjp-1.2.H',
  Mernda: '6256.T5.2-MER-C-mjp-1.9.R',
  Hurstbridge: '14.T6.2-HBG-E-mjp-1.20.R', //
  Sunbury: '85.UT.2-SYM-G-mjp-1.17.R',
  Craigieburn: '140.UR.2-B31-F-mjp-1.6.H', //
  Upfield: '3989.T2.2-UFD-G-mjp-1.2.H',
  Frankston: '1973.T5.2-FKN-F-mjp-1.12.R',
  Werribee: '2.UT.2-WBE-L-mjp-1.7.H',
  Williamstown: '3242.UQ.2-WMN-K-mjp-1.1.H',
  Sandringham: '1952.T5.2-SDM-E-mjp-1.2.R',
};

export const colours = {
  Lilydale: [21, 44, 107],
  LIL: [21, 44, 107],
  Belgrave: [21, 44, 107],
  BEL: [21, 44, 107],
  'Glen Waverley': [21, 44, 107],
  GLW: [21, 44, 107],
  Alamein: [21, 44, 107],
  ALM: [21, 44, 107],
  Pakenam: [39, 159, 213],
  PKM: [39, 159, 213],
  Cranbourne: [39, 159, 213],
  CRB: [39,159, 213],
  Mernda: [190, 16, 20],
  MER: [190, 16, 20],
  Hurstbridge: [190, 16, 20],
  HBG: [190, 16, 20],
  Sunbury: [255, 190, 0],
  SYM: [255, 190, 0],
  Craigieburn: [255, 190, 0],
  B31: [255, 190, 0],
  Upfield: [255, 190, 0],
  UFD: [255, 190, 0],
  Frankston: [2, 132, 48],
  FKN: [2, 132, 48],
  Werribee: [2, 132, 48],
  WBE: [2, 132, 48],
  Williamstown: [2, 132, 48],
  WMN: [2, 132, 48],
  Sandringham: [241, 120, 175],
  SDM: [241, 120, 175],
};

/* DEPRECATED, NOT SURE IF NEEDED
export default async function getPathData() {
  let pathData = [];
  const data = await Promise.all(
    Object.entries(lines).map(async ([name, id]) => {
      const data = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/shape/${id}`
      );
      const json = await data.json();
      pathData.push({
        path: json.shape_file,
        name: name,
        color: colours[name],
      });
    })
  ).then(() => pathData);


  return data;
}*/

export default async function getPathData() {
  let pathData = [];
  const data = await Promise.all(
    Object.entries(line_file).map(async ([name, shape_json]) => {
      pathData.push({
        path: shape_json.shape_file,
        name: name,
        color: colours[name],
      });
    })
  ).then(() => pathData);


  return data;
}
