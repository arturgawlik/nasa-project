import { createServer } from "node:http";

import { app } from "./app";
import { preparePlanets } from "./models/planets.model";
import { loadLaunchData } from "./models/launches.model";
import { mongoConnect as mongoConnect } from "./services/mongo";

const PORT = process.env.PORT || 8000;

async function startServer() {
  mongoConnect().catch(console.error);

  preparePlanets()
    .then(() => console.log("Planet data ready!"))
    .catch(console.error);

  loadLaunchData()
    .then(() => console.log("Launches data ready!"))
    .catch(console.error);

  const server = createServer(app);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
}

startServer();
