import { Router } from "express";
import planetsRouter from "./planets/planets.router";
import { launchesRouter } from "./launches/launches.router";

export const api = Router();

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);
