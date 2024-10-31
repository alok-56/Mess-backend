const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coords: {
      lat: {
        type: String,
        required: true,
      },
      lon: {
        type: String,
        required: true,
      },
    },
    deliverydistance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const locationmodal = mongoose.model("location", locationSchema);
module.exports = locationmodal;
