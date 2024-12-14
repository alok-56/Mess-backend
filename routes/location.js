const express = require("express");
const islogin = require("../middleware/islogin");
const isblocked = require("../middleware/isblocked");
const isadmin = require("../middleware/isAdmin");
const { locationcreation, updatelocation, GetAlllocation, Getsinglelocation } = require("../controller/location");
const { body } = require("express-validator");
const locationRouter = express.Router();

locationRouter.post(
  "/create",
  body("name").notEmpty().withMessage("location name is required"),
  body("coords").notEmpty().withMessage("coords is required"),
  body("deliverydistance").notEmpty().withMessage("deliverydistance is required"),
  islogin,
  isblocked,
  isadmin,
  locationcreation
);

locationRouter.patch(
    "/update/:id",
    islogin,
    isblocked,
    isadmin,
    updatelocation
  );

  locationRouter.get(
    "/getall",
    islogin,
    isblocked,
    GetAlllocation
  );

  locationRouter.get(
    "/get/:id",
    islogin,
    isblocked,
   Getsinglelocation
  );

module.exports=locationRouter