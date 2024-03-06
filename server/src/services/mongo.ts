import { connect, connection, disconnect } from "mongoose";
import process from "node:process";

const MONGO_URL = process.env.MONGO_URL;

connection.on("error", (err) => console.error(err));

export async function mongoConnect(uri?: string) {
  const mongoUrl = uri ?? MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MongoDB URL not found");
  }

  const connection = await connect(mongoUrl, {});
  return connection;
}

export function mongoDisconnect() {
  return disconnect();
}

["SIGTERM", "SIGINT", "SIGUSR2"].forEach((type) => {
  process.once(type, async () => {
    try {
      await mongoDisconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
