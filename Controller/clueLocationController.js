import { ClueLocation } from '../Model/clueLocationModel.js';

const createClueLocation = async (req, res, next) => {
  try {
    const { locationName, coordinates, address, description } = req.body;
    const clueLocation = await ClueLocation.create({
      locationName,
      coordinates,
      address,
      description,
    });
    res.status(201).json({
      status: 'success',
      data: {
        clueLocation,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllClueLocations = async (req, res, next) => {
  try {
    const clueLocations = await ClueLocation.find();
    res.status(200).json({
      status: 'success',
      data: {
        clueLocations,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getClueLocation = async (req, res, next) => {
  try {
    const clueLocationId = req.params.id;
    const clueLocation = await ClueLocation.findById(clueLocationId);
    if (!clueLocation) {
      const err = new Error(`Clue Location with ID ${clueLocationId} not found`);
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
    next(error);
  }
};

const updateClueLocation = async (req, res, next) => {
  try {
    const clueLocationId = req.params.id;
    const updatedData = req.body;
    const clueLocation = await ClueLocation.findByIdAndUpdate(
      clueLocationId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!clueLocation) {
      const err = new Error(`Clue Location with ID ${clueLocationId} not found`);
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
    next(error);
  }
};

const deleteClueLocation = async (req, res, next) => {
  try {
    const clueLocationId = req.params.id;
    const clueLocation = await ClueLocation.findByIdAndDelete(clueLocationId);
    if (!clueLocation) {
      const err = new Error(`Clue Location with ID ${clueLocationId} not found`);
      err.statusCode = 404;
      throw err;
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createClueLocation,
  getAllClueLocations,
  getClueLocation,
  updateClueLocation,
  deleteClueLocation,
};
