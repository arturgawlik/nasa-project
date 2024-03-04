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

export async function loadLaunchData() {
  const firstSpacexLaunch = await launches.findOne({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstSpacexLaunch) {
    return;
  }

  const spacexLaunches = await getSpacexLaunches();
}

function getSpacexLaunches() {
  return (
    fetch("https://api.spacexdata.com/v4/launches/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {},
        options: {
          pagination: false,
          populate: [
            {
              path: "rocket",
              select: {
                name: 1,
              },
            },
            {
              path: "payloads",
              select: {
                customers: 1,
              },
            },
          ],
        },
      }),
    })
      .then((v) => v.json())
      .then((v) => v.docs)
      .then((v) =>
        v.map((i: any) => ({
          flightNumber: i.flight_number,
          mission: i.name,
          rocket: i.rocket.name,
          launchDate: new Date(i.date_local),
          upcoming: i.upcoming,
          success: i.success,
          customers: i.payloads.flatMap((p: any) => p.customers),
        }))
      )
      // .then(console.log);
      .then((l) => {
        launches.insertMany(l);
      })
  );
}

export async function scheduleNewLaunch(
  launch: Omit<ILaunch, "flightNumber" | "customer" | "success" | "upcoming">
) {
  if (!(await checkPlanetExists(launch.target))) {
    throw new Error(`Planet with name ${launch.target} does not exist!`);
  }

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

async function checkPlanetExists(launchTarget: string) {
  const planet = await planets.findOne({ keplerName: launchTarget });
  return !!planet;
}

async function getLatestLaunchNumber() {
  return await launches
    .findOne({}, { flightNumber: 1 })
    .sort("-flightNumber")
    .then((launch) => launch?.flightNumber ?? DEFAULT_FLIGHT_NUMBER);
}
