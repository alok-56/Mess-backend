const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner"]
    },
    item: [
      {
        portion: {
          type: String,
          required: true,
        },
        name: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const menumodal = mongoose.model("menu", menuSchema);
module.exports = menumodal;
