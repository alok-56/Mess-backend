const { validationResult } = require("express-validator");
const AppErr = require("../helper/appError");
const ordermodal = require("../models/order");
const subcriptionmodal = require("../models/subcription");
const paymentmodal = require("../models/payment");
const UserModal = require("../models/users");
const DeliveryModal = require("../models/delivery");

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
    query.assigned = false;
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

    query.assigned = false;
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

//  Update Order  and assign to delivery boy
const UpdateOrderAndAssign = async (req, res) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { OrderId, DeliveryboyId, type } = req.body;

    // check orderid
    let sub = await subcriptionmodal.findById(OrderId);
    let order = await ordermodal.findById(OrderId);
    if (type === "order") {
      if (!order) {
        return next(new AppErr("Order not found", 404));
      }
    } else {
      if (!sub) {
        return next(new AppErr("Subcription not found", 404));
      }
    }

    // check deliveryboyid
    let delivery = await UserModal.findById(DeliveryboyId);
    if (!delivery || delivery.role !== "deliveryboy") {
      return next(new AppErr("delivery boy not found", 404));
    }

    // create delivery
    let deliverycreation = await DeliveryModal.create(req.body);

    if (type === "order") {
      order.assigned = true;
      await order.save();
    } else {
      sub.assigned = true;
      await sub.save();
    }
    return res.status(200).json({
      status: "success",
      message: "Order assigned successfully",
      data: deliverycreation,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//  GetAssigedDetails of order

const getAssignedDetails = async (req, res, next) => {
  try {
    let { id } = req.params;

    let delivery = await DeliveryModal.find({ OrderId: id }).populate(
      "DeliveryboyId"
    );
    return res.status(200).json({
      status: "success",
      message: "delivery details fetched successfully",
      data: delivery,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  fetchOrderBasedOndate,
  fetchSubcriptioOrderBasedOndate,
  FetchAlltransaction,
  UpdateOrderAndAssign,
  getAssignedDetails,
};
