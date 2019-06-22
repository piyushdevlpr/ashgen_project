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
  team:{type:Boolean,default:true},
  field: {type:String},
  establishment:{type:String},
  institute:{type:String},
  team_size:{type:Number},
  cur_work : {type:String},
  vision: {type:String},
  funding_status: {type:Boolean,default:false},
  rating:{type:Number},
  profilePhoto :{type:String, default:'https://drive.google.com/uc?export=download&id=1cZuz8C5ZUNl5Si2F34RR4_H9sebF5P9z'},
  profileTimeline:{type:String,default:'https://drive.google.com/uc?export=download&id=1O1PQWchJbWnT4g3hYyI5T48hyOjHSbDq'},
  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
    
   }




});


module.exports = mongoose.model("team", TeamSchema);
