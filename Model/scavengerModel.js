import mongoose from "mongoose";
const scavengerSchema = new mongoose.Schema({
  scavengerName: {
    type: String,
    trim: true,
    required: [true, "A scavenger must have a name"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "A scavenger must have a description"],
  },
  startLocation: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  scavengerStops: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
  ],
});
const scavengerModel = mongoose.model("ScavengerHunt", scavengerSchema);
export { scavengerModel };
