const crypto = require("crypto");
const Razorpay = require("razorpay");
const AppErr = require("../helper/appError");
const planmodal = require("../models/plan");
const locationmodal = require("../models/location");
const { Distancecalculation } = require("../helper/distancecalculation");
const subcriptionmodal = require("../models/subcription");
const UserModal = require("../models/users");
const { validationResult } = require("express-validator");
const paymentmodal = require("../models/payment");
require("dotenv").config();

// order creation
const createOrder = async (req, res, next) => {
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
    let instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    let { planId, locationId, deliveryaddress, foodtype, coupon } = req.body;

    let plan = await planmodal.findById(planId);
    if (!plan) {
      return next(new AppErr("Plan not found", 404));
    }
    let price =
      (foodtype.breakfast
        ? plan.breakfastprice
        : 0 + foodtype.lunch
        ? plan.lunchPrice
        : 0 + foodtype.Dinner
        ? plan.Dinner
        : 0) *
      30 *
      plan.duration;

    //--coupon discount----//
    if (coupon) {
    }
    req.body.paidAmount = price;
    req.body.Bookingdate = new Date();
    req.body.lastBookingdate = new Date() + plan.duration;
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
      amount: price * 100,
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
      let sub = await subcriptionmodal.create(req.body);
      user.suscription.push(sub._id);
      await user.save();

      return res.status(200).json({
        status: "success",
        message: "order created successfully",
        data: order,
        sub: sub,
      });
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// create subcription of user
const handlepayment = async (req, res, next) => {
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
      locationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subcriptionid,
    } = req.body;

    let sub = await subcriptionmodal.findById(subcriptionid);
    if (!sub) {
      return next(new AppErr("Subcription not found", 404));
    }

    let location = await locationmodal.findById(locationId);
    if (!location) {
      return next(new AppErr("location not found", 404));
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
      req.body.locationId = location._id;
      req.body.amount = sub.paidAmount;
      req.body.status = true;

      let pay = await paymentmodal.create(req.body);

      sub.status = true;
      sub.paymentId.push(pay._id);

      await sub.save();

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

// get my subcription
const GetMysubcription = async (req, res, next) => {
  try {
    let user = req.users;
    let subcription = await subcriptionmodal
      .find({ userId: user })
      .populate("paymentId");

    return res.status(200).json({
      status: "success",
      message: "subcription Fetched successfully",
      data: subcription,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// get all subcription
const Getallsubcription = async (req, res, next) => {
  try {
    let subcription = await subcriptionmodal.find().populate("paymentId");

    return res.status(200).json({
      status: "success",
      message: "subcription Fetched successfully",
      data: subcription,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// renew subcription
const renewsubcriptionorder = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    let userid = req.users;
    let user = await UserModal.findById(userid);
    if (!user) {
      return next(new AppErr("user not found", 404));
    }

    let { subId } = req.body;
    let sub = await subcriptionmodal.findById(subId);
    if (!sub) {
      return next(new AppErr("Subcription not found", 404));
    }

    var options = {
      amount: sub.paidAmount * 100,
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
      return res.status(200).json({
        status: "success",
        message: "order created successfully",
        data: order,
        sub: sub,
      });
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const renewpayment = async (req, res, next) => {
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
      subcriptionid,
    } = req.body;

    let sub = await subcriptionmodal.findById(subcriptionid);
    if (!sub) {
      return next(new AppErr("Subcription not found", 404));
    }

    let plan = await planmodal.findById(sub.planId);
    if (!plan) {
      return next(new AppErr("Plan not found", 404));
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
      req.body.status = true;
      req.body.locationId = sub.locationId;
      req.body.amount = sub.paidAmount;
      req.body.remarks = "renew";

      let pay = await paymentmodal.create(req.body);

      sub.lastBookingdate = sub.lastBookingdate + plan.duration;
      sub.expired = false;
      sub.status = true;
      sub.paymentId.push(pay._id);

      await sub.save();

      res.status(200).json({
        status: "success",
        message: "subcription Renewed successfully",
        data: pay,
      });
    } else {
      return next(new AppErr("Payment failed", 400));
    }
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// update subcription details

// update payment details

module.exports = {
  createOrder,
  handlepayment,
  GetMysubcription,
  Getallsubcription,
  renewsubcriptionorder,
  renewpayment,
};
