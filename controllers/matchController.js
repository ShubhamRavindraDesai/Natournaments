const Match = require('./../models/matchmodel')
const catchAsync = require('./../utils/catchAsync')
const multer = require('multer')

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    const filename = file.originalname
    cb(null,`${filename}`)
  }
})

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(err, false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})


exports.uploadMatchImage = upload.single('image')

exports.getAllMatches = catchAsync(async (req, res, next) => {
  console.log(req.query)
  const matches = await Match.find(req.query);
  res.status(200).json({
    status: 'success',
    result: matches.length,
    data: {
      matches
    }
  });
});

exports.getMatch = catchAsync(async (req, res, next) => {
  const match = await Match.findById(req.params.id) ;
  res.status(200).json({
    status: 'success',
    
    data: {
      match
    }
  })
})

exports.updateMatch = catchAsync(async (req, res, next) => {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
  res.status(200).json({
    status: 'success',
    data: {
      match
    }
  });
})
exports.deleteMatch = catchAsync(async (req, res, next) => {
    await Match.findByIdAndDelete(req.params.id)
  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.createMatch = catchAsync(async (req, res, next) => {
  console.log(req.file)
  console.log(req.body)
  const bodyObj = req.body
  bodyObj.image = req.file.filename
  const newMatch = await Match.create(bodyObj)

  res.status(201).json({
      status: 'success',
      data: {
        match: newMatch
      }
    })
})