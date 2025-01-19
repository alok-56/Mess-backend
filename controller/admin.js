const { validationResult } = require("express-validator");
const AppErr = require("../helper/appError");
const ordermodal = require("../models/order");
const subcriptionmodal = require("../models/subcription");
const paymentmodal = require("../models/payment");

// get all current time and date order
const fetchOrderBasedOndate = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { date, foodtype, status } = req.query;

    let query = {};

    if (date) {
      let parsedDate = new Date(date);
      parsedDate.setHours(0, 0, 0, 0);

      query.Bookingdate = {
        $gte: parsedDate,
        $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    if (foodtype) {
      if (foodtype === "breakfast") {
        query["foodtype.breakfast"] = true;
      } else if (foodtype === "lunch") {
        query["foodtype.lunch"] = true;
      } else if (foodtype === "dinner") {
        query["foodtype.Dinner"] = true;
      }
    }

    if (status !== undefined) {
      query.status = status === "true";
    }
    let orders = await ordermodal.find(query);

    return res.status(200).json({
      status: "success",
      message: "order Fetched successfully",
      data: orders,
    });
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

const fetchSubcriptioOrderBasedOndate = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { date, foodtype, status } = req.query;

    let query = {};

    if (date) {
      let parsedDate = new Date(date);
      parsedDate.setHours(0, 0, 0, 0);

      query.lastBookingdate = {
        $gte: parsedDate,
      };
    }

    if (foodtype) {
      if (foodtype === "breakfast") {
        query["foodtype.breakfast"] = true;
      } else if (foodtype === "lunch") {
        query["foodtype.lunch"] = true;
      } else if (foodtype === "dinner") {
        query["foodtype.Dinner"] = true;
      }
    }

    if (status !== undefined) {
      query.status = status === "true";
    }
    let orders = await subcriptionmodal.find(query);

    return res.status(200).json({
      status: "success",
      message: "Subcription order Fetched successfully",
      data: orders,
    });
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

const FetchAlltransaction = async (req, res, next) => {
  try {
    let { status, startdate, enddate, userId, OrderId, paymentid } = req.query;

    let query = {};

    if (status !== undefined) {
      query.status = status === "true";
    }

    if (startdate && enddate) {
      let parsedstartDate = new Date(startdate);
      let parsedendDate = new Date(enddate);
      parsedstartDate.setHours(0, 0, 0, 0);
      parsedendDate.setHours(0, 0, 0, 0);
      query.createdAt = {
        $gte: startdate,
        $lt: enddate,
      };
    }

    if (userId) {
      query.userId = userId;
    }

    if (OrderId) {
      query.orderId = OrderId;
    }

    if (paymentid) {
      query._id = paymentid;
    }

    let payment = await paymentmodal.find(query);

    return res.status(200).json({
      status: "success",
      message: "Payment Fetched successfully",
      data: payment,
    });
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

// get all deliver boy of location

// update each based on order and subcription and assign to delivery boy

//

module.exports = {
  fetchOrderBasedOndate,
  fetchSubcriptioOrderBasedOndate,
  FetchAlltransaction,
};
