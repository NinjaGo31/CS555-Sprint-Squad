import { scavengerModel } from "../Model/scavengerModel.js";

const handleNotFound = (scavengerId) => {
  const err = new Error(`Scavenger hunt with ID ${scavengerId} not found`);
  err.statusCode = 404;
  throw err;
};

const handleInvalidId = (scavengerId) => {
  const err = new Error(`Invalid ID format: ${scavengerId}`);
  err.statusCode = 400;
  throw err;
};

const getAllScavenger = async (req, res, next) => {
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
};

const getScavenger = async (req, res, next) => {
  try {
    const scavengerId = req.params.id;
    const hunt = await scavengerModel.findById(scavengerId);

    if (!hunt) {
      handleNotFound(scavengerId);
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
      handleInvalidId(scavengerId);
    }
    next(err);
  }
};

const updateScavenger = async (req, res, next) => {
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
      handleNotFound(scavengerId);
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
      handleInvalidId(scavengerId);
    }
    next(err);
  }
};

const createScavenger = async (req, res, next) => {
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
};

const deleteScavenger = async (req, res, next) => {
  try {
    const scavengerId = req.params.id;
    const hunt = await scavengerModel.findByIdAndDelete(scavengerId);

    if (!hunt) {
      handleNotFound(scavengerId);
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    const err = error;
    if (err.kind === "ObjectId") {
      handleInvalidId(scavengerId);
    }
    next(err);
  }
};

export {
  getAllScavenger,
  getScavenger,
  updateScavenger,
  deleteScavenger,
  createScavenger,
};
