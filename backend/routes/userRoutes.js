const express = require("express");

const userControllers = require("../controllers/userControllers");
const authMiddlewares = require("../middlewares/authMiddlewares");
const uploadMiddlewares = require("../middlewares/uploadMiddlewares");

const router = express.Router();

//* User Specific Routes *******************************************

router.use(authMiddlewares.protect); //* Protect *//

// verify email or phone
router.post("/send-verificationCode", userControllers.sendVerificationCode);
router.post("/verify/email-or-phone", userControllers.verifyEmailOrPhone);

// user - get, update, deactivate, delete
router.patch(
  "/update-my-password",
  authMiddlewares.providerLocal,
  userControllers.updateMyPassword
);
router
  .route("/me")
  .get(userControllers.getUserId, userControllers.getUserById)
  .patch(
    authMiddlewares.providerLocal,
    userControllers.getUserId,
    uploadMiddlewares.uploadUserPhoto,
    uploadMiddlewares.resizeUserPhoto,
    userControllers.addPhotoToBody,
    userControllers.updateUserById
  )
  .delete(
    userControllers.getUserId,
    userControllers.removeCookiesOfUser,
    userControllers.deleteAllData,
    userControllers.deleteUserById
  );
router.patch("/deactivate", userControllers.deactivateMe);

router.get(
  "/guides",
  authMiddlewares.restrictTo("admin", "lead-guide"),
  userControllers.getGuides
);

//* Routes only for admin ******************************************

router.use(authMiddlewares.restrictTo("admin")); //* Restrict *//

// user - get, update, delete
router.route("/").get(userControllers.getAllUsers);
router
  .route("/:id")
  .get(userControllers.getUserById)
  .patch(
    authMiddlewares.providerLocal,
    uploadMiddlewares.uploadUserPhoto,
    uploadMiddlewares.resizeUserPhoto,
    userControllers.addPhotoToBody,
    userControllers.updateUserById
  )
  .delete(userControllers.deleteAllData, userControllers.deleteUserById);

module.exports = router;
