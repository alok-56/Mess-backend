const mongoose = require("mongoose");
const subcriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    planId: {
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
    lastBookingdate: {
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
    expired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const subcriptionmodal = mongoose.model("subcription", subcriptionSchema);
module.exports = subcriptionmodal;
