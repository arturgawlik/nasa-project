import { join } from "node:path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import planetsRouter from "./routes/planets";
import { launchesRouter } from "./routes/launches/launches.router";

const app = express();

app.use(morgan("combined"));
app.use(
  cors({
    origin: "http://localhost:8000",
  })
);
app.use(express.json());

app.use(express.static(join(__dirname, "..", "public")));

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "..", "public", "index.html"));
});

export { app };
