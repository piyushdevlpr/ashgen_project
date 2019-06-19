// for public groups ................

var mongoose = require("mongoose");
var moment = require('moment');

var PostSchema = new mongoose.Schema({
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
type : {type: String, default: ''},       // type of the post - text, photo and video 
title: {type: String, default: ''},
desc : {type: String, default:''},  //description of the post
imgurl: {type:String, default:''}, // url of th image uploaded
vidurl : {type:String, default:''}, // url of the video uploaded
uploadedAt: {
 type:String,
 default: moment().format('LLL').toString()
 
}
});

module.exports = mongoose.model("Post", PostSchema);

