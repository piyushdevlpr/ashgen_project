var mongoose = require("mongoose");
var moment = require('moment');

var MemberEduSchema = new mongoose.Schema({
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
  school:{type:String},
  course:{type:String},
  startYear:{type:String},
  endYear:{type:String},

  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
    
   }




});


module.exports = mongoose.model("memberEducation", MemberEduSchema);
