const AppError = require("../utils/appError");

//* Database Errors ************************************************

// Cast Error
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}!`;
  return new AppError(message, 400);
};

// Duplicate fields Error
const handleDuplicateFieldsDB = (error) => {
  const key = Object.keys(error.keyValue);
  const value = Object.values(error.keyValue);
  let message = `${value} already in use. Please use another ${key}!`;

  if (key.includes("tour") && key.includes("user") && key.includes("booking")) {
    message = "You have already reviewed this trip. Please update instead!";
  }

  return new AppError(message, 400);
};

// Validation Error
const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = errors.join(". ");
  return new AppError(message, 400);
};

// Geo Keys Error
const handleGeoKeysError = () =>
  new AppError("Please provide valid coordinates of location!", 400);

//* Development Error **********************************************

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

//* Production Error ***********************************************

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational Errors
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown errors
    console.error("Error:", err); // Logging error in hosting platform console

    res.status(500).json({
      status: "ERROR",
      message: "Something went very wrong!",
    });
  }
};

//* Middlewares ****************************************************
//* Global Error Handler *******************************************

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.code === 16755) error = handleGeoKeysError();

    sendErrorProd(error, res);
  }
};
