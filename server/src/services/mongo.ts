import { connect, connection, disconnect } from "mongoose";

const MONGO_URL =
  "mongodb+srv://nasa-api:Z5VRt7czFfVb0v16@nasacluster.gqw3fih.mongodb.net/nasa?retryWrites=true&w=majority";

connection.once("open", () => console.log("MongoDB connection ready! "));
connection.on("error", (err) => console.error(err));

export function mongoConnect() {
  return connect(MONGO_URL, {});
}

export function mongoDisconnect() {
  return disconnect();
}
