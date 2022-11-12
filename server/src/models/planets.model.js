const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const planets = require("./MongoSchema/planets.mongo");
//const habitablePlanets=[]
function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitable(data)) {
          // habitablePlanets.push(data) not save in array
          //save the data in db // create a new document
          //As we create the document but here is some problem that server instance run server in different instance and create copy of data each time loadPlanetData() called in server.js
          //so we need a different function than create which is upsert =insert + update  it only insert data when the data is not present other wise it just update the data
          //TODO: replace below create with insert +update=upsert
          // await planets.create({keplerName:data.kepler_name})
          await savePlanets(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        // habitablePlanets.map((res)=>{
        //     console.log(res['kepler_name'])
        // })
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} is isHabitable planet`);
        resolve();
      });
  });
}
async function getAllPlanets() {
  //  return planets.find({}) it will return all the element in planets
  //return planets.find({keplerName:'Kepler-62 f'},{}) find all data that match will the keplerName and in second is projection(Filter) we can set the properties we need in that keplerName
  return await planets.find({},{
    '__id':0,'__v':0   //__v and __id is automatic generate in mongodb __v is version of schema we use we update it when we change the schema
    //we write 0 it both id and version because we need to exclude the version and id part from the db(fliter out)
  });
}
async function savePlanets(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name, //update the object if it does exist
      },
      {
        keplerName: planet.kepler_name, //if data is not exist it create the data // and if it does exist it just update that object
      },
      {
        upsert: true, 
      }
    );
  } catch (err) {
    console.log(`Could not Save Planet ${err}`);
  }
}
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};

//we get __v in data of planet which is version of schema we use