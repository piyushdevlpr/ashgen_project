var mongoose = require("mongoose");

var PGroupSchema = new mongoose.Schema({
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

