var mongoose = require("mongoose");
var moment = require('moment');

var LikeSchema = new mongoose.Schema({
    _id:{
      type:mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    author: {                             //user who has posted
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      // team:Boolean,
      username: String
  },

  post:{
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    },
  },

  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
    
   }





});


module.exports = mongoose.model("Like", LikeSchema);
