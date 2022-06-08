const User = require("./../models/usermodel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedfields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet difined",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet difined",
  });
};

exports.updateMe = async (req, res, next) => {
  // cheking if user try to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "for update password please try the updatepassword route",
        400
      )
    );
  }

  // update the user data
  const filterBody = filterObj(req.body, "email", "name");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteMe = catchAsync(async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active : false})

  res.status(204).json({
    status: "success",
    data: null
  })
})

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet difined",
  });
};

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
