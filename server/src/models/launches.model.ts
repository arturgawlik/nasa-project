import { Launch } from "./dtos/launch.type";
// import launches from "./launches.mongo";

const launches = new Map<number, Launch>();
let latestLaunchNumber = 100;

launches.set(1, {
  flightNumber: 1,
  customer: ["Nasa", "ZTM"],
  target: "Earth",
  launchDate: new Date(),
  mission: "XYZ",
  rocket: "Falcon heavy",
  succes: true,
  upcoming: true,
});

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(
  launch: Omit<Launch, "flightNumber" | "customer" | "success" | "upcoming">
) {
  latestLaunchNumber++;
  launches.set(
    latestLaunchNumber,
    Object.assign(launch, {
      flightNumber: latestLaunchNumber,
      customer: ["Zero to mastery", "NASA"],
      succes: true,
      upcoming: true,
    } as Launch)
  );
}

function getLaunchById(id: number) {
  return launches.get(id);
}

function abordLaunch(id: number) {
  const aborded = launches.get(id);
  if (!aborded) throw new Error(`No launch found with id ${id}`);

  aborded.upcoming = false;
  aborded.succes = false;

  return aborded;
}

export { getAllLaunches, addNewLaunch, getLaunchById, abordLaunch };
