const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../models/launches.model");
const {getPagination}=require("../api_version/query")
async function httpGetAllLaunches(req, res) {
  /*
  http:localhost:8000/v1/launches?limit=50&page=3
  
  
  */
 const{skip,limit}=getPagination(req.query)
 const launches=await getAllLaunches(skip,limit)
  return res.status(200).json(launches); ///gave all the value in map and then convert it into the array
}
async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing required Launch properties" });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid Launch Date" });
  }

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  //if launch doesn;t exist
  // if (!existsLaunchWithId(launchId)) {
  //   return res.status(404).json({ error: "Lauch not Found" });
  // }

  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({ error: "Lauch not Found" });
  }

  const aborted = await abortLaunchById(launchId);
  if(!aborted) {
    console.log('put')
    return res.status(400).json({ error: "Launch Not Aborted"})
  }
  return res.status(200).json({ ok:true});
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
