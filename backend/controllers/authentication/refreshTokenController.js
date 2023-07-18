const jwt = require("jsonwebtoken");

const User = require("../../models/userModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const {
  createTokensAndCookies,
  removeCookies,
} = require("../../utils/tokensAndCookies");

//* Re-use Detection ***********************************************

const resuseDetection = async (refreshToken, next) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return next(new AppError("Invalid token!", 401));
  }

  // Find hacked user and remove all refresh tokens
  const hackedUser = await User.findById(decodedToken?.id);
  if (hackedUser) {
    hackedUser.refreshTokens = [];
    await hackedUser.save({ validateBeforeSave: false });
  }
};

//* Refresh Access Token *******************************************

module.exports = catchAsync(async (req, res, next) => {
  // check refresh cookie exists
  const refreshToken = req.cookies?.refresh;
  removeCookies(res);

  if (!refreshToken) return next(new AppError("Token not found!", 401));

  // find user having refresh token
  const user = await User.findOne({
    "refreshTokens.token": refreshToken,
  });

  if (!user) {
    // user not found => refresh token reuse detected
    await resuseDetection(refreshToken, next);
    return next(new AppError("User not found!", 401));
  }

  user.refreshTokens = user.refreshTokens.filter(
    (rt) => rt.token !== refreshToken
  );

  // verify token
  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Invalid token!", 401));
  }

  // Match the payload
  if (decodedToken?.id !== user._id.toString()) {
    return next(new AppError("Invalid token!", 401));
  }

  // Check if user changed password after refreshToken was issued
  if (user.changedPasswordAfter(decodedToken.iat)) {
    return next(new AppError("User recently changed password!", 401));
  }

  // issue both access and refresh tokens
  const accessToken = await createTokensAndCookies(user, res);
  res.status(200).json({ status: "SUCCESS", accessToken });
});
