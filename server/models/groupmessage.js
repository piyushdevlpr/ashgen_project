// for private groups.......

var mongoose = require("mongoose");

var GroupMessageSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    groupname: String,
    groupid: {type:String,index:true,auto:false},
    messaged: [
      {
        from:String,
        data:{
          format:{type:String},   //text photo video file
          message: {type:String,default:''},
          url    : {type:String,default:''}
        } 
      }
    ]
});

module.exports = mongoose.model("GroupMessage", GroupMessageSchema);

