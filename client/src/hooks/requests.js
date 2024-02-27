const API_URL = "http://localhost:8000";

function httpGetPlanets() {
  return fetch(`${API_URL}/planets`).then((res) => res.json());
}

function httpGetLaunches() {
  return fetch(`${API_URL}/launches`)
    .then((res) => res.json())
    .then((json) => json.sort((a, b) => a.flightNumber - b.flightNumber));
}

function httpSubmitLaunch(launch) {
  return fetch(`${API_URL}/launches`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(launch),
  }).catch((err) => ({ ok: false }));
}

function httpAbortLaunch(id) {
  return fetch(`${API_URL}/launches/${id}`, { method: "delete" }).catch(
    (err) => ({ ok: false })
  );
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
