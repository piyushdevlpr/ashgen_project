//common for both teams and users

var mongoose = require("mongoose");

var NotificationSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,    
    auto: true,
  },                   
    handlename: String,                     // name of team and user who will receive the notification
    messages :[{
        from : {type:String}                // user name who has sent the msg
    }],
    requests :[{
        from : {type:String}                // user name who has sent the request
    }]
});

module.exports = mongoose.model("Notification", NotificationSchema);

