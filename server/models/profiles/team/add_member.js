
// structutre of a user collection

var mongoose = require("mongoose");

var TsuSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    Team: {                             // Team id and its username
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },

  email: String,
  position: String,
  dept: String,
   
});

module.exports = mongoose.model("AddMember", TsuSchema);

