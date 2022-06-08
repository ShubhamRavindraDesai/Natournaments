const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name "],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide valid email address"],
  },
  photo: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "lead"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  confirmPassword: {
    type: String,
    required: [true, "please provide confirm password"],
    validate: {
      validator: function (el) {
        // this only works on create and save
        return el === this.password;
      },
      message: "password are not the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete confirmPassword field
  this.confirmPassword = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
// adding method to create a random token for password reset middeleware

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const d = new Date();
  const t = -d.getTimezoneOffset() + 10; // Difference between your current time and UTC + 10min

  this.passwordResetExpires = Date.now() + t * 60 * 1000;

  console.log(
    { resetToken },
    this.passwordResetExpires,
    this.passwordResetToken
  );
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
