var mongoose = require("mongoose");

var PublicGroupSchema = new mongoose.Schema({
    groupname: String,
    hashtag: String,
    users: [
      {
        username:String
      }
    ]
});

module.exports = mongoose.model("PublicGroup", PublicGroupSchema);

