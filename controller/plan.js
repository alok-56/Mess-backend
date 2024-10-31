const { validationResult } = require("express-validator");
const AppErr = require("../helper/appError");
const planmodal = require("../models/plan");
const { getPagination } = require("../helper/pagination");

// create Plan
const CreatePlan = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let {
      planname,
      duration,
      breakfastprice,
      lunchPrice,
      dinnerprice,
      discount,
      title,
      description,
    } = req.body;

    req.body.price =
      (lunchPrice + dinnerprice + breakfastprice) * 30 * duration;

    let plan = await planmodal.create(req.body);

    res.status(200).json({
      status: "success",
      message: "Plan Created sucessfully",
      data: plan,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// update Plan

const UpdatePlan = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Plan id is required", 404));
    }

    let { lunchPrice, dinnerprice, breakfastprice, duration } = req.body;

    let plan = await planmodal.findById(id);
    if (!plan) {
      return next(new AppErr("Plan not found", 404));
    }

    if (lunchPrice || dinnerprice || breakfastprice) {
      req.body.price =
        ((lunchPrice ? lunchPrice : plan.lunchPrice) +
          (dinnerprice ? dinnerprice : plan.dinnerprice) +
          (breakfastprice ? breakfastprice : plan.breakfastprice)) *
        30 *
        duration;
    }

    await planmodal.updateOne(
      {
        _id: id,
      },
      { $set: req.body },
      { runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Plan Updated sucessfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get all Plan
const GetAllplan = async (req, res, next) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let full = req.query.full;

    let response = await getPagination(page, limit, full, planmodal);
    return res.status(200).json({
      status: "success",
      message: "plan Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Single Plan
const GetSingleplan = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Plan Id not found", 404));
    }
    let response = await planmodal.findById(id);
    return res.status(200).json({
      status: "success",
      message: "plan Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//delete plan
const deleteplan = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("plan id not found", 404));
    }
    await planmodal.findByIdAndDelete(id);
    return res.status(200).json({
      status: "success",
      message: "plan Deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(err.message));
  }
};

module.exports = {
  CreatePlan,
  UpdatePlan,
  GetAllplan,
  GetSingleplan,
  deleteplan,
};
