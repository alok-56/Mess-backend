const AppErr = require("../helper/appError");
const verifyToken = require("../helper/verifytoken");
const UserModal = require("../models/users");


const isblocked=async(req,res,next)=>{
    try {
        const authHeader = req.headers.token;
        if (!authHeader) {
          return next(new AppErr("unAuthorized User", 404));
        }
        const { id } = await verifyToken(authHeader);
        if (!id) {
          return next(new AppErr("invailed token", 404));
        }
        let user = await UserModal.findById(id);
        if (!user) {
          return next(new AppErr("user not found", 404));
        }
        if(user.isBlocked){
            return next(new AppErr("You are blocked by admin",403))
        }
        next();
      } catch (error) {
        return next(new AppErr(error.message, 500));
      }
}

module.exports=isblocked