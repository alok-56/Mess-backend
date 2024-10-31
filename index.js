const express = require("express");
const connection = require("./config/database");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const globalErrHandler = require("./middleware/globalerror");
const AppErr = require("./helper/appError");
const userRouter = require("./routes/user");
const locationRouter = require("./routes/location");
const menuRouter = require("./routes/menu");
const planRouter = require("./routes/plan");
const subcriptionRouter = require("./routes/subcription");
const orderRouter = require("./routes/order");
require("dotenv").config();
const app = express();

// global Middleware
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());

// Route Middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/plan", planRouter);
app.use("/api/v1/subcription",subcriptionRouter)
app.use("/api/v1/order",orderRouter)

//Not Found Route Page
app.use("*", (req, res, next) => {
  return next(new AppErr("Page Not Found", 404));
});

// Global Error
app.use(globalErrHandler);

const PORT = 8080;
connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
