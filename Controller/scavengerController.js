import { scavengerModel } from "../Model/scavengerModel.js";
async function getAllScavenger(req, res, next) {
  try {
    const hunts = await scavengerModel.find();
    res.status(200).json({
      status: "success",
      data: {
        hunts,
      },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function getScavenger(req, res, next) {
  try {
    const scavengerId = req.params.id;
    const hunt = await scavengerModel.findById(scavengerId);

    if (!hunt) {
      const err = new Error(`Scavenger hunt with ID ${scavengerId} not found`);
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      status: "success",
      data: {
        hunt,
      },
    });
  } catch (error) {
    const err = error;
    if (err.kind === "ObjectId") {
      err.statusCode = 400;
      err.message = `Invalid ID format: ${scavengerId}`;
    }
    next(err);
  }
}

async function updateScavenger(req, res, next) {
  try {
    const scavengerId = req.params.id;
    const updatedData = req.body;

    const hunt = await scavengerModel.findByIdAndUpdate(
      scavengerId,
      updatedData,
      {
        new: true, // Return the modified document rather than the original
        runValidators: true, // Run model validators on update
      }
    );

    if (!hunt) {
      const err = new Error(`Scavenger hunt with ID ${scavengerId} not found`);
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      status: "success",
      data: {
        hunt,
      },
    });
  } catch (error) {
    const err = error;
    if (err.kind === "ObjectId") {
      err.statusCode = 400;
      err.message = `Invalid ID format: ${scavengerId}`;
    }
    next(err);
  }
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
  try {
    const scavengerId = req.params.id;
    const hunt = await scavengerModel.findByIdAndDelete(scavengerId);

    if (!hunt) {
      const err = new Error(`Scavenger hunt with ID ${scavengerId} not found`);
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    const err = error;
    if (err.kind === "ObjectId") {
      err.statusCode = 400;
      err.message = `Invalid ID format: ${scavengerId}`;
    }
    next(err);
  }
}
export {
  getAllScavenger,
  getScavenger,
  updateScavenger,
  deleteScavenger,
  createScavenger,
};
