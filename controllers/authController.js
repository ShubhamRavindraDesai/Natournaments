const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEMail = require('./../utils/email');
const { strict } = require('assert');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'sucess',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exists

  if (!email || !password) {
    return next(new AppError('please provide a email and password', 400));
  }

  // check user is exits
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('please enter correct email and password', 401));
  }

  // if everything is ok send token in resposne
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // getting the token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('you are not loged in please log in get access', 401)
    );
  }
  // verifing the token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // cheking if user still exist

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    const message = 'user belonging to this token does not exist';
    return next(new AppError(message, 401));
  }

  // check if user recently changed his password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'you have changed your password recently please log in again',
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you dont have permission to perfrom this action', 403)
      );
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // getting the user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        'please enter email or there is no user with the provided id please try again',
        404
      )
    );
  }
  // generate a randam token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // send email with nodemailer with reset token

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forget your password? Submit new PATCH request with new password and new passwordConfirm to:${resetURL}\n if you didn't forget your password, please ignore this email`;

  try {
    await sendEMail({
      email: user.email,
      subject: 'your password reset token(valid for 10 min',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'token send to your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('unable to send email, please try again later', 500)
    );
  }
});

exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const d = new Date();
  const time = Date.now() + d.getTimezoneOffset();
  //if there is any user with the hashedtoken
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: time },
  });

  // check the token is valid or not expired change the password / passwordResetToken and passwordResetTokenExpired chenge to undefined
  if (!user) {
    return next(
      new AppError('token is expired or invalid please try again', 400)
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = time - 1000;
  await user.save();

  createSendToken(user, 200, res);
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user.correctPassword(req.body.currentpassword, user.password)) {
    return next(new (AppError('please enter the correct Password', 401))());
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  createSendToken(user, 200, res);
});
