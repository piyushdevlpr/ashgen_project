var mongoose = require("mongoose");
var moment = require('moment');

var CommentSchema = new mongoose.Schema({
    _id:{
      type:mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    author: {                             //user who has posted
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      team:Boolean,
      username: String
  },

  post:{
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    },
  },

  comment: {type: String, default: ''},       // comment of the user

  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
    
   }




});


module.exports = mongoose.model("Comment", CommentSchema);
