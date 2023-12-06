import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A reward must have a name"],
  },
  points: {
    type: Number,
    required: [true, "A reward must have a point value"],
  },
  description: {
    type: String,
    required: [true, "A reward must have a description"],
  },
});

const Reward = mongoose.model("Reward", rewardSchema);

export { Reward };