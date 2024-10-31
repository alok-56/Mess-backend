const { validationResult } = require("express-validator");
const AppErr = require("../helper/appError");
const locationmodal = require("../models/location");
const { getPagination } = require("../helper/pagination");

// Create Location
const locationcreation = async (req, res, next) => {
  try {
    // validation
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let location = await locationmodal.create(req.body);
    return res.status(200).json({
      status: "success",
      message: "location created Successfully",
      data: location,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Location
const updatelocation = async (req, res, next) => {
  try {
    // validation
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { id } = req.params;
    if (!id) {
      return next(new AppErr("location id is required", 400));
    }
    await locationmodal.updateOne(
      {
        _id: id,
      },
      { $set: req.body },
      { runValidators: true }
    );
    return res.status(200).json({
      status: "success",
      message: "location updated Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All location
const GetAlllocation = async (req, res, next) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let full = req.query.full;

    let response = await getPagination(page, limit, full, locationmodal);
    return res.status(200).json({
      status: "success",
      message: "location Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Single Location
const Getsinglelocation = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("user Id not found", 404));
    }
    let response = await locationmodal.findById(id);
    return res.status(200).json({
      status: "success",
      message: "location Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  locationcreation,
  updatelocation,
  GetAlllocation,
  Getsinglelocation,
};
