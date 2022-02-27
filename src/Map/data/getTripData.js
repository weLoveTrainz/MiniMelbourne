async function getData() {
    const data = await fetch(`http://118.139.86.189:8080/est_realtime`);
    const json = await data.json();
    return json;
  }
  
  export default async function getTripData() {
      // get the trip ids from the path data
      let liveData = await getData();
      // console.log(liveData)
      const tripIds = []
      const returnData = []
      
      for (let i = 0; i < liveData.services.length; i ++) {
          tripIds.push(liveData.services[i].trip_id);
      }
  
      const data = await Promise.all(
          tripIds.map(async (id) => {
          const data = await fetch(`http://118.139.86.189:8080/next_station/${id}`);
          const json = await data.json();
          returnData.push({
            tripId: id, 
            data: json
          });
        })
      ).then((data) => returnData);
      return returnData;
    }
    