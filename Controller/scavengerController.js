import { scavengerModel } from "../Model/scavengerModel.js";
async function getAllScavenger(req, res, next) {
  try {
    const users = await scavengerModel.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function getScavenger(req, res, next) {
  // to do
}

async function updateScavenger(req, res, next) {
  // to do
}
async function createScavenger(req, res, next) {
  try {
    const { scavengerName, description, startLocation, scavengerStops } =
      req.body;
    const hunt = await scavengerModel.create({
      scavengerName,
      description,
      startLocation,
      scavengerStops,
    });
    res.status(200).json({
      status: "success",
      data: {
        hunt,
      },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function deleteScavenger(req, res, next) {
  // to do
}
export {
  getAllScavenger,
  getScavenger,
  updateScavenger,
  deleteScavenger,
  createScavenger,
};
