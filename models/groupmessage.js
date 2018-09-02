// for private groups.......

var mongoose = require("mongoose");

var GroupMessageSchema = new mongoose.Schema({
    to: String,
    messaged: [
      {
        data:String
      }
    ]
});

module.exports = mongoose.model("GroupMessage", GroupMessageSchema);

