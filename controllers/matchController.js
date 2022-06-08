const Match = require("./../models/matchmodel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const factory = require("./factoryfunction");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const filename = file.originalname;
    cb(null, `${filename}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(err, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadMatchImage = upload.single("image");

exports.getAllMatches = catchAsync(async (req, res, next) => {
  const matches = await Match.find(req.query);
  res.status(200).json({
    status: "success",
    result: matches.length,
    data: {
      matches,
    },
  });
});

exports.getMatch = catchAsync(async (req, res, next) => {
  const match = await Match.findById(req.params.id);

  if (!match) {
    return next(new AppError("No tournament found with that id", 404));
  }
  res.status(200).json({
    status: "success",

    data: {
      match,
    },
  });
});

exports.updateMatch = catchAsync(async (req, res, next) => {
  const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!match) {
    return next(new AppError("No tournament found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      match,
    },
  });
});

exports.deleteMatch = factory.deleteOne(Match);

// exports.deleteMatch = catchAsync(async (req, res, next) => {
//   const match = await Match.findByIdAndDelete(req.params.id);
//   if (!match) {
//     return next(new AppError("No tournament found with that id", 404));
//   }
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

exports.createMatch = catchAsync(async (req, res, next) => {
  // console.log(req.file)
  // console.log(req.body)
  // const bodyObj = req.body
  // req.body.image = req.file.filename
  const newMatch = await Match.create(req.body);

  if (!newMatch) {
    return next(new AppError("No tournament found with that id", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      match: newMatch,
    },
  });
});
