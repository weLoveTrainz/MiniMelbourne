export default async function getNextStation(trip_id) {
  const data = await fetch(
    `${process.env.REACT_APP_BACKEND_API_URL}/next_station/${trip_id}`
  );
  const json = await data.json();
  return json;
}
