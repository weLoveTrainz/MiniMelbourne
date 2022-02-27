export default async function getPathData() {
  try {
    const data = await fetch(
      `${process.env.REACT_APP_BACKEND_API_URL}/est_realtime`
    );
    const json = await data.json();
    return json;
  } catch (err) {
    return null;
  }
}
