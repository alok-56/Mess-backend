const mongoose = require("mongoose");

const paymentcheme = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    transitionId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
    },
    remarks: {
      type: String,
      default: "subcription",
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const paymentmodal = mongoose.model("payment", paymentcheme);
module.exports = paymentmodal;
