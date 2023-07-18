const mongoose = require("mongoose");
const slugify = require("slugify");

//* tourSchema *****************************************************

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxLength: [
        40,
        "A tour name must have less than or equal to 40 characters",
      ],
      minLength: [
        10,
        "A tour name must have greater than or equal to 10 characters",
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty can be easy, medium and difficult only",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    reviewsCount: [
      {
        star: Number,
        total: Number,
      },
    ],
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // "this" only points to current doc on New document creation.
        // so it will not work for update operation
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [
      {
        dateValue: Date,
        participants: {
          type: Number,
          default: 0,
        },
      },
    ],
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//* Indexes ********************************************************

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: "2dsphere" });

//* Virtuals *******************************************************

// add virtual field - durationWeeks
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// add discount percentage
tourSchema.virtual("discountPercent").get(function () {
  if (!this.priceDiscount) return;

  return (this.priceDiscount / this.price) * 100;
});

// virtual populate reviews
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
  limit: 5,
});

//* Pre Middlewares ************************************************

// Slugify (document Middleware)
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Hide Secret Tours (query Middleware)
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Populate guides field (query Middleware)
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "name photo role",
  });
  next();
});

// Hide Secret Tours (aggregation Middleware)
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

//* Model **********************************************************

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
