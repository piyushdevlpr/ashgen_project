var mongoose = require("mongoose");
var moment = require('moment');

var MemberSchema = new mongoose.Schema({
    _id:{
      type:mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    author: {                             
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },
  team: {                             // Team id and its username
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: String
},
  name : {type:String},
  team:{type:Boolean,default:false},
  team_name: {type:String},
  position: {type:String},
  dept:{type:String},
  institute:{type:String},
  vision: {type:String},
  rating:{type:Number},
  skills:[{skill:String,default:''}],
  hobbies:[{hobby:String,default:''}],
  interests:[{interest:String,default:''}],
  profilePhoto :{type:String, default:'https://drive.google.com/uc?export=download&id=1cZuz8C5ZUNl5Si2F34RR4_H9sebF5P9z'},
  profileTimeline:{type:String,default:'https://drive.google.com/uc?export=download&id=1O1PQWchJbWnT4g3hYyI5T48hyOjHSbDq'},
  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
    
   }




});


module.exports = mongoose.model("member", MemberSchema);
