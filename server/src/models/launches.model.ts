import { Launch } from "./dtos/launch.type";
import launches from "./launches.mongo";
import planets from "./planets.mongo";

const DEFAULT_FLIGHT_NUMBER = 0;

const launch = {
  flightNumber: 0,
  customer: ["Nasa", "ZTM"],
  target: "Earth",
  launchDate: new Date(),
  mission: "XYZ",
  rocket: "Falcon heavy",
  succes: true,
  upcoming: true,
};

saveLaunch(launch);

export async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch: Launch) {
  if (await checkPlanetExists(launch)) {
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

async function checkPlanetExists(launch: Launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  return !!planet;
}

export async function scheduleNewLaunch(
  launch: Omit<Launch, "flightNumber" | "customer" | "success" | "upcoming">
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

async function getLatestLaunchNumber() {
  return await launches
    .findOne({}, { flightNumber: 1 })
    .sort("-flightNumber")
    .then((launch) => launch?.flightNumber ?? DEFAULT_FLIGHT_NUMBER);
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
