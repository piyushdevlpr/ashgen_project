// private chat message storing collection, the same thing is stored for both user, who sends the message, and who receives it.

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