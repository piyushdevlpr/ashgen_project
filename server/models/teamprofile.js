var mongoose = require("mongoose");

var TeamProfileSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  user: {                                     //user who has posted
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    username: String
},
  first_name: String,
  Last_Name:String,
  Specialisation:String,
  College:String,
  Teams:String,
  Short_Bio:String,
  Message_Request_Option:String,
  Projects_and_competitions:String,
  Achievements_in_competitions:String,
  open_to_which_type_of_company_projects:String,
  Open_to_which_type_of_collabs:String
});

module.exports = mongoose.model("Teamprofile", TeamProfileSchema);

