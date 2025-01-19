const { validationResult } = require("express-validator");
const AppErr = require("../helper/appError");
const locationmodal = require("../models/location");
const menumodal = require("../models/menu");
const { getPagination } = require("../helper/pagination");

// create Menu
const createMenu = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    const menutype = ["Breakfast", "Lunch", "Dinner"];
    const week = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    let { type, location, item, price, day } = req.body;

    if (!menutype.includes(type)) {
      return next(new AppErr(`Menu type will be any one of ${menutype}`, 400));
    }

    if (!week.includes(day)) {
      return next(new AppErr(`Day will be any one of ${week}`, 400));
    }

    let typeexisit = await menumodal.findOne({
      type: type,
      location: location,
      day: day,
    });
    if (typeexisit) {
      return next(
        new AppErr(
          `menu type already exists for ${type} on ${day} at given location`,
          400
        )
      );
    }

    for (var i = 0; i < item; i++) {
      if (!item.portion) {
        return next(new AppErr(`portion is required for menu item`, 404));
      }
      if (item.name.length === 0) {
        return next(new AppErr(`item is required for menu item`, 404));
      }
    }

    let locationfound = await locationmodal.findById(location);
    if (!locationfound) {
      return next(new AppErr("Location not found", 404));
    }

    let menu = await menumodal.create(req.body);
    return res.status(200).json({
      status: "success",
      message: "Menu created successfully",
      data: menu,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// update Menu

const updatemenu = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("menu Id is required", 403));
    }

    let menufound = await menumodal.findById(id);
    if (!menufound) {
      return next(new AppErr("menu not found", 404));
    }

    const menutype = ["Breakfast", "Lunch", "Dinner"];
    const week = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    let { type, location, item, price, day } = req.body;

    if (type) {
      if (!menutype.includes(type)) {
        return next(
          new AppErr(`Menu type will be any one of ${menutype}`, 400)
        );
      }
    }

    if (day) {
      if (!week.includes(day)) {
        return next(new AppErr(`Day will be any one of ${week}`, 400));
      }
    }

    if (type || day || location) {
      let typeexisit = await menumodal.findOne({
        type: type ? type : menufound.type,
        location: location ? location : menufound.location,
        day: day ? day : menufound.day,
      });
      if (typeexisit) {
        return next(
          new AppErr(
            `menu type already exists for ${type} on ${day} at given location3`,
            400
          )
        );
      }
    }

    if (item) {
      for (var i = 0; i < item; i++) {
        if (!item.portion) {
          return next(new AppErr(`portion is required for menu item`, 404));
        }
        if (item.name.length === 0) {
          return next(new AppErr(`item is required for menu item`, 404));
        }
      }
    }

    if (location) {
      let locationfound = await locationmodal.findById(location);
      if (!locationfound) {
        return next(new AppErr("Location not found", 404));
      }
    }

    let menu = await menumodal.updateOne(
      {
        _id: id,
      },
      { $set: req.body },
      { runValidators: true }
    );
    return res.status(200).json({
      status: "success",
      message: "Menu updated successfully",
      data: menu,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get all menu

const GetAllmenu = async (req, res, next) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let full = req.query.full;

    let response = await getPagination(page, limit, full, menumodal);
    return res.status(200).json({
      status: "success",
      message: "Menu Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get single menu

const GetSinglemenu = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("menu Id not found", 404));
    }
    let response = await menumodal.findById(id);
    return res.status(200).json({
      status: "success",
      message: "Menu Fetched successfully",
      data: response,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get menu location wise
const menubylocation = async (req, res, next) => {
  try {
    let { locationid } = req.params;
    if (!locationid) {
      return next(new AppErr("location Id is required", 400));
    }

    let menu = await menumodal.find({ location: locationid });

    return res.status(200).json({
      status: "success",
      message: "Menu Fetched successfully",
      data: menu,
    });
  } catch (error) {}
};

// update item

const updatemenuitem = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { itemid } = req.params;
    if (!itemid) {
      return next(new AppErr("Item id is required", 400));
    }

    let { name, portion } = req.body;

    let menu = await menumodal.findOne({ "item._id": itemid });
    if (!menu) {
      return next(new AppErr("Item not found", 404));
    }
    await menumodal.findOneAndUpdate(
      { "item._id": itemid },
      {
        $set: { "item.$[elem].name": name, "item.$[elem].portion": portion },
      },
      {
        arrayFilters: [{ "elem._id": itemid }],
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Item updated successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  createMenu,
  updatemenu,
  GetAllmenu,
  GetSinglemenu,
  updatemenuitem,
  menubylocation,
};
