export default async function getNextStation(trip_id) {
  const data = await fetch(`http://118.139.86.189:8080/next_station/${trip_id}`);
  const json = await data.json();
  return json;
}
