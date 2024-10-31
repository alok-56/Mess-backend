const express = require("express");
const islogin = require("../middleware/islogin");
const isblocked = require("../middleware/isblocked");
const isadmin = require("../middleware/isAdmin");
const {
  createMenu,
  updatemenu,
  GetAllmenu,
  GetSinglemenu,
  updatemenuitem,
  menubylocation,
} = require("../controller/menu");
const { body } = require("express-validator");
const menuRouter = express.Router();

menuRouter.post(
  "/create",
  body("type").notEmpty().withMessage("menu type is required"),
  body("location").notEmpty().withMessage("Menu location is required"),
  body("item").notEmpty().withMessage("Menu item is required"),
  body("price").notEmpty().withMessage("price  is required"),
  body("day").notEmpty().withMessage("day  is required"),
  islogin,
  isblocked,
  isadmin,
  createMenu
);

menuRouter.patch("/update/:id", islogin, isblocked, isadmin, updatemenu);

menuRouter.get("/getall", GetAllmenu);

menuRouter.get("/single/:id", GetSinglemenu);

menuRouter.patch(
  "/updateitem/:itemid",
  body("name").notEmpty().withMessage("item name   is required"),
  body("portion").notEmpty().withMessage("item portion  is required"),
  islogin,
  isblocked,
  isadmin,
  updatemenuitem
);

menuRouter.get("/:locationid", menubylocation);

module.exports = menuRouter;
