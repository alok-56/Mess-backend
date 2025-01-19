const { default: mongoose } = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    OrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "order",
    },
    DeliveryboyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      required: true,
      default: "Assigned",
      enum: ["Assigned", "delivered", "rejected"],
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const DeliveryModal = mongoose.model("delivery", DeliverySchema);

module.exports = DeliveryModal;
