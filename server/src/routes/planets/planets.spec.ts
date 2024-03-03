import request from "supertest";
import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from "@testcontainers/mongodb";
import { mongoConnect, mongoDisconnect } from "../../services/mongo";
import { app } from "../../app";

describe("Planets API", () => {
  let mongoContainer: StartedMongoDBContainer | undefined;

  beforeAll(async () => {
    mongoContainer = await new MongoDBContainer().start();
    mongoConnect(
      mongoContainer.getConnectionString() + "/nasa?directConnection=true"
    );
  });

  afterAll(async () => {
    mongoDisconnect();
    mongoContainer?.stop();
  });

  describe("GET /plannets", () => {
    it("should respond with 200 success", async () => {
      await request(app)
        .get("/v1/planets")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
