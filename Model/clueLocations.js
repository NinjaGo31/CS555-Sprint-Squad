import mongoose from "mongoose";

const clueLocationSchema = new mongoose.Schema({
  locationName: {
    type: String,
    trim: true,
    required: [true, "A clue location must have a name"],
    unique: true,
  },
  coordinates: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
});

const ClueLocation = mongoose.model("ClueLocation", clueLocationSchema);

export { ClueLocation };