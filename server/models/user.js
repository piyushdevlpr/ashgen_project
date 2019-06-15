
// structutre of a user collection

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var UserSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    username: {type:String,index:true,auto:false},
    password: String,
    team:Boolean,
    profilePhoto :{type:String, default:'https://drive.google.com/uc?export=download&id=1cZuz8C5ZUNl5Si2F34RR4_H9sebF5P9z'},
    groups : [
      {
        groupid : String,
        groupname:String,
        newmess: {type:Number,default:0},
        lastUpdatedAt : {type:Number , default:Date.now()},
        profilePhoto :{type:String, default:'https://drive.google.com/uc?export=download&id=1cZuz8C5ZUNl5Si2F34RR4_H9sebF5P9z'}
        // exists : {type:Boolean , default:true}
      }
    ],
    teams : [
      {
        team:{type : String, default:''},
      }
    ],
    friends: [
      {  
         name: String,
         profilePhoto :{type:String, default:'https://drive.google.com/uc?export=download&id=1cZuz8C5ZUNl5Si2F34RR4_H9sebF5P9z'},
         newmess: {type:Number,default:0},
         lastUpdatedAt : {type:Number , default:Date.now()},
         profilePhoto :{type:String, default:'https://drive.google.com/uc?export=download&id=1cZuz8C5ZUNl5Si2F34RR4_H9sebF5P9z'}
       
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

