const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    paymentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",
      },
    ],
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "location",
    },
    deliveryaddress: {
      lat: {
        type: String,
        required: true,
      },
      lon: {
        type: String,
        required: true,
      },
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    Bookingdate: {
      type: Date,
      required: true,
    },
    foodtype: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      Dinner: { type: Boolean, default: false },
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    delivered: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ordermodal = mongoose.model("order", orderSchema);
module.exports = ordermodal;
