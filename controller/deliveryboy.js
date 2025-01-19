const AppErr = require("../helper/appError");
const DeliveryModal = require("../models/delivery");
const ordermodal = require("../models/order");
const subcriptionmodal = require("../models/subcription");

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

module.exports = {
  GetTodaymyOrder,
  UpdateOrderbyDeliveryBoy,
};
