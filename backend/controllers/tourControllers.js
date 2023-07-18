const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");

//* Helping Middlewares ********************************************

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.parseData = (req, res, next) => {
  req.body.startLocation = JSON.parse(req.body.startLocation);

  if (typeof req.body.locations === "string") {
    req.body.locations = [JSON.parse(req.body.locations)];
  } else {
    req.body.locations = req.body.locations.map((el) => JSON.parse(el));
  }

  if (typeof req.body.startDates === "string") {
    req.body.startDates = [JSON.parse(req.body.startDates)];
  } else {
    req.body.startDates = req.body.startDates.map((el) => JSON.parse(el));
  }

  next();
};

//* Controllers ****************************************************
//* Using Factory Handler ******************************************

exports.getAllTours = factory.getAll(Tour);
exports.getTourById = factory.getById(Tour, { path: "reviews" });
exports.createTour = factory.create(Tour);
exports.updateTourById = factory.updateById(Tour);
exports.deleteTourById = factory.deleteById(Tour);

//* Get Tour Stats *************************************************

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "SUCCESS",
    data: {
      stats,
    },
  });
});

//* Get Monthly Plan ***********************************************

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);
  if (Number.isNaN(year) || req.params.year.length !== 4) {
    return next(new AppError("Year is not valid", 404));
  }

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        "startDates.dateValue": {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates.dateValue" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "SUCCESS",
    data: {
      plan,
    },
  });
});

//* Get Tours within mentioned distance ****************************

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format: lat,lng",
        400
      )
    );
  }
  if (!["km", "mi"].includes(unit)) {
    return next(new AppError("Unit must be either km or mi", 400));
  }

  // radius in radians
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[Number(lng), Number(lat)], Number(radius)],
      },
    },
  });

  res.status(200).json({
    status: "SUCCESS",
    results: tours.length,
    data: {
      tours,
    },
  });
});

//* Get Distances to Tours from Point ******************************

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format: lat,lng",
        400
      )
    );
  }
  if (!["km", "mi"].includes(unit)) {
    return next(new AppError("Unit must be either km or mi", 400));
  }

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        distanceField: "distance", // output in meter
        distanceMultiplier: multiplier, // conversion in km or mi
      },
    },
    {
      $project: { distance: 1, name: 1 },
    },
  ]);

  res.status(200).json({
    status: "SUCCESS",
    data: {
      distances,
    },
  });
});
