
// structutre of a user collection

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var IndSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    username: {type:String,index:true,auto:false},
    password: String,
    groups : [
      {
        groupid : String,
        groupname:String,
        newmess: {type:Number,default:0},
        lastUpdatedAt : {type:Number , default:Date.now()},
        // exists : {type:Boolean , default:true}
      }
    ],
    friends: [
      {  
         name: String,
         propic: String,
         newmess: {type:Number,default:0},
         lastUpdatedAt : {type:Number , default:Date.now()}
      }
    ],
    email: {
        type: String,
        validate: [validateEmail, 'Please fill a valid email address']
       // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});

IndSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Individual", IndSchema);

