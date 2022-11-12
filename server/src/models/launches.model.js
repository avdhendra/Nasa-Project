const axios=require('axios')

//const launches = new Map(); //here we dont use map because when you cluster the server it create copy in different process
//and our data is store in different -different process memory location so we can say our data is at one place so we need a database to set the data in once place and which is persist
const planets = require("./MongoSchema/planets.mongo");
const launchesDatabase = require("./MongoSchema/launches.mongo");
//these model file to act as the data  access layer that controles how data is read and updated while hiddinng the mongoose and mongoose related details
//const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

//we are getting real life data from different api(Space x)
// const launch = {
//   flightNumber: 100, //flight_number
//   mission: "Kepler Exploration X",//name
//   rocket: "Explorer IS1",//exists -->rocket.name
//   launchDate: new Date("December 27, 2030"),//date_local
//   target: "Kepler-442 b", //not applicable
//   customers: ["Space-X", "NASA"], //payload.customer
//   upcoming: true, //boolean if false it is history //upcoming
//   success: true, //boolean if false it is abort //success
// };
//launches.set(launch.flightNumber, launch);

//save the lauches in database
//saveLaunch(launch);


const SPACE_API_URL="https://api.spacexdata.com/v4/launches/query"

async function populateLaunches(){
  console.log('Downloading  launch Data. ...')
  const response= await axios.post(SPACE_API_URL,{
   query:{},
   options:{
     pagination:false, //as the api pagination is off the api send all data at once so it will be heavy for the server //minimize the api load the data
     populate:[{
       path:'rocket',
       select:{
         name:1
       }
     },{
       path:'payloads',
       select:{
         'customers':1
       }
     }]
   }
   })

if(!response){
  console.log('Problem downloading Launch')
  throw new Error('Launch data download failed')
}



   const launchDocs=response.data.docs
   for(const launchDoc of launchDocs){
     const payloads=launchDoc['payloads']
 const customers=payloads.flatMap((payload)=>{
   return payload['customers']
 })
 
     const launch={
       flightNumber:launchDoc['flight_number'],
       mission:launchDoc['name'],
       rocket:launchDoc['rocket']['name'],
       launchDate:launchDoc['date_local'],
       upcoming:launchDoc['upcoming'],
       success:launchDoc['success'],
       customers,
     }
 
     console.log(`${launch.flightNumber} ${launch.mission} `)
     await saveLaunch(launch)
   }


   //populate Launches Collection
   
}

async function loadLaunchData(){
  
  //check the data u want to fetch is already in database or not so that api load is low
  const firstLaunch=await findLaunch({
    flightNumber:1,
    rocket:'Falcon 1',
    mission:'FalconSat'
  })
  
  if(firstLaunch){
    console.log('Launch data is already in database')
  
  }else{
    await populateLaunches()
  }

  
  
  
 
}






async function getAllLaunches(skip,limit) {
  // return Array.from(launches.values());

  return await launchesDatabase.find(
    {},
    {
      __id: 0,
      __v: 0,
    }
  ).sort({flightNumber:-1}).skip(skip).limit(limit); //get all data

  //sort the data before paginating
  //skip the first 20 data and limit the upcoming data to 50
}

//get the latest flightNumber
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber"); //get the latestLaunch we done by sorting the the list in descending order by giving - sign
  //if there is no launch perform and want to give the initial flightnumber return the default flightNumber
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   //override the previous object props or create new props in object
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       flightNumber: latestFlightNumber,
//       upcoming: true, //boolean if false it is history
//       success: true, //boolean if false it is abort
//       customer: ["Space-X", "NASA"],
//     })
//   );
// }

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  }); //find all planet the match launch.target planet
  //in lower layer where we dont access of response we can throw the error
  if (!planet) {
    throw new Error("No Planet Found in the Universe");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    upcoming: true, //boolean if false it is history
    success: true, //boolean if false it is abort
    customers: ["Space-X", "NASA"],
  });
  await saveLaunch(newLaunch);
}

//save the lauch data in database
async function saveLaunch(launch) {
 
  //after throwing error next code not execute it just print in the console the erro
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber, // if flight number change then update it other wise insert it
    },
    launch,
    { upsert: true }
  );
}
async function findLaunch(filter){
  return await launchesDatabase.findOne(filter)
}
async function existsLaunchWithId(launchId) {
  // return launches.has(id);
  return await findLaunch({
    flightNumber: launchId,
  });
}
async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  ) ;
  return aborted;
}
module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  loadLaunchData,
  existsLaunchWithId,
  abortLaunchById,
};


/**
 * function duplicate(n){ 
 * return [n,n]
 * }
 * 
 * [1,2].flatMap(duplicate) ----> output: [1,1,2,2]
 * 
 * 
 */