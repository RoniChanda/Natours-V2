const express = require("express");
const passport = require("passport");

const authControllers = require("../controllers/authentication/authControllers");
const refreshAccessToken = require("../controllers/authentication/refreshTokenController");
const twoFactorControllers = require("../controllers/authentication/twoFactorControllers");
const authMiddlewares = require("../middlewares/authMiddlewares");

const router = express.Router();

//* Local signup/login *********************************************

router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);

//* Google login ***************************************************

router.get("/google", (req, res) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: req.query.redirect,
  })(req, res);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    failureFlash: "Invalid Google credentials.",
  }),
  authControllers.loginWithGoogle
);

//* 2FA authentication *********************************************

// enable, disable, verify
router.post(
  "/enable2FA",
  authMiddlewares.protect,
  authMiddlewares.verified,
  twoFactorControllers.enable2FA
);
router.post(
  "/verify2FA",
  authMiddlewares.protect,
  twoFactorControllers.verify2FA
);
router.post(
  "/disable2FA",
  authMiddlewares.protect,
  twoFactorControllers.disable2FA
);

// validate using authenticator
router.post(
  "/validate2FA/authenticator",
  twoFactorControllers.validate2FAUsingAuthenticator
);

// validate using email or phone
router.post(
  "/sendCode2FA/email-or-phone",
  twoFactorControllers.send2FACodeForEmailOrPhone
);
router.post(
  "/validate2FA/email-or-phone",
  twoFactorControllers.validate2FACodeUsingEmailOrPhone
);

//* Both for local and other providers *****************************

router.get("/refresh", refreshAccessToken);
router.patch("/logout", authControllers.logout);

//* Forgot/Reset password ******************************************

router.post("/forgot-password", authControllers.forgotPassword);

// Reset password using link in email
router.patch(
  "/reset-password-link/reset",
  authControllers.resetPasswordUsingLink
);

// Reset password using code in email or phone
router.post(
  "/reset-password-code/verify",
  authControllers.resetPasswordCodeVerification
);
router.patch(
  "/reset-password-code/reset",
  authControllers.resetPasswordUsingCode
);

module.exports = router;
