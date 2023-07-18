const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

const {
  sendTokensAndCookies,
  deleteExpiredTokens,
  verifyCode,
  changePassword,
  createAndSendVerificationCode,
} = require("../helperFunctions");
const { removeCookies } = require("../../utils/tokensAndCookies");

//* Controllers ****************************************************
//* Sign up ********************************************************

exports.signup = catchAsync(async (req, res) => {
  const { name, email, phone, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    phone,
    password,
    passwordConfirm,
  });

  sendTokensAndCookies(req, res, user, 201);
});

//* Log in *********************************************************

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide both email and password.", 400));
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Invalid Credentials!", 401));
  }

  deleteExpiredTokens(user);
  if (user.twoFactorEnabled) {
    user.passwordChecked = true;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({ status: "SUCCESS", userId: user._id });
  }

  sendTokensAndCookies(req, res, user, 200);
});

//* Log in with google *********************************************

exports.loginWithGoogle = async (req, res) => {
  try {
    const redirectUrl = req.query.state;
    const { name, email, picture, email_verified } = req.user._json;
    const body = {
      name,
      photo: picture,
      email,
      provider: "Google",
      // eslint-disable-next-line camelcase
      emailVerified: email_verified,
      phoneVerified: undefined,
    };

    // create or update user
    let user = await User.findOne({ email });
    if (user) {
      user.set(body);
    } else {
      user = new User(body);
    }
    await user.save({ validateBeforeSave: false });

    deleteExpiredTokens(user);
    sendTokensAndCookies(req, res, user, 200, redirectUrl);
  } catch (err) {
    console.error("Error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  }
};

//* Log out ********************************************************

exports.logout = catchAsync(async (req, res) => {
  if (req.cookies?.refresh) {
    const user = await User.findOne({
      "refreshTokens.token": req.cookies.refresh,
    });
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== req.cookies.refresh
      );
      await user.save({ validateBeforeSave: false });
    }
  }

  removeCookies(res);
  res.status(200).json({ status: "SUCCESS" });
});

//* Forgot Password ************************************************

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email, type, medium } = req.body;

  // Get user with the provided email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Please provide a valid email Id!", 404));
  }
  if (user.provider !== "local") {
    return next(new AppError(`Login using ${user.provider}!`, 400));
  }

  await createAndSendVerificationCode(res, next, user, type, medium);
});

//* Reset Password using link **************************************

exports.resetPasswordUsingLink = catchAsync(async (req, res, next) => {
  const user = await verifyCode(req.body.code, next);
  if (user) await changePassword(req, res, user);
});

//* Reset Password Code verification *******************************

exports.resetPasswordCodeVerification = catchAsync(async (req, res, next) => {
  const user = await verifyCode(req.body.code, next);

  user.verificationCodeChecked = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: "SUCCESS", userId: user._id });
});

//* Reset password using code **************************************

exports.resetPasswordUsingCode = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  if (
    !user?.verificationCodeChecked ||
    user?.verificationCodeExpires.getTime() < Date.now()
  ) {
    return next(new AppError("Time expired or code not verified!", 400));
  }

  await changePassword(req, res, user);
});
