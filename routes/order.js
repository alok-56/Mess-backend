const express = require("express");
const islogin = require("../middleware/islogin");
const isblocked = require("../middleware/isblocked");
const isUser = require("../middleware/isUser");
const { body } = require("express-validator");
const isadmin = require("../middleware/isAdmin");
const {
  dailyorder,
  paydailyorder,
  GetMyorder,
  Getallorder,
} = require("../controller/order");
const orderRouter = express.Router();

orderRouter.post(
  "/create",
  body("locationId").notEmpty().withMessage("Location ID is required"),
  body("deliveryaddress.lat").notEmpty().withMessage("Latitude is required"),
  body("deliveryaddress.lon").notEmpty().withMessage("Longitude is required"),
  body("paidAmount").notEmpty().withMessage("Price is required"),
  body("foodtype.breakfast")
    .isBoolean()
    .withMessage("Breakfast must be a boolean"),
  body("foodtype.lunch").isBoolean().withMessage("Lunch must be a boolean"),
  body("foodtype.Dinner").isBoolean().withMessage("Dinner must be a boolean"),
  islogin,
  isblocked,
  isUser,
  dailyorder
);

orderRouter.post(
  "/payment",
  body("razorpay_order_id").notEmpty().withMessage("OrderId is required"),
  body("razorpay_payment_id").notEmpty().withMessage("PaymentId is required"),
  body("razorpay_signature")
    .notEmpty()
    .withMessage("razorpay signature is required"),
  body("orderid").notEmpty().withMessage("orderid is required"),
  islogin,
  isblocked,
  isUser,
  paydailyorder
);

orderRouter.get("/myorder", islogin, isblocked, isUser, GetMyorder);

orderRouter.get("/allorder", islogin, isblocked, isadmin, Getallorder);

module.exports = orderRouter;
