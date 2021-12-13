const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tName:{
    type: String,
    required: [true, 'a match must have a name'],
    unique: true,
    trim: true
  }, 
  tStartDate:{
    type: Date,
    default: Date.now()
  },
  tEndDate:{
    type: Date
  },
  tBanner: String,
  tPrizes: [],
  tContacts: [],
  payment:{},
  matches: [],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Match = mongoose.model('Match', matchSchema);
// const data = {
//   tName:"",
//   tStartDate:"",
//   tEndDate:"",
//   tBanner:"234234234.png",
//   tPrizes:[{
//     prizeNumber:1,
//     prizeMoney:"10000",
//     sponsor:"",
//   },
//   {
//     prizeNumber:2,
//     prizeMoney:"7000",
//     sponsor:"",
//   },
//   {
//     prizeNumber:3,
//     prizeMoney:"5000",
//     sponsor:"",
//   }],
//   tContacts:[{
//     name:"",
//     mob:""
//   },{
//     name:"",
//     mob:""
//   }],
//   payment:{},
//   matches:{
//     tWinners:[
//       {winnerNumber:1,cityName:"kashil"},
//       {winnerNumber:2,cityName:"satara"},
//       {winnerNumber:3,cityName:"dsfsdfsdf"}
//     ],
//     halfWinner:[ {day:1,date:"",cityName:"kashil"},
//     {day:2,date:"",cityName:"kashil"}]
//   }

// }


module.exports = Match;