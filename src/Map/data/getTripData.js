async function getData() {
  const data = await fetch(
    `${process.env.REACT_APP_BACKEND_API_URL}/realtime`
  );
  const json = await data.json();
  return json;
}

export default async function getTripData() {
  /*
  Retrieves the next station along with other information.
  ENDPOINT NOT FUNCTIONING AS INTENDED, TO BE FIXED?


  */
  let liveData = await getData();
  const tripIds = [];
  const returnData = [];

  for (let i = 0; i < liveData.services.length; i++) {
    tripIds.push(liveData.services[i].trip_id);
  }
  await Promise.all(
    tripIds.map(async (id) => {
      const data = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/next_station/${id}`
      ); // This also doesn't work
      
      //const trainNameData = await getTrainLine(id); // This gets called, doesn't work
      const json = await data.json();
      returnData.push({
        tripId: id,
        trainName: null,//trainNameData.line_name,
        data: json,
      })
      ;
    })
  ).then((data) => returnData);
  return returnData;
}
