var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
    from: String,
    to: String,
    messaged: [
      {
        data:String
      }
    ]
});

module.exports = mongoose.model("Message", MessageSchema);