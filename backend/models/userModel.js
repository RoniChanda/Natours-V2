const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//* userSchema *****************************************************

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email ID"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email ID"],
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    default: "local",
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    validate: {
      validator: function (val) {
        return validator.isMobilePhone(val, "any", { strictMode: true });
      },
      message: "Please provide a valid phone number",
    },
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "A password must have minimum of 8 characters"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords don't match",
    },
  },
  passwordChangedAt: Date,
  passwordChecked: Boolean,
  photo: {
    type: String,
    default: process.env.USER_DEFAULT_IMAGE,
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin", "guide", "lead-guide"],
      message: "Role can be - user, admin, guide and lead-guide only",
    },
  },
  refreshTokens: [
    {
      token: String,
      expiresIn: {
        type: Date,
        default: Date.now() + process.env.REFRESH_EXPIRES_IN * 1,
      },
    },
  ],
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  verificationCodeExpires: Date,
  verificationCodeChecked: Boolean,
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//* Pre Middlewares ************************************************

// Encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Unverify email/phone if updated
userSchema.pre("save", function (next) {
  if (this.isModified("email") && this.provider === "local")
    this.emailVerified = false;
  if (this.isModified("phone")) this.phoneVerified = false;
  next();
});

// Update passwordChangedAt property on password update
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  // 1sec delay - passwordChangedAt timestamp is always before jwtTimeStamp
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//* Instance Methods ***********************************************

// Compare password
userSchema.methods.comparePassword = async function (
  givenPassword,
  hashedPassword
) {
  return await bcrypt.compare(givenPassword, hashedPassword);
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changedTimeStamp > jwtTimeStamp;
  }
  return false;
};

// Create verification code for (type-link/code)
userSchema.methods.createVerificationCode = function (type) {
  const bytes = type === "link" ? 32 : 3;
  const code = crypto.randomBytes(bytes).toString("hex");

  this.verificationCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  this.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return code;
};

//* Model **********************************************************

const User = mongoose.model("User", userSchema);
module.exports = User;
