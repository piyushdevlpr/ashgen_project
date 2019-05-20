// private chat message storing collection, the same thing is stored for both user, who sends the message, and who receives it.

var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    usercombo: {type:String,index:true,auto:false},
    messaged: [
      {
        from:String,      //username
        data:{
          format:{type:String},   //text photo video file
          message: {type:String,default:''},
          url    : {type:String,default:''}
        }       //message
      }
    ]
});

module.exports = mongoose.model("Message", MessageSchema);