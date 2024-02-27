import request from "supertest";
import { app } from "../../app";

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
    target: "Mars",
    launchDate: "January 17, 2033",
    mission: "Xuz",
    rocket: "super rocket",
  };

  const launchWithoutDate = {
    target: "Mars",
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
