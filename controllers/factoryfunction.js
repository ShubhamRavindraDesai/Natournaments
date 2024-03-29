const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No tournament found with that id", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

