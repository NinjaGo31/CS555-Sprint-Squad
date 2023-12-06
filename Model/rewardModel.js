//This is the reward Model file

// Importing mongoose 

import mongoose from "mongoose";


const rewardSchema = new mongoose.Schema({

  name: {

    type: String,

    required: [true, "A reward must have a name"],

  },

  // Name for the reward
   
  points: {

    type: Number,

    required: [true, "A reward must have a point value"],

  },

  //Point value of the reward 

  description: {

    type: String,

    required: [true, "A reward must have a description"],

  },

  //description of the reward

});

const Reward = mongoose.model("Reward", rewardSchema);

export { Reward };