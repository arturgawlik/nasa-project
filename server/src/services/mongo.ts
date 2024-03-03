import { connect, connection, disconnect } from "mongoose";

const MONGO_URL =
  "mongodb+srv://nasa-api:Z5VRt7czFfVb0v16@nasacluster.gqw3fih.mongodb.net/nasa?retryWrites=true&w=majority";

connection.once("open", () => console.log("MongoDB connection ready! "));
connection.on("error", (err) => console.error(err));

export async function mongoConnect(uri?: string) {
  const connection = await connect(uri ?? MONGO_URL, {});
  return connection;
}

export function mongoDisconnect() {
  return disconnect();
}
