const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const passport = require("passport");

const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingControllers = require("./controllers/bookingControllers");
const AppError = require("./utils/appError");
const errorHandler = require("./middlewares/errorMiddleware");
const sanitizeHtml = require("./middlewares/sanitizeHtml");
require("./controllers/authentication/passport");

//* Start express app **********************************************

const app = express();

//* Middlewares ****************************************************

// Implement cors
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.options("*", cors());

// set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logger for dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests
const limiter = rateLimit({
  //TODO change max to 100
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: new AppError(
    "Too many requests from this IP, please try again in an hour",
    429
  ),
});
app.use("/api", limiter);

// stripe webhook (not global middleware)
app.post(
  "/api/v2/booking/webhook-checkout",
  express.raw({ type: "application/json" }),
  bookingControllers.webhookCheckout
);

// Body parser
app.use(express.json({ limit: "10kb" }));

// passport
app.use(passport.initialize());

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(sanitizeHtml());

// Prevent paramater pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// compression
app.use(compression());

//* Routes *********************************************************

app.get("/", (req, res) => res.send("Server working!"));

app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/user", userRoutes);
app.use("/api/v2/tour", tourRoutes);
app.use("/api/v2/review", reviewRoutes);
app.use("/api/v2/booking", bookingRoutes);

//* Error Middleware ***********************************************

// Route not found
app.all("*", (req, res, next) => {
  next(
    new AppError(`Can't find ${req.originalUrl} route on this server!`, 404)
  );
});

// Global error handling
app.use(errorHandler);

module.exports = app;
