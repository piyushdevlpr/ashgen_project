var mongoose = require("mongoose");

var TeamProfileSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  username: String,
  Specialisation:String,
  Departments : [{
    department : String,
    head : String
  }],
  members:[{
    name  : String,
    status : Boolean
  }],
  College:{type : String, default:''},
  Short_Bio:{type : String, default:''},
  Message_Request_Option:{type : String, default:''},
  Projects_and_competitions:{type : String, default:''},
  Achievements_in_competitions:{type : String, default:''},
  open_to_which_type_of_company_projects:{type : String, default:''},
  Open_to_which_type_of_collabs:{type : String, default:''}
});

module.exports = mongoose.model("Teamprofile", TeamProfileSchema);

