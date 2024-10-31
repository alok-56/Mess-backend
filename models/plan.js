const mongoose = require("mongoose");

const Planscheme = new mongoose.Schema(
  {
    planname: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    breakfastprice: {
      type: Number,
      required: true,
    },
    lunchPrice: {
      type: Number,
      required: true,
    },
    dinnerprice: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const planmodal = mongoose.model("plan", Planscheme);
module.exports = planmodal;
