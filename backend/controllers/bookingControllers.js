const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const factory = require("./handleFactory");
const { createBookingCheckout } = require("./helperFunctions");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

//* Controllers ****************************************************
//* Create checkout Session and redirect ***************************

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const { date, tickets } = req.body;
  const { tourId } = req.params;

  if (!date) {
    return next(new AppError("Please choose a date to book tickets!", 400));
  }

  // check if user already has active booking of a tour for certain date
  const booking = await Booking.findOne({
    tour: tourId,
    user: req.user._id,
    tourStartDate: date,
  });
  if (booking?.status === "pending" || booking?.status === "paid") {
    return next(new AppError("User can book only once per tour date!", 400));
  }

  // Check if tickets are available or not
  const tour = await Tour.findById(tourId);
  const dateObj = tour.startDates.find(
    (el) => el.dateValue.getTime() === new Date(date).getTime()
  );
  const ticketsAvailable = tour.maxGroupSize - dateObj.participants;
  if (tickets > ticketsAvailable) {
    return next(
      new AppError(
        `Only ${ticketsAvailable} tickets are available for this tour`,
        400
      )
    );
  }

  const price = tour.priceDiscount
    ? tour.price - tour.priceDiscount
    : tour.price;

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/me/bookings?status=success`,
    cancel_url: `${process.env.FRONTEND_URL}/tours/${tour._id}?status=failed`,
    mode: "payment",
    customer_email: req.user.email,
    line_items: [
      {
        quantity: tickets,
        price_data: {
          currency: "usd",
          unit_amount: price * 100,
          product_data: {
            name: `${tour.name}`,
            description: tour.summary,
            images: [tour.imageCover], // Need images that are already in internet
          },
        },
      },
    ],
    invoice_creation: {
      enabled: true,
      invoice_data: {
        metadata: {
          tourStartDate: date,
        },
      },
    },
  });

  // send session
  res.status(200).json({ status: "SUCCESS", session });
});

//* Webhook checkout ***********************************************

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "invoice.payment_succeeded") {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
});

//* Get My Bookings ************************************************

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Booking.find({ user: req.user._id }).populate({
      path: "review",
      select: "-booking -tour",
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();

  const bookings = await features.query;

  // Update status of payment if refunded
  await Promise.all(
    bookings.map(async (el) => {
      if (el.refund && el.status === "canceled") {
        const refund = await stripe.refunds.retrieve(el.refund);
        if (refund.status === "succeeded") {
          el.status = "refunded";
          el.refund = undefined;
          await el.save();
        }
      }
    })
  );

  // Paginate
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const limitedBookings = bookings.slice((page - 1) * limit, page * limit);

  res.status(200).json({
    status: "SUCCESS",
    total: bookings.length,
    results: limitedBookings.length,
    data: {
      bookings: limitedBookings,
    },
  });
});

//* Cancel My Booking ***********************************************

exports.cancelMyBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.user._id,
  }).select("+payment_intent");
  if (!booking) {
    return next(new AppError("Booking not found!", 404));
  }

  if (booking.status === "canceled" || booking.status === "refunded") {
    return next(new AppError("Booking already canceled!", 400));
  }

  // calculate the number of days remaining
  const daysRemaining = Math.ceil(
    (booking.tourStartDate.getTime() - booking.createdAt.getTime()) /
      (24 * 60 * 60 * 1000)
  );

  if (daysRemaining <= 0) {
    return next(
      new AppError("Invalid request. Booking cancellation failed!", 400)
    );
  }
  if (daysRemaining >= process.env.REFUND_DAYS) {
    const refund = await stripe.refunds.create({
      payment_intent: booking.payment_intent,
    });
    if (refund) booking.refund = refund.id;
  }

  booking.status = "canceled";
  await booking.save();

  const tour = await Tour.findById(booking.tour);
  tour.startDates.find(
    (el) => el.dateValue.getTime() === booking.tourStartDate.getTime()
  ).participants -= booking.tickets;
  await tour.save();

  res.status(200).json({ status: "SUCCESS" });
});

//* Cancel Booking (admin, lead-guide) *****************************

exports.cancelBookingById = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.body.userId,
  });
  if (!booking) {
    return next(new AppError("Booking not found!", 404));
  }

  if (booking.status === "canceled" || booking.status === "refunded") {
    return next(new AppError("Booking already canceled!", 400));
  }

  const refund = await stripe.refunds.create({
    payment_intent: booking.payment_intent,
  });
  if (refund) booking.refund = refund.id;

  booking.status = "canceled";
  await booking.save();

  if (booking.tourStartDate.getTime() > Date.now()) {
    const tour = await Tour.findById(booking.tour);
    tour.startDates.find(
      (el) => el.dateValue.getTime() === booking.tourStartDate.getTime()
    ).participants -= booking.tickets;
    await tour.save();
  }

  res.status(200).json({ status: "SUCCESS" });
});

//* Using Factory Handler ******************************************

exports.createBooking = factory.create(Booking);
exports.getAllBookings = factory.getAll(Booking, {
  path: "user",
  select: "name photo",
});
exports.getBookingById = factory.getById(Booking);
exports.updateBookingById = factory.updateById(Booking);
exports.deleteBookingById = factory.deleteById(Booking);
