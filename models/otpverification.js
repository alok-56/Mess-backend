const mongoose = require("mongoose");

const otpschma = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const otpmodel = mongoose.model("otp", otpschma);
module.exports = otpmodel;
