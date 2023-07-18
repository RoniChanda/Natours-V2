const express = require("express");

const reviewControllers = require("../controllers/reviewControllers");
const feedbackControllers = require("../controllers/feedbackControllers");
const authMiddlewares = require("../middlewares/authMiddlewares");

const router = express.Router({ mergeParams: true }); //* for bookingId *//

// Reviews - get all, create one
router
  .route("/")
  .get(reviewControllers.getAllReviews)
  .post(
    authMiddlewares.protect,
    authMiddlewares.restrictTo("user"),
    reviewControllers.canReview,
    reviewControllers.createReview
  );

router.use(authMiddlewares.protect); //* Protect *//

// user feedback on review
router.patch(
  "/:reviewId/feedback",
  authMiddlewares.restrictTo("user"),
  feedbackControllers.userFeedback
);

// Reviews - get, update, delete one
router
  .route("/:id")
  .get(reviewControllers.getReviewById)
  .patch(
    authMiddlewares.restrictTo("user", "admin"),
    reviewControllers.updateReviewById
  )
  .delete(
    authMiddlewares.restrictTo("user", "admin"),
    reviewControllers.deleteFeedbacks,
    reviewControllers.deleteReviewById
  );

module.exports = router;
