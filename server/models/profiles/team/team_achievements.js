var mongoose = require("mongoose");
var moment = require('moment');

var TeamAchievementSchema = new mongoose.Schema({
    _id:{
      type:mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    author: {                             // Team id and its username
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },
  title:{type:String},
  url:{type:String},
  year:{type:String},



  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
    
   }




});


module.exports = mongoose.model("teamachievement", TeamAchievementSchema);
