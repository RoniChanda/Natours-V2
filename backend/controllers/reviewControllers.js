const jwt = require("jsonwebtoken");

const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");
const factory = require("./handleFactory");
const AppError = require("../utils/appError");
const Tour = require("../models/tourModel");
const Feedback = require("../models/feedbackModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");

//* Helping Middlewares ********************************************

// can Review
exports.canReview = async (req, res, next) => {
  const { bookingId } = req.params;

  // Check if the booking is active(paid) or not
  const foundBooking = await Booking.findOne({
    _id: bookingId,
    user: req.user._id,
  });
  if (foundBooking?.status !== "paid") {
    return next(new AppError("No active booking found!", 404));
  }

  // Check if tour ended or not
  const foundTour = await Tour.findById(foundBooking.tour);
  const tourEndsIn =
    foundBooking.tourStartDate.getTime() +
    foundTour.duration * 24 * 60 * 60 * 1000;
  if (Date.now() <= tourEndsIn) {
    return next(
      new AppError("A tour can be reviewed only after visiting the tour!", 400)
    );
  }

  // ids added to req.body for factory handler
  req.body.booking = bookingId;
  req.body.tour = foundBooking.tour;
  req.body.user = req.user._id;
  next();
};

// delete feedbacks for deleted review
exports.deleteFeedbacks = catchAsync(async (req, res, next) => {
  const review = req.params.id;
  await Feedback.deleteMany({ review });
  next();
});

//* Controllers ****************************************************

exports.getTourReviews = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  // get user if logged in
  let user;
  if (req.cookies?.access) {
    const decodedToken = jwt.verify(
      req.cookies.access,
      process.env.ACCESS_TOKEN_SECRET
    );

    user = await User.findById(decodedToken?.id);
  }

  // populate feedbacks of the user
  const populate = user && {
    path: "userFeedback",
    match: { user: user._id },
  };

  const features = new APIFeatures(
    Review.find({ tour: tourId }).populate(populate),
    req.query
  ).filter();

  const reviews = await features.query;

  // filter out inactive users
  const filteredReviews = reviews.filter((el) => el.user.active);

  res.status(200).json({
    status: "SUCCESS",
    total: filteredReviews.length,
    data: { reviews: filteredReviews },
  });
});

//* Using Factory Handler ******************************************

exports.getAllReviews = factory.getAll(Review, {
  path: "tour",
  select: "name imageCover",
});
exports.createReview = factory.create(Review);
exports.getReviewById = factory.getById(Review);
exports.updateReviewById = factory.updateById(Review, ["rating", "review"]);
exports.deleteReviewById = factory.deleteById(Review);
