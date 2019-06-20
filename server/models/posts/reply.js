var mongoose = require("mongoose");
var moment = require('moment');

var ReplySchema = new mongoose.Schema({
    _id:{
      type:mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    author: {                             //user who has posted reply
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      team:Boolean,
      username: String
  },

  comment:{
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
  },

  reply: {type: String, default: ''},       // reply of the user

  postedAt: {
    type:String,
    default: moment().format('LLL').toString()
    
   }




});


module.exports = mongoose.model("Reply", ReplySchema);
