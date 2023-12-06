//this is the file related to reward system


// Importing the reward model from rewardModel.js

import { Reward as rewardModel } from "../Model/rewardModel.js";

// Get All Reward Functions

async function getAllRewards(req, res, next) {

  try {

    const rewards = await rewardModel.find();

    res.status(200).json({

      status: "success",

      results: rewards.length,

      data: { rewards },

    });

  } catch (error) {

    const err = error;

    err.statusCode = 404;

    next(err);

  }
}

// Get Reward for one Task

async function getReward(req, res, next) {

  try {

    const rewards = await rewardModel.findById(req.params.id);

    res.status(200).json({

      status: "success",

      results: rewards.length,

      data: { rewards },

    });

  } catch (error) {

    const err = error;

    err.statusCode = 404;

    next(err);

  }
}

// Update The Reward Function 

async function updateReward(req, res, next) {

  // to do
  try {

    const rewards = await rewardModel.findByIdAndUpdate(req.params.id, req.body, {

      new: true,

      runValidators: true,

    });

    res.status(200).json({

      status: "success",

      results: rewards.length,

      data: { rewards },

    });

  } catch (error) {

    const err = error;

    err.statusCode = 404;

    next(err);

  }
}

//Deleting the Reward Function 

async function deleteReward(req, res, next) {

  try {

    await rewardModel.findByIdAndDelete(req.params.id);

    res.status(204).json({

      status: "success",

      data: null,

    });

  } catch (error) {

    const err = error;

    err.statusCode = 404;

    next(err);

  }
}


export { getAllrewards, getReward, updateReward, deleteReward };