import launches, { ILaunch } from "./launches.mongo";
import planets from "./planets.mongo";

const DEFAULT_FLIGHT_NUMBER = 0;

export async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

export function getLaunchById(id: number) {
  return launches.findOne({
    flightNumber: id,
  });
}

export async function abordLaunch(id: number) {
  const aborded = await launches.updateOne(
    { flightNumber: id },
    { upcoming: false, succes: false }
  );

  return aborded.modifiedCount === 1;
}

export async function scheduleNewLaunch(
  launch: Omit<ILaunch, "flightNumber" | "customer" | "success" | "upcoming">
) {
  const latestLaunchNumber = await getLatestLaunchNumber();
  const newLaunch = Object.assign(launch, {
    flightNumber: latestLaunchNumber + 1,
    customer: ["Zero to mastery", "NASA"],
    success: true,
    upcoming: true,
  });
  await saveLaunch(newLaunch);
}

async function saveLaunch(launch: ILaunch) {
  if (!(await checkPlanetExists(launch))) {
    throw new Error(`Planet with name ${launch.target} does not exist!`);
  }

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function checkPlanetExists(launch: ILaunch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  return !!planet;
}

async function getLatestLaunchNumber() {
  return await launches
    .findOne({}, { flightNumber: 1 })
    .sort("-flightNumber")
    .then((launch) => launch?.flightNumber ?? DEFAULT_FLIGHT_NUMBER);
}
