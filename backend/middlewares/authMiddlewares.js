const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

//* Middlewares ****************************************************
//* Protected route ************************************************

exports.protect = catchAsync(async (req, res, next) => {
  // Get token and check its existance
  let accessToken;
  if (req.headers.authorization?.startsWith("Bearer")) {
    accessToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.access) {
    accessToken = req.cookies.access;
  }

  if (!accessToken) {
    return next(new AppError("Please login to proceed!", 401));
  }

  // Verify token
  let decodedToken;
  try {
    decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Please login to proceed!", 401));
    }
    return next(new AppError("Invalid Token!", 401));
  }

  // Check if user still exists
  const user = await User.findById(decodedToken?.id).select(
    "+passwordChangedAt"
  );
  if (!user) {
    return next(new AppError("User not found!", 401));
  }

  // Check if user changed password after accessToken was issued
  if (user.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password. Please login again!", 401)
    );
  }

  // Grant access to protected route
  req.user = user;
  next();
});

//* Restricted route ***********************************************

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action!", 403)
      );
    }

    next();
  };

//* User Verification Check ****************************************

exports.verified = (req, res, next) => {
  // phone verification is not checked as twilio is in trial mode
  if (!req.user.emailVerified) {
    return next(
      new AppError("Please verify your email to perform this action!", 403)
    );
  }

  next();
};

// exports.verified = (req, res, next) => {
//   // both email and phone verification is checked
//   if (!req.user.emailVerified || (req.user.phone && !req.user.phoneVerified)) {
//     return next(
//       new AppError(
//         "Please verify your both email and phone to perform this action!",
//         403
//       )
//     );
//   }

//   next();
// };

//* Local provider check *******************************************

exports.providerLocal = (req, res, next) => {
  const { provider } = req.user;
  if (provider !== "local") {
    return next(
      new AppError(`Please use ${provider} to perform the following operation!`)
    );
  }
  next();
};
