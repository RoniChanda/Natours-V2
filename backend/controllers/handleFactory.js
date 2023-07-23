const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const { filterObj } = require("./helperFunctions");

//* Get model name *************************************************

const modelName = (Model) => Model.collection.modelName.toLowerCase();

//* Factory functions **********************************************
//* Get All docs ***************************************************

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // Search Box functionality
    const filter = req.query.keyword
      ? {
          $or: [
            {
              name: {
                $regex: req.query.keyword,
                $options: "i",
              },
            },
            {
              summary: {
                $regex: req.query.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    let select;
    if (modelName(Model) === "user") {
      select =
        "-password -passwordChangedAt -refreshTokens -twoFactorSecret -verificationCode -verificationCodeExpires -verificationCodeChecked";
    }

    // Filter, sort, limiting
    const features = new APIFeatures(
      Model.find(filter).select(select).populate(popOptions),
      req.query
    )
      .filter()
      .sort()
      .limitFields();

    const docs = await features.query;

    // Paginate
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const limitedDocs = docs.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      status: "SUCCESS",
      total: docs.length,
      results: limitedDocs.length,
      data: {
        [`${modelName(Model)}s`]: limitedDocs,
      },
    });
  });

//* Get doc By Id **************************************************

exports.getById = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let select;
    if (modelName(Model) === "user") {
      select =
        "-password -passwordChangedAt -refreshTokens -twoFactorSecret -verificationCode -verificationCodeExpires -verificationCodeChecked";
    }

    const doc = await Model.findById(req.params.id)
      .select(select)
      .populate(popOptions);

    if (!doc) {
      return next(
        new AppError(`No ${modelName(Model)} found with the provided ID`, 404)
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        [modelName(Model)]: doc,
      },
    });
  });

//* Create doc *****************************************************

exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = new Model(req.body);
    await doc.save({ validateBeforeSave: false });
    res.status(201).json({ status: "SUCCESS" });
  });

//* Update doc By Id ***********************************************

exports.updateById = (Model, allowedFields) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(
        new AppError(`No ${modelName(Model)} found with the provided ID`, 404)
      );
    }

    const filteredBody = allowedFields
      ? filterObj(req.body, allowedFields)
      : req.body;

    doc.set(filteredBody);
    await doc.save({ validateModifiedOnly: true });

    res.status(200).json({ status: "SUCCESS" });
  });

//* Delete doc By Id ***********************************************

exports.deleteById = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No ${modelName(Model)} found with the provided ID`, 404)
      );
    }

    res.status(204).json({
      status: "SUCCESS",
      data: null,
    });
  });
