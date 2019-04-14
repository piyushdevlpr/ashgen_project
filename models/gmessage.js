// for public groups ................

var mongoose = require("mongoose");

var GMessageSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
    to: String,
    messaged: [
      {
        data:String
      }
    ]
});

module.exports = mongoose.model("GMessage", GMessageSchema);

