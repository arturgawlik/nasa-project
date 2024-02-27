import { Schema, model } from "mongoose";

const launchesSchema = new Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customer: {
    type: [String],
    required: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  succes: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export default model("Launch", launchesSchema);
