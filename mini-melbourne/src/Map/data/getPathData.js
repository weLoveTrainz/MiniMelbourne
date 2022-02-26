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

const colours = {
  Lilydale: [21, 44, 107],
  Belgrave: [21, 44, 107],
  'Glen Waverley': [21, 44, 107],
  Alamein: [21, 44, 107],
  Pakenam: [39, 159, 213],
  Cranbourne: [39, 159, 213],
  Mernda: [190, 16, 20],
  Hurstbridge: [190, 16, 20],
  Sunbury: [255, 190, 0],
  Craigieburn: [255, 190, 0],
  Upfield: [255, 190, 0],
  Frankston: [2, 132, 48],
  Werribee: [2, 132, 48],
  Williamstown: [2, 132, 48],
  Sandringham: [241, 120, 175],
};

export default async function getPathData() {
  let pathData = [];
  const data = await Promise.all(
    Object.entries(lines).map(async ([name, id]) => {
      const data = await fetch(`http://118.139.86.189:8080/shape/${id}`);
      const json = await data.json();
      pathData.push({
        path: json.shape_file,
        name: name,
        color: colours[name],
      });
    })
  ).then(() => pathData);
  return data;
}
