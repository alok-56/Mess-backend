const express = require("express");
const islogin = require("../middleware/islogin");
const isblocked = require("../middleware/isblocked");
const isUser = require("../middleware/isUser");
const {
  createOrder,
  handlepayment,
  GetMysubcription,
  Getallsubcription,
  renewsubcriptionorder,
  renewpayment,
} = require("../controller/subcription");
const { body } = require("express-validator");
const isadmin = require("../middleware/isAdmin");
const subcriptionRouter = express.Router();

subcriptionRouter.post(
  "/create",
  body("planId").notEmpty().withMessage("Plan ID is required"),
  body("locationId").notEmpty().withMessage("Location ID is required"),
  body("deliveryaddress.lat").notEmpty().withMessage("Latitude is required"),
  body("deliveryaddress.lon").notEmpty().withMessage("Longitude is required"),
  body("foodtype.breakfast")
    .isBoolean()
    .withMessage("Breakfast must be a boolean"),
  body("foodtype.lunch").isBoolean().withMessage("Lunch must be a boolean"),
  body("foodtype.Dinner").isBoolean().withMessage("Dinner must be a boolean"),
  islogin,
  isblocked,
  isUser,
  createOrder
);

subcriptionRouter.post(
  "/payment",
  body("locationId").notEmpty().withMessage("Location ID is required"),
  body("razorpay_order_id").notEmpty().withMessage("OrderId is required"),
  body("razorpay_payment_id").notEmpty().withMessage("PaymentId is required"),
  body("razorpay_signature")
    .notEmpty()
    .withMessage("razorpay signature is required"),
  body("subcriptionid").notEmpty().withMessage("subcriptionid is required"),
  islogin,
  isblocked,
  isUser,
  handlepayment
);

subcriptionRouter.get("/mysub", islogin, isblocked, isUser, GetMysubcription);

subcriptionRouter.get(
  "/allsub",
  islogin,
  isblocked,
  isadmin,
  Getallsubcription
);

subcriptionRouter.post(
  "/renew/create",
  body("subId").notEmpty().withMessage("Subcription ID is required"),
  islogin,
  isblocked,
  isUser,
  renewsubcriptionorder
);

subcriptionRouter.post(
  "/renew/payment",
  body("razorpay_order_id").notEmpty().withMessage("OrderId is required"),
  body("razorpay_payment_id").notEmpty().withMessage("PaymentId is required"),
  body("razorpay_signature")
    .notEmpty()
    .withMessage("razorpay signature is required"),
  body("subcriptionid").notEmpty().withMessage("subcriptionid is required"),
  islogin,
  isblocked,
  isUser,
  renewpayment
);

module.exports = subcriptionRouter;
