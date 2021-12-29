const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tName:{
    type: String,
    required: [false, 'a match must have a name'],
    trim: true
  },
  tStartDate:{
    type: Date,
    default: Date.now()
  },
  tEndDate:{
    type: Date
  },
  tLocation: {
    type: String
  },
  image: {
    type: String
  },
  tPrizes: [{
    prizeNumber: Number,
    prizeMoney: Number,
    sponsor: String,
  }],
  tContacts: [
    {
      name: String,
      mob: Number
    }
  ]
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;

  // payment:{},
  // matchesWinners: [
  //   {
  //     tWinners:[
  //             {
  //               winnerNumber: Number,
  //               cityName: String
  //             },
  //           ],
  //     halfWinner:[ 
  //             {
  //               day: Number,
  //               date: Date,
  //               cityName: String
  //             }
  //          ]
  //   }
  // ],