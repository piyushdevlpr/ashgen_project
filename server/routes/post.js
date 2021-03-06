let router = require('express').Router();
const multer = require("multer");
let postModel = require('../models/posts/posts')
let commentModel = require('../models/posts/comment');
let likeModel       = require('../models/posts/like');
let shareModel      = require('../models/posts/share');
var replyModel      = require('../models/posts/reply');
var likeCommentModel = require('../models/posts/like_comment');
var mongoose   = require('mongoose');
//uploading photo
const storagePhoto = multer.diskStorage({
    destination: "./public/uploads/photo",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });

 const uploadPhoto = multer({
    storage: storagePhoto,
    limits:{fileSize: 1000000},
 }).single("photo");


 //uploading photo
const storageVideo = multer.diskStorage({
    destination: "./public/uploads/video",
    filename: function(req, file, cb){
       cb(null,"VIDEO-" + Date.now() + path.extname(file.originalname));
    }
 });

 const uploadVideo = multer({
    storage: storageVideo,
    limits:{fileSize: 100000000000},
 }).single("video");

 //photo upload router
router.post('/photo_upload', function(req,res)
{
    uploadPhoto(req, res, (err) => {
        // console.log(req.user._id);
        var user_id = req.user._id;
        
        var username = req.user.username;
        console.log("Request ---", req.body);
        console.log("Request file ---", req.file);//Here you get file.

        /*Now do where ever you want to do*/
        if(!err)
        {
            var data ={};
            var author = {}
            author.id = user_id;
            author.username =username
            data.author = author;
            data.type = 'photo';
            data.desc = req.body.desc;
            data.imgurl = req.file.path;
            postModel.create(data,function(err,model)
            {
                if(err)
                    throw err;
                else{
                    // console.log(model);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(model);

                }

            });




        }
           
     });
});


//video upload router
router.post('/video_upload', function(req,res)
{
    var user_id = req.user._id;
        
    var username = req.user.username;
    uploadVideo(req, res, (err) => {
        console.log("Request ---", req.body);
        console.log("Request file ---", req.file);//Here you get file.

        /*Now do where ever you want to do*/
        if(!err)
          {
            var data ={};
            var author = {}
            author.id = user_id;
            author.username =username
            data.author = author;
            data.type = 'video';
            data.desc = req.body.desc;
            data.imgurl = req.file.path;
            postModel.create(data,function(err,model)
            {
                if(err)
                    throw err;
                else{
                    // console.log(model);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(model);

                }

            });
          }
     });
});

router.post('/text_upload', function(req,res)
{
    var user_id = req.user._id;
        
    var username = req.user.username;
    var data ={};
            var author = {}
            author.id = user_id;
            author.username =username
            data.author = author;
            data.type = 'text';
            data.desc = req.body.desc;
            postModel.create(data,function(err,model)
            {
                if(err)
                    throw err;
                else{
                    // console.log(model);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(model);

                }

            });

}
);

//gett posts
router.get('/dashboard_posts',function(req,res)
{
    var data = {List:[]};
    postModel.find({},function(err,model)
    {
        if(err)
            throw err;
        else{
            data.List= model;
            res.setHeader('Content-Type', 'application/json');
            res.send(data);


        }
    })

} );


// routes for fetch all  comments
router.post('/fetch_comments',function(req,res)
{
    
    
    var post_id = req.body.post_id;   
    post_id= mongoose.Types.ObjectId(post_id)
    var post = {};
    post.id = post_id;
    commentModel.find({post:post},function(err,model)
    {
        if(err)
            throw err;
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })
});




//post comment
router.post('/post_comment',function(req,res)
{
    var post_id = req.body._id;
    comments ={

    }
    author = {

    }

    post= {

    };
    post.id = post_id;

    author.id = req.user._id;
    author.team = req.user.team;
    author.username = req.user.username;
    comments.comment = req.body.comment;
    comments.author = author;
    comments.post = post;

    commentModel.create(comments,function(err,model)
    {
        if(err)
            throw err;
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })

    
    
})




//fetch routes for likes
router.post('/fetch_likes',function(req,res)
{
    var post_id = req.body.post_id;   
    post_id= mongoose.Types.ObjectId(post_id)
    var post = {};
    post.id = post_id;
    // console.log(post);
    likeModel.find({post:post},function(err,model)
    {
        if(err)
            throw err;
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })
})




//post likes
router.post('/post_like',function(req,res)
{
    var post_id = req.body.id;
    
    likes ={

    }
    author = {

    }

    post= {

    };
    post.id = post_id;

    author.id = req.user._id;
    author.username = req.user.username;
    likes.author = author;
    likes.post = post;
    // console.log(likes);
    likeModel.create(likes,function(err,model)
    {
        if(err)
            throw err;
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })
    
});


//delete likes

router.post('/post_unlike',function(req,res)
{
    var likeId = mongoose.Types.ObjectId(req.body.likeInfo._id);
    likeModel.findByIdAndRemove(likeId,function(err,model)
    {
        if(err)
        {
            throw err;
        }
        else{
            console.log(model);
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })

   
});



router.post('/check_like',function(req,res)
{
    var user_id = req.user._id;
    var post_id  = mongoose.Types.ObjectId(req.body.post_id);
    
    author ={};
    author.id = user_id;
    author.username = req.user.username;
    post = {};
    post.id = post_id;
   

    likeModel.find({post:post, author:author},function(err,model)
    {
        if(err)
            throw err;
        else{
           if(model.length>=1)
           {
               var data = {};
               data.likeInfo = model[0];
               data.check = true;
                 res.setHeader('Content-Type', 'application/json');
                res.send(data);
              
           }
           else{
               data ={};
                data.check = false;
                res.setHeader('Content-Type', 'application/json');
                res.send(data);           }
        }
    })
})

//reply post route
//post comment
router.post('/post_reply',function(req,res)
{
    var comment_id = req.body._id;
    replies ={

    }
    author = {

    }

    comment= {

    };
    comment.id = comment_id;

    author.id = req.user._id;
    author.username = req.user.username;
    author.team = req.user.team;

    replies.reply = req.body.reply;
    replies.author = author;
    replies.comment = comment;

    replyModel.create(replies,function(err,model)
    {
        if(err)
            throw err;
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })

    
    
})

router.post('/fetch_replies',function(req,res)
{
    
    
    var comment_id = req.body.comment_id;   
    comment_id= mongoose.Types.ObjectId(comment_id);
    var comment = {};
    comment.id = comment_id;
    replyModel.find({comment:comment},function(err,model)
    {
        if(err)
            throw err;
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })
});

router.post('/comment_check_like',function(req,res)
{
    var user_id = req.user._id;
    var comment_id  = mongoose.Types.ObjectId(req.body.comment_id);
    
    author ={};
    author.id = user_id;
    author.username = req.user.username;
    comment = {};
    comment.id = comment_id;
   

    likeCommentModel.find({comment:comment, author:author},function(err,model)
    {
        if(err)
            throw err;
        else{
           if(model.length>=1)
           {
               var data = {};
               data.likeInfo = model[0];
               data.check = true;
                 res.setHeader('Content-Type', 'application/json');
                res.send(data);
              
           }
           else{
               data ={};
                data.check = false;
                res.setHeader('Content-Type', 'application/json');
                res.send(data);           
            }
        }
    })
})

//fetch routes for likes
router.post('/comment_fetch_likes',function(req,res)
{
    var comment_id = req.body.comment_id;   
    comment_id= mongoose.Types.ObjectId(comment_id)
    var comment = {};
    comment.id = comment_id;
    // console.log(post);
    console.log(comment);

    likeCommentModel.find({comment:comment},function(err,model)
    {
        if(err)
            throw err;
        else{
            console.log(model)
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })
})

//post likes
router.post('/comment_like',function(req,res)
{
    var comment_id = req.body.id;
    
    likes ={

    }
    author = {

    }

    comment= {

    };
    comment.id = comment_id;

    author.id = req.user._id;
    author.username = req.user.username;
    likes.author = author;
    likes.comment = comment;
    // console.log(likes);
    likeCommentModel.create(likes,function(err,model)
    {
        if(err)
            throw err;
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })
    
});


//delete likes

router.post('/comment_unlike',function(req,res)
{
    var likeId = mongoose.Types.ObjectId(req.body.likeInfo._id);
    likeCommentModel.findByIdAndRemove(likeId,function(err,model)
    {
        if(err)
        {
            throw err;
        }
        else{
            console.log(model);
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })

   
});



//********************* */


router.post('/post_share',function(req,res)
{
    var post_id = mongoose.Types.ObjectId(req.body.post_id);

    var user_id = req.user.user_id;
    var username = req.user.username;
    var author ={};
    author.id = user_id;
    author.username = username;
    var post ={}
    post.id = post_id;
    data ={};
    data.author = author;
    data.post = post;
    shareModel.create(data,function(err,model)
    {
        if(err)
            throw err;
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })

})






module.exports = router;