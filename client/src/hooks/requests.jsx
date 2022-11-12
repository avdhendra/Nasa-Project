import axios from 'axios';
const api = axios.create({
  baseURL: "http://localhost:8000/v1",
   headers: { 'Content-Type': 'application/json' }
})
async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const response = await api.get('/planets');
  return response.data
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.

  const response = await api.get('/launches')
  return response.data.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  })

}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
  return await api.post('/launches',launch)
  } catch(err) {
    return {
      ok:false
    }
}
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await api.delete(`/launches/${id}`)
  } catch (err) {
    console.log(err)
    return {
      ok:false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};