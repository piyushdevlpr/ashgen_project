
// structutre of a user collection

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    profileImage: String,
    // this is actually private group
    publicgrp : [
      {
        hashname:String
      }
    ],
    // this is public group
    pgrp : [
      {
        hashname:String
      }
    ],
    // for any new message that is received by current user
    newmessages: [
    {
      users:String
    }
    ],
    // recent private messages
     recentmessages: [
    {
      users:String
    }
    ],
    // recent private group messages
    recentgpmessages: [
    {
      users:String
    }
    ],
    friends: [
      {  
         name: String,
         propic: String,
      }
   ],
    email: {
        type: String,
        validate: [validateEmail, 'Please fill a valid email address']
       // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
     
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);

