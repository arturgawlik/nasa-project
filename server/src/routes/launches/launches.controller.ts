import { Request, Response } from "express";
import {
  getAllLaunches,
  addNewLaunch,
  getLaunchById,
  abordLaunch,
} from "../../models";
import { Launch } from "../../models/dtos/launch.type";

function httpGetAllLaunches(req: Request, res: Response) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req: Request, res: Response) {
  const launch: Launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing property" });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(Number(launch.launchDate))) {
    return res.status(400).json({ error: "Invalid launch date" });
  }

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpDeleteLaunch(req: Request, res: Response) {
  const launchId = Number(req.params.id);
  const launch = getLaunchById(launchId);
  if (!launch) {
    res.status(404).json({ error: `No launch found with Id ${launchId}` });
  }

  abordLaunch(launchId);

  res.status(200).json(launch);
}

export { httpGetAllLaunches, httpAddNewLaunch, httpDeleteLaunch };
