const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config(); //it populate the process.env object with the properties of the .env file object //alway populate in top of file because we want it to be in
const app = require("./src/app");
const { loadPlanetsData } = require("./src/models/planets.model");
const { loadLaunchData } = require("./src/models/launches.model");
const { mongoConnect } = require("./src/services/mongo");
const server = http.createServer(app);

const PORT = process.env.PORT || 8000; //if there is port given by environment other wise use the 8000
//enviroment mean the package.json file we set the port to 5000 in start script
//if remove that then we run in 8000

async function serverStart() {
  //Mongoose connection
  await mongoConnect();

  //we need connect the mongo before we start listening to the server so that we get all the data before we making any request
  await loadPlanetsData();

  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`listining on PORT ${PORT}...`);
  });
}
serverStart();

//running the server by node //not by nodemon
//so we npm start server in enviroment  of nasa project

//npm install dotenv
//then set the env value in it .env file
