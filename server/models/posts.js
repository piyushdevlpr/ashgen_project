// for public groups ................

var mongoose = require("mongoose");
var moment = require('moment');

var PostSchema = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  author: {                             //user who has posted
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    team:Boolean,
    username: String
},
type : {type: String, default: ''},       // type of the post - text, photo and video 
title: {type: String, default: ''},
desc : {type: String, default:''},  //description of the post
imgurl: {type:String, default:''}, // url of th image uploaded
vidurl : {type:String, default:''}, // url of the video uploaded
comments: [{                          //comments on the post

    _id:{
        type:mongoose.Schema.Types.ObjectId,
        auto: true,
      },

    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        user: {type: String, default: ''},           // user who has comment

    },
   
    count : {type:Number,default:0} ,// comment count
    comment: {type: String, default: ''},       // comment of the user
    likes : [{ // likes on the comment
        author:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            user: {type: String, default: ''},           // user who has comment
    
        },
    count : {type:Number, default:0}   //likes on comment count
    }],
    reply: [{                                 //reply on the comment
        _id:{
            type:mongoose.Schema.Types.ObjectId,
            auto: true,
          },
        author:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            user: {type: String, default: ''},           // user who has comment
    
        },
       
        count : {type:Number, default:0}, //reply count on comment
        comment : {type: String, default: ''},
    }],

}],
likes: [{                                     // likes on the post
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        user: {type: String, default: ''},           // user who has comment

    },
    count : {type:Number, default:0}  // likes count

}],
shares : [{                                // shares on the post
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        user: {type: String, default: ''},           // user who has comment

    },
    count: {type:Number, default:0}    //shares count
}],
uploadedAt: {
 type:String,
 default: moment().format('LLL').toString()
 
}


 

});

module.exports = mongoose.model("Post", PostSchema);

