const Feedback = require("../models/feedbackModel");
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

//* user feedback **************************************************

exports.userFeedback = catchAsync(async (req, res, next) => {
  const { feedback } = req.body;
  const { reviewId } = req.params;
  const userId = req.user._id;

  const userFeedback = await Feedback.findOne({
    review: reviewId,
    user: userId,
  });

  // create or update or delete feedback
  if (feedback) {
    if (!userFeedback) {
      await Feedback.create({ review: reviewId, user: userId, feedback });
    } else {
      userFeedback.feedback = feedback;
      await userFeedback.save();
    }
  } else {
    await Feedback.findByIdAndDelete(userFeedback._id);
  }

  // update likeCount in review model
  const likeCount = await Feedback.where({
    review: reviewId,
    feedback: { $eq: "like" },
  }).countDocuments();

  await Review.findByIdAndUpdate(reviewId, { likeCount });

  res.status(200).json({ status: "SUCCESS" });
});
