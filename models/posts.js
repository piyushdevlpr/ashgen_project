// for public groups ................

var mongoose = require("mongoose");

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
    
    username: String
    
    
},
type : {type: String, default: ''},       // type of the post - text, photo and video 
title: {type: String, default: ''},
desc : {type: String, default:''},  //description of the post
imgurl: {type:String, default:''}, // url of th image uploaded
vidurl : {type:String, default:''}, // url of the video uploaded
comments: [{                          //comments on the post
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    user: {type: String, default: ''},           // user who has comment
    comment: {type: String, default: ''},       // comment of the user
    likes : [{                                  // likes on the comment
         id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    user: {type: String, default: ''},  
    }],
    reply: [{                                 //reply on the comment
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        
        user: {type: String, default: ''},
        comment : {type: String, default: ''},
    }],

}],
likes: [{                                     // likes on the post
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    user:{type: String, default: ''},
}],
shares : [{                                // shares on the post
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    user: {type: String, default: ''},
}],
uploadedAt: {
 type:String,
 default: moment().format('LLL').toString()
 
}


 

});

module.exports = mongoose.model("Post", PostSchema);

