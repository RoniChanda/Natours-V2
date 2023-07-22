const crypto = require("crypto");

const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const sendSMS = require("../utils/mobileSMS");
const { createTokensAndCookies } = require("../utils/tokensAndCookies");
const Tour = require("../models/tourModel");

//* Create and send tokens *****************************************

exports.sendTokensAndCookies = async (
  req,
  res,
  user,
  statusCode,
  redirectUrl
) => {
  if (req.cookies?.refresh) {
    // If any cookie => remove it from DB
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== req.cookies.refresh
    );

    // Reuse detection
    const foundToken = await User.findOne({
      "refreshTokens.token": req.cookies.refresh,
    });
    if (!foundToken) user.refreshTokens = [];
  }

  const accessToken = await createTokensAndCookies(user, res);

  if (user.provider === "local") {
    res.status(statusCode).json({
      status: "SUCCESS",
      accessToken,
    });
  } else {
    res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}?status=success`);
  }
};

//* Delete expired refresh tokens **********************************

exports.deleteExpiredTokens = async (user) => {
  user.refreshTokens = user.refreshTokens.filter(
    (rt) => rt.expiresIn.getTime() > Date.now()
  );
};

//* create and send verification code ******************************

exports.createAndSendVerificationCode = async (
  res,
  next,
  user,
  type,
  medium
) => {
  const resetCode = user.createVerificationCode(type);

  try {
    // send token to user's mail/phone
    if (medium === "email" && type === "link") {
      const resetURL = `${process.env.FRONTEND_URL}/passwordReset/${resetCode}`;
      await new Email(user, resetURL).sendPasswordReset();
    } else if (medium === "email" && type === "code") {
      await new Email(user, resetCode).sendVerificationCode();
    } else if (medium === "phone" && type === "code") {
      await sendSMS(resetCode, user.phone);
    } else {
      throw new AppError(
        "Please choose a valid way - email(link/code) or phone(code) only!",
        400
      );
    }

    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json({ status: "SUCCESS", message: `Code sent to your ${medium}!` });
  } catch (error) {
    console.error("Error:", error);

    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        `Error sending verification code to your ${medium}. Try again later!`,
        500
      )
    );
  }
};

//* Verify code ****************************************************

exports.verifyCode = async (code, next) => {
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
  const user = await User.findOne({
    verificationCode: hashedCode,
    verificationCodeExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Invalid Code or code has expired.", 400));
  }

  return user;
};

//* change password ************************************************

exports.changePassword = async (req, res, user) => {
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  user.verificationCodeChecked = undefined;
  await user.save();

  res.status(200).json({ status: "SUCCESS" });
};

//* filter req.body ************************************************

exports.filterObj = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

//* create booking checkout ****************************************

exports.createBookingCheckout = async (session) => {
  const data = session.lines.data[0];
  const tour = await Tour.findOne({ name: data.description });
  const user = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_paid / 100;
  const tickets = data.quantity;
  const { tourStartDate } = session.metadata;
  const receipt = session.hosted_invoice_url;
  const { payment_intent } = session;

  let status;
  if (session.status === "paid") {
    status = "paid";
  } else {
    status = "pending";
  }

  const booking = await Booking.create({
    tour: tour._id,
    user,
    price,
    tickets,
    tourStartDate,
    receipt,
    status,
    payment_intent,
  });

  tour.startDates.find(
    (el) => el.dateValue.getTime() === booking.tourStartDate.getTime()
  ).participants = tickets;

  await tour.save();
};
