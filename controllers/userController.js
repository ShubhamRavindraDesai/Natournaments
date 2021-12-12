const User = require('./../models/usermodel')


exports.getAllUsers = async (req, res) => {
  try {
  const users = await User.find();
  console.log(users)
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users
    }
  });
} catch(err){
  res.status(404).json({
    status: 'failed',
    message: err
  })
}
}

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet difined'
  })
}

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet difined'
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet difined'
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet difined'
  })
}
