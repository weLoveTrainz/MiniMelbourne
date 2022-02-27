export default async function getTrainLine(trip_id) {
  const data = await fetch(
    `${process.env.REACT_APP_BACKEND_API_URL}/train_line/${trip_id}`
  );
  const json = await data.json();
  return json;
}
