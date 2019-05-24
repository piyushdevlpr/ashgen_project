var mongoose = require("mongoose");

var YourProfileSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  user: {                                     //user who has posted
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: String
},
  first_name: {type : String, default:''},
  Last_Name:{type : String, default:''},
  Specialisation:{type : String, default:''},
  College:{type : String, default:''},
  Teams:{type : String, default:''},
  Short_Bio:{type : String, default:''},
  Message_Request_Option:{type : String, default:''},
  Projects_and_competitions:{type : String, default:''},
  Achievements_in_competitions:{type : String, default:''},
  open_to_which_type_of_company_projects:{type : String, default:''},
  Open_to_which_type_of_collabs:{type : String, default:''}

});

module.exports = mongoose.model("Yourprofile", YourProfileSchema);

