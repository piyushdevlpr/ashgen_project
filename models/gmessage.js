// for public groups ................

var mongoose = require("mongoose");

var GMessageSchema = new mongoose.Schema({
    to: String,
    messaged: [
      {
        data:String
      }
    ]
});

module.exports = mongoose.model("GMessage", GMessageSchema);

