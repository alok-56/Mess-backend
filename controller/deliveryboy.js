const { validationResult } = require("express-validator");
const AppErr = require("../helper/appError");
const DeliveryModal = require("../models/delivery");
const ordermodal = require("../models/order");
const subcriptionmodal = require("../models/subcription");
const UserModal = require("../models/users");
const generateToken = require("../helper/generatetoken");

// login api

const deliveryboylogin = async (req, res, next) => {
  try {
    // validation
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { number, email, password } = req.body;

    if (!number && !email) {
      return next(new AppErr("number or email is required", 400));
    }

    if (number) {
      let numberfound = await UserModal.findOne({ number: number });
      if (!numberfound) {
        return next(new AppErr("Number not found", 400));
      }
      if (numberfound.password !== password) {
        return next(new AppErr("Password does not matched", 400));
      }
      if (numberfound.role !== "deliveryboy") {
        return next(new AppErr("Your don't not access", 400));
      }
      let token = await generateToken(numberfound._id);
      return res.status(200).json({
        status: "success",
        message: "Loged In successfully",
        data: numberfound,
        token: token,
      });
    }

    if (email) {
      let emailfound = await UserModal.findOne({ email: email });
      
      if (!emailfound) {
        return next(new AppErr("email not found", 400));
      }
      if (emailfound.password !== password) {
        return next(new AppErr("Password does not matched", 400));
      }

      if (emailfound.role !== "deliveryboy") {
        return next(new AppErr("Your don't not access", 400));
      }

      let token = await generateToken(emailfound._id);

      return res.status(200).json({
        status: "success",
        message: "Loged In successfully",
        data: emailfound,
        token: token,
      });
    }
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

// get my assigned today order
const GetTodaymyOrder = async (req, res, next) => {
  try {
    let { status, date } = req.query;
    let id = req.users;

    let query = {};
    if (status) {
      query.status = status;
    }

    if (date) {
      let parsedDate = new Date(date);
      parsedDate.setHours(0, 0, 0, 0);
      query.createdAt = {
        $gte: parsedDate,
        $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    query.DeliverybodId = id;
    let myorder = await DeliveryModal.find(query).populate("OrderId");

    return res.status(200).json({
      status: "success",
      message: "Order fetched successfully",
      data: myorder,
    });
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

// update order by delivey
const UpdateOrderbyDeliveryBoy = async (req, res, next) => {
  try {
    let { assignedId, type, status, remarks } = req.body;

    if (type === "order") {
      let delivery = await DeliveryModal.findById(assignedId);
      if (!delivery) {
        return next(new AppErr("Order Not Found", 404));
      }
      delivery.status = status;
      delivery.remarks = remarks ? remarks : "Updated";

      let order = await ordermodal.findById(delivery.OrderId);
      order.delivered = true;

      await order.save();
      await delivery.save();
    } else {
      let delivery = await DeliveryModal.findById(assignedId);
      if (!delivery) {
        return next(new AppErr("Order Not Found", 404));
      }
      delivery.status = status;
      delivery.remarks = remarks ? remarks : "Updated";

      let order = await subcriptionmodal.findById(delivery.OrderId);
      order.assigned = false;

      await order.save();
      await delivery.save();
    }
    return res.status(200).json({
      status: "success",
      message: "Order fetched successfully",
      data: myorder,
    });
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

const GetAlldeliveryboy = async (req, res, next) => {
  try {
    let response = await UserModal.find({ role: "deliveryboy" });
    return res.status(200).json({
      status: "success",
      message: "delivery Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  GetTodaymyOrder,
  UpdateOrderbyDeliveryBoy,
  deliveryboylogin,
  GetAlldeliveryboy,
};
