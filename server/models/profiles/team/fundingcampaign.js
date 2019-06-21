var mongoose = require("mongoose");
var moment = require('moment');

var FundingTeamSchema = new mongoose.Schema({
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
  campaign_name : {type:String},
  short_desc : {type:String},
  long_desc : {type:String},
  amount : {type:Number},
  month : {type:Number},
  image_link:{type:String},
  amount_raised:{type:Number,default:0},
  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
   }




});


module.exports = mongoose.model("teamfundingprofile", FundingTeamSchema);
