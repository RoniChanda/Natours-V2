const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const Feedback = require("../models/feedbackModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { removeCookies } = require("../utils/tokensAndCookies");
const factory = require("./handleFactory");
const {
  createAndSendVerificationCode,
  verifyCode,
} = require("./helperFunctions");

//* Helping Middlewares ********************************************

// add user id in params
exports.getUserId = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// add photo to req.body
exports.addPhotoToBody = (req, res, next) => {
  // Create an error if user tries to change password in this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /update-my-password",
        400
      )
    );
  }

  if (req.photo) req.body.photo = req.photo;
  next();
};

// remove Cookies
exports.removeCookiesOfUser = (req, res, next) => {
  removeCookies(res);
  next();
};

// delete all data of a deleted user
exports.deleteAllData = catchAsync(async (req, res, next) => {
  await Booking.deleteMany({ user: req.params.id });
  await Review.deleteMany({ user: req.params.id });
  await Feedback.deleteMany({ user: req.params.id });
  next();
});

//* Controllers ****************************************************
//* send verification code to email or phone ***********************

exports.sendVerificationCode = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  await createAndSendVerificationCode(res, next, user, "code", req.body.medium);
});

//* Verify email or phone ******************************************

exports.verifyEmailOrPhone = catchAsync(async (req, res, next) => {
  const { code, medium } = req.body;
  const user = await verifyCode(code, next);

  if (medium === "email") user.emailVerified = true;
  if (medium === "phone") user.phoneVerified = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: "SUCCESS", userId: user._id });
});

//* Update My Password *********************************************

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Verify old password
  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // Update new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.status(200).json({ status: "SUCCESS" });
});

//* Deactivate Me **************************************************

exports.deactivateMe = catchAsync(async (req, res, next) => {
  // change active field to false, but don't delete from DB
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
    refreshTokens: [],
  });
  removeCookies(res);

  res.status(204).json({
    status: "SUCCESS",
    data: null,
  });
});

//* get guides *****************************************************

exports.getGuides = catchAsync(async (req, res, next) => {
  const guides = await User.find({ role: { $in: ["guide", "lead-guide"] } });
  res.status(200).json({ status: "SUCCESS", data: { guides } });
});

//* Using Factory Handler ******************************************

exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getById(User);
exports.updateUserById = factory.updateById(User, [
  "name",
  "email",
  "phone",
  "photo",
]);
exports.deleteUserById = factory.deleteById(User);
