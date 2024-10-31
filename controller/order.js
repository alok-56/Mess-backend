const { validationResult } = require("express-validator");
const AppErr = require("../helper/appError");
const { Distancecalculation } = require("../helper/distancecalculation");
const locationmodal = require("../models/location");
const ordermodal = require("../models/order");
const UserModal = require("../models/users");
const crypto = require("crypto");
const Razorpay = require("razorpay");
require("dotenv").config();

// create order
const dailyorder = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let userid = req.users;

    let instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    let { locationId, deliveryaddress, foodtype, coupon, paidAmount } =
      req.body;

    //--coupon discount----//
    if (coupon) {
    }

    req.body.Bookingdate = new Date();
    req.body.userId = userid;

    let location = await locationmodal.findById(locationId);
    if (!location) {
      return next(new AppErr("location not found", 404));
    }

    let distance = await Distancecalculation(
      location.coords.lat,
      location.coords.lon,
      deliveryaddress.lat,
      deliveryaddress.lon
    );

    if (distance + 1 > location.deliverydistance) {
      return next(
        new AppErr("Delivery not available for current location", 400)
      );
    }

    var options = {
      amount: paidAmount * 100,
      currency: "INR",
    };

    instance.orders.create(options, async function (err, order) {
      if (err) {
        const errorMessage =
          err.error && err.error.description
            ? err.error.description
            : "An error occurred while creating the order";
        return next(new AppErr(errorMessage, 400));
      }
      let dailyorder = await ordermodal.create(req.body);
      return res.status(200).json({
        status: "success",
        message: "order created successfully",
        data: order,
        sub: dailyorder,
      });
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const paydailyorder = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let userid = req.users;
    let user = await UserModal.findById(userid);
    if (!user) {
      return next(new AppErr("user not found", 404));
    }

    let {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderid,
    } = req.body;

    let dailyorder = await ordermodal.findById(orderid);
    if (!dailyorder) {
      return next(new AppErr("order not found", 404));
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    var expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      req.body.userId = userid;
      req.body.transitionId = razorpay_payment_id;
      req.body.orderId = razorpay_order_id;
      req.body.locationId = dailyorder.locationId;
      req.body.amount = dailyorder.paidAmount;
      req.body.status = true;
      req.body.remarks = "order";

      let pay = await paymentmodal.create(req.body);

      dailyorder.status = true;
      dailyorder.paymentId.push(pay._id);

      await dailyorder.save();

      res.status(200).json({
        status: "success",
        message: "subcription created successfully",
        data: pay,
      });
    } else {
      return next(new AppErr("Payment failed", 400));
    }
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// get my order
const GetMyorder = async (req, res, next) => {
  try {
    let user = req.users;
    let order = await ordermodal.find({ userId: user }).populate("paymentId");

    return res.status(200).json({
      status: "success",
      message: "order Fetched successfully",
      data: order,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// get all order
const Getallorder = async (req, res, next) => {
  try {
    let order = await ordermodal.find().populate("paymentId");
    return res.status(200).json({
      status: "success",
      message: "subcription Fetched successfully",
      data: order,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// update order details

// update payment details

module.exports = {
  dailyorder,
  paydailyorder,
  GetMyorder,
  Getallorder,
};
