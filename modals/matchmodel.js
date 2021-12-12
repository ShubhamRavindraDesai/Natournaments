const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, ''],
    unique: true,
    trim: true
  }, 
  description:{
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [false, '']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});

const Match = mongoose.model('Match', matchSchema);


module.exports = Match;