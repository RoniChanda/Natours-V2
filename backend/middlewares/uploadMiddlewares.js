const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//* Multer Configuration *******************************************

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload images only.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

//* cloudinary Configuration ***************************************

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//* cloudinary Upload **********************************************

const cloudinaryUpload = async (buffer, filename, next, type) =>
  new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `natours-${type}`,
          public_id: filename,
        },
        (error, result) => {
          if (error) {
            return next(new AppError("Error uploading image", 500));
          }
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });

//* Middlewares ****************************************************
//* Upload user photo **********************************************

exports.uploadUserPhoto = upload.single("photo");

//* Resize user photo **********************************************

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (req.file?.fieldname !== "photo") return next();

  const resizedImageBuffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  req.photo = await cloudinaryUpload(
    resizedImageBuffer,
    `user-${req.params.id}-${Date.now()}`,
    next,
    "users"
  );

  next();
});

//* Upload tour photos *********************************************

exports.uploadTourPhotos = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

//* Resize tour photos *********************************************

exports.resizeTourPhotos = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // Cover Image resizing
  if (req.files.imageCover) {
    const resizedImageCoverBuffer = await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    req.body.imageCover = await cloudinaryUpload(
      resizedImageCoverBuffer,
      `tour-${req.params.id}-${Date.now()}-cover`,
      next,
      "tours"
    );
  }

  // Tour images resizing
  if (req.files.images) {
    if (!req.body.images) req.body.images = [];
    if (typeof req.body.images === "string")
      req.body.images = [req.body.images];

    await Promise.all(
      req.files.images.map(async (file, index) => {
        const image = await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        req.body.images.push(
          await cloudinaryUpload(
            image,
            `tour-${req.params.id}-${Date.now()}-${index + 1}`,
            next,
            "tours"
          )
        );
      })
    );
  }

  next();
});
