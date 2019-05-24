//common for both teams and users

var mongoose = require("mongoose");

var NotificationSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,    
    auto: true,
  },                   
    handlename: {type:String,index:true,auto:false},                     // name of team and user who will receive the notification
    team: Boolean,
    messages :[{
        from : {type:String}                // user name who has sent the msg
    }],
    requests :[{
        from : {type:String}                // user name who has sent the request
    }],
    requestsentto :[{
      to : {type:String}                // user name to whom the request has been sent
    }],
    groups :[
      {
        from : {type:String},
        groupname : {type:String},
        groupid : {type:String}
      }
    ],
    teamrequests :[{
      team :{type:String}
    }]
});

module.exports = mongoose.model("Notification", NotificationSchema);

