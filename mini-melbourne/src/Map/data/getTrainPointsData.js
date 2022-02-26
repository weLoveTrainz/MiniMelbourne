export default async function getPathData() {
  const data = await fetch(`http://118.139.86.189:8080/est_realtime`);
  const json = await data.json();
  return json;
}
