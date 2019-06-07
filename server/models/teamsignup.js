
// structutre of a user collection

var mongoose = require("mongoose");

var TsuSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    teamname: {type:String,index:true,auto:false},
    requested: [
      {  
        _id:{
            type:mongoose.Schema.Types.ObjectId,
            auto: true,
        } ,
        email : String,
      }
    ]
});

module.exports = mongoose.model("Teamsignup", TsuSchema);

