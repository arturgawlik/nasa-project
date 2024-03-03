import { Request, Response } from "express";
import {
  getAllLaunches,
  scheduleNewLaunch,
  getLaunchById,
  abordLaunch,
} from "../../models";
import { ILaunch } from "../../models/launches.mongo";

export async function httpGetAllLaunches(req: Request, res: Response) {
  return res.status(200).json(await getAllLaunches());
}

export async function httpAddNewLaunch(req: Request, res: Response) {
  const launch: ILaunch = req.body;

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

  try {
    await scheduleNewLaunch(launch);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(400).json({ error: "Unknown error" });
    }
  }
  return res.status(201).json(launch);
}

export async function httpDeleteLaunch(req: Request, res: Response) {
  const launchId = Number(req.params.id);
  if (Number.isNaN(launchId)) {
    return res.status(400).json({ error: "Invalid launch id" });
  }

  const launch = await getLaunchById(launchId);

  if (!launch) {
    return res
      .status(404)
      .json({ error: `No launch found with Id ${launchId}` });
  }

  const aborded = await abordLaunch(launchId);
  if (!aborded) {
    return res.status(400).json({ error: "Launch not aborded" });
  }
  return res.status(200).json({ ok: true });
}
