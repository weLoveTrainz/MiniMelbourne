export default async function getTrainLine(trip_id) {
    const data = await fetch(`http://118.139.86.189:8080/train_line/${trip_id}`);
    const json = await data.json();
    return json;
}
  