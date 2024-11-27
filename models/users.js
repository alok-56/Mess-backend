const mongoose = require("mongoose");

const Userschma = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    number: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    suscription: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModal = mongoose.model("user", Userschma);
module.exports = UserModal;
