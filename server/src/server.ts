import { createServer } from "node:http";
import { connect, connection } from "mongoose";
import { app } from "./app";
import { preparePlanets } from "./models/planets.model";

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  "mongodb+srv://nasa-api:Z5VRt7czFfVb0v16@nasacluster.gqw3fih.mongodb.net/nasa?retryWrites=true&w=majority";

connection.once("open", () => console.log("MongoDB connection ready! "));
connection.on("error", (err) => console.error(err));

async function startServer() {
  await connect(MONGO_URL);
  await preparePlanets();

  const server = createServer(app);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
}

startServer();
