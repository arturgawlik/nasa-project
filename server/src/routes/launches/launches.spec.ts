import request from "supertest";
import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from "@testcontainers/mongodb";

import { app } from "../../app";
import { mongoConnect, mongoDisconnect } from "../../services/mongo";
import { savePlanet } from "../../models";

describe("Launches API", () => {
  let mongoContainer: StartedMongoDBContainer | undefined;

  beforeAll(async () => {
    mongoContainer = await new MongoDBContainer().start();
    await mongoConnect(
      mongoContainer.getConnectionString() + "/nasa?directConnection=true"
    );
    await prepareDatabase();
  });

  afterAll(async () => {
    await mongoDisconnect();
    await mongoContainer?.stop();
  });

  describe("GET /launches", () => {
    it("should respond with 200 success", async () => {
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /launches", () => {
    const launch = {
      target: "Earth",
      launchDate: "January 17, 2033",
      mission: "Xuz",
      rocket: "super rocket",
    };

    const launchWithoutDate = {
      target: "Earth",
      mission: "Xuz",
      rocket: "super rocket",
    };

    const launchWithInvalidDate = {
      ...launchWithoutDate,
      launchDate: "not a date",
    };

    it("should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launch)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(launch.launchDate).toISOString();

      expect(response.body).toMatchObject({
        ...launchWithoutDate,
        launchDate: requestDate,
      });
    });

    it("should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing property",
      });
    });

    it("should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });

    it("should catch not existing planets", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          ...launch,
          target: "not a planet",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Planet with name not a planet does not exist!",
      });
    }, 120_000);
  });

  describe("DELETE /lanuches/:id", () => {
    it("should respond with 400 if id is not a number", async () => {
      await request(app).delete("/v1/launches/not_an_number").expect(400);
    });

    it("should respond with 404 if launch does not exists", async () => {
      await request(app)
        .delete(`/launches/${Number.MAX_SAFE_INTEGER}`)
        .expect(404);
    });

    it("should respond with 200 if lanuch is deleted", async () => {
      await request(app).delete("/v1/launches/1").expect(200);
    });
  });
});

async function prepareDatabase() {
  // init planets otherwise can't add any launch
  await savePlanet({ keplerName: "Earth" });
}
