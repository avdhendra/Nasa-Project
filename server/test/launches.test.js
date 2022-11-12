const request = require("supertest");
const app = require("../src/app");
const { loadPlanetsData } = require("../src/models/planets.model");
const { mongoConnect,mongoDisconnect } = require("../src/services/mongo");
describe("Launch API", () => {

  

beforeAll(async ()=>{
  await mongoConnect()
  await loadPlanetsData()
})

afterAll(async()=>{
    await mongoDisconnect()
})



  describe("TEST GET/Launches", () => {
    it("It Should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/).expect(200);
    });
  });

  describe("TEST POST/Launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4,2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    
    };

    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "zoot",
    };
    it("It Should respond with 201 created", async () => {
      const response = await  request(app).post("/v1/launches")
        .send(
          completeLaunchData,
        )
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject( launchDataWithoutDate );
    });

    it("It should catch missing required porperties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required Launch properties",
      });
    });

    it("it should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid Launch Date",
      });
    });
  });
});
