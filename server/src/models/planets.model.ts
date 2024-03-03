import planets, { IPlanet, IPlanetCSV } from "./planets.mongo";
import { createReadStream } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { parse } from "csv-parse";

export async function preparePlanets() {
  const fileReadStream = createReadStream(
    join(__dirname, "..", "..", "data", "kepler_data.csv")
  );
  const parser = parse({
    comment: "#",
    columns: true,
  });

  await pipeline(fileReadStream, parser, filterHabidable, consumeUniqPlanets);
}

export function getAllPlanets() {
  return planets
    .find(
      {},
      {
        __v: 0,
        _id: 0,
      }
    )
    .exec()
    .then((planets) => planets.map((p) => p.toObject()));
}

export function savePlanet(planet: IPlanet) {
  return planets.updateOne({ keplerName: planet.keplerName }, planet, {
    upsert: true,
  });
}

async function consumeUniqPlanets(source: AsyncIterable<IPlanetCSV>) {
  for await (const planet of source) {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  }
}

async function* filterHabidable(source: AsyncIterable<any>) {
  for await (const chunk of source) {
    const planet = chunk as IPlanetCSV;
    if (isHabidablePlanet(planet)) {
      yield planet;
    }
  }
}

function isHabidablePlanet(planet: IPlanetCSV) {
  return (
    planet.koi_disposition === "CONFIRMED" &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  );
}
