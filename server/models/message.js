// private chat message storing collection, the same thing is stored for both user, who sends the message, and who receives it.

var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    usercombo1: String, //user1+user2
    usercombo2: String, //user2+user1
    fileSelected:{type:String, default:false},
    fileType: {type:String},
    fileUrl : {type:String},
    messaged: [
      {
        from:String,      //username
        data:String       //message
      }
    ]
});

module.exports = mongoose.model("Message", MessageSchema);