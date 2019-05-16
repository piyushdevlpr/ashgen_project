
var mongoose = require("mongoose");

var PublicGroupSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    groupname: String,
    admin:String,
    requestedusers : [{
      username : String
    }],
    users: [{
      username : String
    }]
});

module.exports = mongoose.model("PublicGroup", PublicGroupSchema);

