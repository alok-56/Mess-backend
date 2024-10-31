const express = require("express");
const { body } = require("express-validator");
const islogin = require("../middleware/islogin");
const isblocked = require("../middleware/isblocked");
const isadmin = require("../middleware/isAdmin");
const {
  CreatePlan,
  UpdatePlan,
  GetAllplan,
  GetSingleplan,
  deleteplan,
} = require("../controller/plan");
const planRouter = express.Router();

planRouter.post(
  "/create",
  body("planname").notEmpty().withMessage("Plan name is required"),
  body("duration")
    .notEmpty()
    .isNumeric()
    .withMessage("Duration is required and must be a number"),
  body("breakfastprice")
    .notEmpty()
    .isNumeric()
    .withMessage("Breakfast price is required and must be a number"),
  body("lunchPrice")
    .notEmpty()
    .isNumeric()
    .withMessage("Lunch price is required and must be a number"),
  body("dinnerprice")
    .notEmpty()
    .isNumeric()
    .withMessage("Dinner price is required and must be a number"),
  islogin,
  isblocked,
  isadmin,
  CreatePlan
);

planRouter.patch("/update/:id", islogin, isblocked, isadmin, UpdatePlan);

planRouter.get("/getAll", GetAllplan);

planRouter.get("/single/:id", GetSingleplan);
planRouter.delete("/delete/:id", islogin, isblocked, isadmin, deleteplan);

module.exports = planRouter;
