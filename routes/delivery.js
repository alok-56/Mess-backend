const express = require("express");
const islogin = require("../middleware/islogin");
const isblocked = require("../middleware/isblocked");
const isadmin = require("../middleware/isAdmin");
const { body } = require("express-validator");
const {
  GetTodaymyOrder,
  deliveryboylogin,
  GetAlldeliveryboy,
  UpdateOrderbyDeliveryBoy,
} = require("../controller/deliveryboy");
const isdeliveryboy = require("../middleware/isdeliveryboy");
const deliveryRouter = express.Router();

deliveryRouter.get(
  "/get/myassigned/delivery",
  islogin,
  isblocked,
  isdeliveryboy,
  GetTodaymyOrder
);

deliveryRouter.patch(
  "/update/assigned/order",
  body("assignedId").notEmpty().withMessage("assignedId is required"),
  body("type").notEmpty().withMessage("type is required"),
  body("status").notEmpty().withMessage("status is required"),
  islogin,
  isblocked,
  isdeliveryboy,
  UpdateOrderbyDeliveryBoy
);

deliveryRouter.post(
  "/login/delivery",
  body("password").notEmpty().withMessage("password is required"),
  deliveryboylogin
);
deliveryRouter.get(
  "/get/deliveryboy",
  islogin,
  isblocked,
  isadmin,
  GetAlldeliveryboy
);

module.exports = deliveryRouter;
