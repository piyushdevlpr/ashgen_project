// public group with no subadmins , only one admin, who has created the group

var mongoose = require("mongoose");

var PGroupSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    groupname: String,
    hashtag: String,
    admin: String,
    users: [
      {
        username:String
      }
    ]
});

module.exports = mongoose.model("PGroup", PGroupSchema);

