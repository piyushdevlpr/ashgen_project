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
                    return res.send(200).end();

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
                    return res.send(200).end();

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
                    return res.send(200).end();

                }

            });

}
);



module.exports = router;