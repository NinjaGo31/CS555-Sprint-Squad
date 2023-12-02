import { scavengerModel } from '../Model/scavengerModel.js';

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

const getClueLocations = async (req, res, next) => {
  try {
    const scavengerId = req.params.id;
    const hunt = await scavengerModel.findById(scavengerId);

    if (!hunt) {
      handleNotFound(scavengerId);
    }

    const clueLocations = hunt.scavengerStops;
    res.status(200).json({
      status: 'success',
      data: {
        clueLocations,
      },
    });
  } catch (error) {
    const err = error;
    if (err.kind === 'ObjectId') {
      handleInvalidId(scavengerId);
    }
    next(err);
  }
};

const getClueLocation = async (req, res, next) => {
  try {
    const { id, locationId } = req.params;
    const hunt = await scavengerModel.findById(id);

    if (!hunt) {
      handleNotFound(id);
    }

    const clueLocation = hunt.scavengerStops.id(locationId);

    if (!clueLocation) {
      const err = new Error(`Clue Location with ID ${locationId} not found`);
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      status: 'success',
      data: {
        clueLocation,
      },
    });
  } catch (error) {
    const err = error;
    if (err.kind === 'ObjectId') {
      handleInvalidId(id);
    }
    next(err);
  }
};

const createClueLocation = async (req, res, next) => {
  const scavengerId = req.params.id;
  try {
    const hunt = await scavengerModel.findById(scavengerId);

    if (!hunt) {
      handleNotFound(scavengerId);
    }

    const newClueLocation = req.body;
    hunt.scavengerStops.push(newClueLocation);
    await hunt.save();

    res.status(201).json({
      status: 'success',
      data: {
        clueLocation: newClueLocation,
      },
    });
  } catch (error) {
    const err = error;
    if (err.kind === 'ObjectId') {
      handleInvalidId(scavengerId);
    }
    next(err);
  }
};

const updateClueLocation = async (req, res, next) => {
  const { id, locationId } = req.params;
  try {
    const hunt = await scavengerModel.findById(id);

    if (!hunt) {
      handleNotFound(id);
    }

    const updatedData = req.body;
    const clueLocation = hunt.scavengerStops.id(locationId);

    if (!clueLocation) {
      const err = new Error(`Clue Location with ID ${locationId} not found`);
      err.statusCode = 404;
      throw err;
    }

    Object.assign(clueLocation, updatedData);
    await hunt.save();

    res.status(200).json({
      status: 'success',
      data: {
        clueLocation,
      },
    });
  } catch (error) {
    const err = error;
    if (err.kind === 'ObjectId') {
      handleInvalidId(id);
    }
    next(err);
  }
};

const deleteClueLocation = async (req, res, next) => {
  const { id, locationId } = req.params;
  try {
    const hunt = await scavengerModel.findById(id);

    if (!hunt) {
      handleNotFound(id);
    }

    const clueLocation = hunt.scavengerStops.id(locationId);

    if (!clueLocation) {
      const err = new Error(`Clue Location with ID ${locationId} not found`);
      err.statusCode = 404;
      throw err;
    }

    clueLocation.remove();
    await hunt.save();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    const err = error;
    if (err.kind === 'ObjectId') {
      handleInvalidId(id);
    }
    next(err);
  }
};

export {
  getClueLocations,
  getClueLocation,
  createClueLocation,
  updateClueLocation,
  deleteClueLocation,
};