import request from "supertest";
import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from "@testcontainers/mongodb";
import { app } from "../../app";
import { mongoConnect, mongoDisconnect } from "../../services/mongo";

describe("Launches API", () => {
  let mongoContainer: StartedMongoDBContainer | undefined;

  beforeAll(async () => {
    mongoContainer = await new MongoDBContainer().start();
    await mongoConnect(
      mongoContainer.getConnectionString() + "/nasa?directConnection=true"
    );
  });

  afterAll(async () => {
    await mongoDisconnect();
    await mongoContainer?.stop();
  });

  describe("GET /launches", () => {
    it("should respond with 200 success", async () => {
      await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /launches", () => {
    const launch = {
      target: "Kepler-1410 b",
      launchDate: "January 17, 2033",
      mission: "Xuz",
      rocket: "super rocket",
    };

    const launchWithoutDate = {
      target: "Kepler-1410 b",
      mission: "Xuz",
      rocket: "super rocket",
    };

    const launchWithInvalidDate = {
      ...launchWithoutDate,
      launchDate: "not a date",
    };

    it("should respond with 201 created", async () => {
      const response = await request(app)
        .post("/launches")
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
        .post("/launches")
        .send(launchWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing property",
      });
    });

    it("should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });

  describe("DELETE /lanuches/:id", () => {
    it("should respond with 400 if id is not a number", async () => {
      await request(app).delete("/launches/not_an_number").expect(400);
    });

    it("should respond with 404 if launch does not exists", async () => {
      await request(app)
        .delete(`/launches/${Number.MAX_SAFE_INTEGER}`)
        .expect(404);
    });

    it("should respond with 200 if lanuch is deleted", async () => {
      await request(app).delete("/launches/1").expect(200);
    });
  });
});
