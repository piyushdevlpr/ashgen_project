var mongoose = require("mongoose");
var moment = require('moment');

var TeamSchema = new mongoose.Schema({
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
  team_name: {type:String},
  field: {type:String},
  establishment:{type:String},
  institute:{type:String},
  team_size:{type:Number},
  cur_work : {type:String},
  vision: {type:String},
  funding_status: {type:String},
  rating:{type:Number},

  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
    
   }




});


module.exports = mongoose.model("team", TeamSchema);
