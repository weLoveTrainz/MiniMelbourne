import getTrainLine from '../../Train/TrainData/GetTrainLine';

async function getData() {
  const data = await fetch(
    `${process.env.REACT_APP_BACKEND_API_URL}/est_realtime`
  );
  const json = await data.json();
  return json;
}

export default async function getTripData() {
  // get the trip ids from the path data
  let liveData = await getData();
  // console.log(liveData)
  const tripIds = [];
  const returnData = [];

  for (let i = 0; i < liveData.services.length; i++) {
    tripIds.push(liveData.services[i].trip_id);
  }

  await Promise.all(
    tripIds.map(async (id) => {
      const data = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/next_station/${id}`
      );
      const trainNameData = await getTrainLine(id);
      const json = await data.json();
      returnData.push({
        tripId: id,
        trainName: trainNameData.line_name,
        data: json,
      });
    })
  ).then((data) => returnData);
  return returnData;
}
