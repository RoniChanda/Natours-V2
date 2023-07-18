const express = require("express");

const bookingControllers = require("../controllers/bookingControllers");
const authMiddlewares = require("../middlewares/authMiddlewares");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:bookingId/review", reviewRouter); //* review related to booking *//

router.use(authMiddlewares.protect); //* Protect *//

// Bookings - create checkout session
router.post(
  "/checkout-session/:tourId",
  authMiddlewares.verified,
  bookingControllers.createCheckoutSession
);

// My bookings - get, cancel
router.get("/me", bookingControllers.getMyBookings);
router.patch("/me/:bookingId", bookingControllers.cancelMyBooking);

router.use(authMiddlewares.restrictTo("admin", "lead-guide")); //* Restrict *//

router.patch("/:bookingId/cancel", bookingControllers.cancelBookingById);

// Bookings - get all, create one
router
  .route("/")
  .get(bookingControllers.getAllBookings)
  .post(bookingControllers.createBooking); // create by (admin,lead-guide) for cash payments

// Bookings - get, update, delete one
router
  .route("/:id")
  .get(bookingControllers.getBookingById)
  .patch(bookingControllers.updateBookingById)
  .delete(bookingControllers.deleteBookingById);

module.exports = router;
