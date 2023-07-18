const express = require("express");

const tourControllers = require("../controllers/tourControllers");
const reviewControllers = require("../controllers/reviewControllers");
const authMiddlewares = require("../middlewares/authMiddlewares");
const uploadMiddlewares = require("../middlewares/uploadMiddlewares");

const router = express.Router();

router.use("/:tourId/reviews", reviewControllers.getTourReviews);

// Get tours - business specific
router.get(
  "/top-5-cheap",
  tourControllers.aliasTopTour,
  tourControllers.getAllTours
);
router.get("/tour-stats", tourControllers.getTourStats);
router.get(
  "/monthly-plan/:year",
  authMiddlewares.protect,
  authMiddlewares.restrictTo("admin", "lead-guide", "guide"),
  tourControllers.getMonthlyPlan
);

// Get tours - distance specific
router.get(
  "/tours-within/:distance/center/:latlng/unit/:unit",
  tourControllers.getToursWithin
);
router.get("/distances/:latlng/unit/:unit", tourControllers.getDistances);

// Tours - get all, create one
router
  .route("/")
  .get(tourControllers.getAllTours)
  .post(
    authMiddlewares.protect,
    authMiddlewares.restrictTo("admin", "lead-guide"),
    uploadMiddlewares.uploadTourPhotos,
    uploadMiddlewares.resizeTourPhotos,
    tourControllers.parseData,
    tourControllers.createTour
  );

// Tours - get, update, delete one
router
  .route("/:id")
  .get(tourControllers.getTourById)
  .patch(
    authMiddlewares.protect,
    authMiddlewares.restrictTo("admin", "lead-guide"),
    uploadMiddlewares.uploadTourPhotos,
    uploadMiddlewares.resizeTourPhotos,
    tourControllers.parseData,
    tourControllers.updateTourById
  )
  .delete(
    authMiddlewares.protect,
    authMiddlewares.restrictTo("admin", "lead-guide"),
    tourControllers.deleteTourById
  );

module.exports = router;
