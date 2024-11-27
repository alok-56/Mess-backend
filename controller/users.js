const { validationResult } = require("express-validator");
const AppErr = require("../helper/appError");
const otpmodel = require("../models/otpverification");
const { findByIdAndDelete } = require("../models/users");
const UserModal = require("../models/users");
const generateToken = require("../helper/generatetoken");
const { getPagination } = require("../helper/pagination");

// Otp send
const OtpSend = async (req, res, next) => {
  try {
    // validation
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { number } = req.body;
    if (number.toString().length !== 10) {
      return next(new AppErr("Number must be 10 digit", 403));
    }

    //random number generation

    // check number and create
    var otpfound;
    let usernumber = await otpmodel.findOne({ number: number });
    if (usernumber) {
      await UserModal.findByIdAndDelete(usernumber._id);
      otpfound = await otpmodel.create({
        number: number,
        otp: 12345,
      });
    } else {
      otpfound = await otpmodel.create({
        number: number,
        otp: 12345,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Otp Send Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Otp verification and create user
const Otpverification = async (req, res, next) => {
  try {
    // validation
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { number, otp } = req.body;
    let usernumber = await otpmodel.findOne({ number: number });
    if (!usernumber) {
      return next(new AppErr("number not found or otp expired", 404));
    }

    let user = await UserModal.findOne({ number: number });
    if (user) {
      if (otp === usernumber.otp) {
        await otpmodel.findByIdAndDelete(usernumber._id);
        let token = await generateToken(user._id);
        return res.status(200).json({
          status: "success",
          message: "Otp verified sucessfully",
          data: user,
          token: token,
          userexisit:true
        });
      } else {
        return next(new AppErr("Invailed Otp", 400));
      }
    } else {
      if (otp === usernumber.otp) {
        await otpmodel.findByIdAndDelete(usernumber._id);
        let usercreated = await UserModal.create({
          number: number,
          role: "users",
          isBlocked: false,
        });
        let token = await generateToken(usercreated._id);
        return res.status(200).json({
          status: "success",
          message: "Otp verified sucessfully",
          data: usercreated,
          token: token,
          userexisit:false
        });
      } else {
        return next(new AppErr("Invailed Otp", 400));
      }
    }
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Userdeatils
const Updateuser = async (req, res, next) => {
  try {
    // validation
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { email } = req.body;
    if (email) {
      let emailfound = await UserModal.findOne({ email: email });
      if (emailfound) {
        return next(new AppErr("email already exists", 400));
      }
    }

    let id = req.users;
    await UserModal.updateOne(
      {
        _id: id,
      },
      { $set: req.body },
      { runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "User Updated sucessfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get all Users

const GetAlluser = async (req, res, next) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let full = req.query.full;

    let response = await getPagination(page, limit, full, UserModal);
    return res.status(200).json({
      status: "success",
      message: "Users Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Single Users
const Getsingleuser = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("user Id not found", 404));
    }
    let response = await UserModal.findById(id);
    return res.status(200).json({
      status: "success",
      message: "Users Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// my profile
const myprofile = async (req, res, next) => {
  try {
    let id = req.users;
    let response = await UserModal.findById(id);
    return res.status(200).json({
      status: "success",
      message: "Users Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Block Users
const blockuser = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("User id is required", 400));
    }
    let response = await UserModal.findById(id);
    if (response.isBlocked) {
      return next(new AppErr("User already blocked", 403));
    }

    let user = await UserModal.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: "Users Blocked successfully",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// create Admin
const createAdmin = async (req, res, next) => {
  try {
    // validation
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { name, number, email, password } = req.body;

    let numberfound = await UserModal.findOne({ number: number });
    if (numberfound) {
      return next(new AppErr("Number already exists", 400));
    }
    let emailfound = await UserModal.findOne({ email: email });
    if (emailfound) {
      return next(new AppErr("email already exists", 400));
    }
    req.body.role = "admin";
    req.body.isBlocked = false;

    let admin = await UserModal.create(req.body);
    let token = await generateToken(admin._id);

    return res.status(200).json({
      status: "success",
      message: "Admin Created successfully",
      data: admin,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

// Create Delivery boy
const createdeliveryboy = async (req, res, next) => {
  try {
    // validation
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { name, number, email, password } = req.body;

    let numberfound = await UserModal.findOne({ number: number });
    if (numberfound) {
      return next(new AppErr("Number already exists", 400));
    }
    let emailfound = await UserModal.findOne({ email: email });
    if (emailfound) {
      return next(new AppErr("email already exists", 400));
    }
    req.body.role = "deliveryboy";
    req.body.isBlocked = false;

    let admin = await UserModal.create(req.body);
    let token = await generateToken(admin._id);

    return res.status(200).json({
      status: "success",
      message: "Admin Created successfully",
      data: admin,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

// Login with email/number or password
const LoginUser = async (req, res, next) => {
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
      if (emailfound) {
        return next(new AppErr("email not found", 400));
      }
      if (emailfound.password !== password) {
        return next(new AppErr("Password does not matched", 400));
      }

      let token = await generateToken(numberfound._id);

      return res.status(200).json({
        status: "success",
        message: "Loged In successfully",
        data: numberfound,
        token: token,
      });
    }
  } catch (error) {
    return next(new AppErr(error.message));
  }
};

module.exports = {
  OtpSend,
  Otpverification,
  Updateuser,
  GetAlluser,
  Getsingleuser,
  myprofile,
  blockuser,
  createAdmin,
  createdeliveryboy,
  LoginUser,
};
