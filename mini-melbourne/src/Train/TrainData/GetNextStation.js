export default async function getNextStation(trip_id) {
  const data = await fetch(`http://118.138.192.80:8080/next_station/${trip_id}`);
  const json = await data.json();
  return json;
}
