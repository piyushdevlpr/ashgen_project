let router = require('express').Router();
const multer = require("multer");
let postModel = require('../models/posts')
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
                    console.log(model);
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
                    console.log(model);
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
                    console.log(model);
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

//post comment
router.post('/post_comment',function(req,res)
{
    var id = req.body._id;
    console.log(id);
    comments ={

    }
    author = {

    }
    author.id = req.user._id;
    author.user = req.user.username;
    comments.comment = req.body.comment;
    comments.author = author;

    
    postModel.findByIdAndUpdate(id,{"$push":{"comments":comments}}, { "new": true, "upsert": true },function(err,model)
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
})

//post likes
router.post('/post_like',function(req,res)
{
    var id = req.body.id;
    likes ={

    }
    author = {

    }
    author.id = req.user._id;
    author.user = req.user.username;
    likes.author = author;

    
    postModel.findByIdAndUpdate(id,{"$push":{"likes":likes}}, { "new": true, "upsert": true },function(err,model)
    {
        if(err)
        {
            throw err;
        }
        else{
            // console.log(model);
            res.setHeader('Content-Type', 'application/json');
            res.send(model);
        }
    })
});


//delete likes

router.delete('/post_like',function(req,res)
{
    // var id = req.body.id;
    // console.log(req.user._id);
    // var userId = req.user._id;
    // author = {};
    // author.id = userId;
    console.log(req.body);
    
    // postModel.findByIdAndUpdate(id,{"$pull":{"likes":[author]}},function(err,model)
    // {
    //     if(err)
    //     {
    //         throw err;
    //     }
    //     else{
    //         console.log(model);
    //         res.setHeader('Content-Type', 'application/json');
    //         res.send(model);
    //     }
    // })
});


module.exports = router;