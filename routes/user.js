const express = require("express");
const {
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
} = require("../controller/users");
const { body } = require("express-validator");
const islogin = require("../middleware/islogin");
const isUser = require("../middleware/isUser");
const isblocked = require("../middleware/isblocked");
const isadmin = require("../middleware/isAdmin");
const userRouter = express.Router();

userRouter.post(
  "/otp/send",
  body("number").notEmpty().withMessage("number is required"),
  OtpSend
);

userRouter.post(
  "/otp/verify",
  body("number").notEmpty().withMessage("number is required"),
  body("otp").notEmpty().withMessage("otp is required"),
  Otpverification
);

userRouter.patch("/update", islogin, isblocked, Updateuser);
userRouter.get("/allusers", islogin, isblocked, isadmin, GetAlluser);
userRouter.get("/user/:id", islogin, isblocked, isadmin, Getsingleuser);
userRouter.get("/profile", islogin, isblocked, isUser, myprofile);
userRouter.patch("/block/:id", islogin, isblocked, isadmin, blockuser);
userRouter.post(
  "/admin/create",
  body("number").notEmpty().withMessage("number is required"),
  body("email").notEmpty().withMessage("email is required"),
  body("password").notEmpty().withMessage("password is required"),
  createAdmin
);

userRouter.post(
  "/deliveryboy/create",
  body("number").notEmpty().withMessage("number is required"),
  body("email").notEmpty().withMessage("email is required"),
  body("password").notEmpty().withMessage("password is required"),
  islogin,
  isblocked,
  isadmin,
  createdeliveryboy
);
userRouter.post(
  "/login",
  body("password").notEmpty().withMessage("password is required"),
  LoginUser
);

module.exports = userRouter;
