var router  = require('express').Router();
var mongoose = require('mongoose');
var TeamProfileModel = require('../../models/profiles/team/team')
var TeamAchievementModel = require('../../models/profiles/team/team_achievements');
var TeamProjectModel = require('../../models/profiles/team/team_projects');
var AddMemberModel  = require('../../models/profiles/team/add_member');
var Dropbox =require('dropbox').Dropbox;
var fs     = require('fs');
var nodemailer = require('nodemailer');


router.post('/team_profile',(req,res)=>{   // form data is post here
    data={
        "team_name": req.body.team_name,
        "field": req.body.field,
        "establishment": req.body.establishment,
        "institute": req.body.institute,
        "team_size":req.body.team_size,
        "cur_work":req.body.cur_work
    };
    author={};
    author.id = req.user._id;
    author.username =req.user.username;
    data.author = author;
    
    TeamProfileModel.create(data,function(err,model)
    {
        if(err)
            throw err;
       res.sendStatus(200);
    })
})

router.get('/fetch_team_profile',function(req,res)
{
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    TeamProfileModel.find({author:author},function(err,model)
    {
        if(err)
            throw err;
            console.log(model);
            res.setHeader('Content-Type', 'application/json');
            res.send(model);

    })

})


router.get('/team_achievement',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    TeamAchievementModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    console.log(model);
    res.setHeader('Content-Type', 'application/json');
    res.send(model);
        
    })

})

router.post('/team_achievement',function(req,res)
{
    var data ={
        "title":req.body.title,
        "url":req.body.url,
        "year":req.body.year
    }
    author={};
    author.id = req.user._id;
    author.username =req.user.username;
    data.author = author;
    TeamAchievementModel.create(data,function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(model);
        
    });


});

//projects
router.get('/team_project',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    TeamProjectModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    console.log(model);
    res.setHeader('Content-Type', 'application/json');
    res.send(model);
        
    })

})

router.post('/team_project',function(req,res)
{
    var data ={
        "title":req.body.title,
        "url":req.body.url,
        "year":req.body.year
    }
    author={};
    author.id = req.user._id;
    author.username =req.user.username;
    data.author = author;
    TeamProjectModel.create(data,function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(model);
        
    });


});


//profile photo upload
const storagePhoto = multer.diskStorage({
    destination: "./public/uploads/photo",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });

 const uploadPhoto = multer({
    storage: storagePhoto,
    limits:{fileSize: 1000000},
 }).single("profilePhotoUpload");

router.post('/team/profile-photo',function(req,res)
{
    uploadPhoto(req, res, (err) => {
        
        if(err)
            throw err;
        console.log(req.file);
        console.log(req.body);
        var dbx = new Dropbox({ accessToken: "AYVLLAhjYcAAAAAAAAAATEk58hbsRiUSoR09dPZLc2VD34rqlK2KoUSdMBsACHWQ" });
        fs.readFile(path.join(__dirname+'/../../public/uploads/photo/'+req.file.filename), function (err, contents) {
            if (err) {
              console.log('Error: ', err);
            }
            dbx.filesUpload({ path: '/Uploads/'+req.file.filename, contents: contents })
         .then(function (response) {
            dbx.sharingCreateSharedLinkWithSettings({path:'/Uploads/'+req.file.filename }).then(function (response) {
                var profilePhoto= response.url.split('?')[0]+'?dl=1';

                TeamProfileModel.findOneAndUpdate({_id:req.body.team_id},{"profilePhoto":profilePhoto},function(err,model)
                {
                    if(err)
                        throw err;
                    
                    res.setHeader('Content-Type', 'application/json');
                    console.log(profilePhoto);
                    res.send(profilePhoto);

                })


            })
            .catch((err)=>{throw err})



         })
         .catch((err)=>{throw err})
        });

    })


})
//adding memeber to team
router.post("/send-email",function(req,res){
    console.log("nodemailer here:") ;
    var data ={
        "email":req.body.emailid,
        "dept":req.body.dept,
        "position":req.body.position,
    }
    var author = {
        "id":req.user._id,
        "username":req.user.username
    }
    data.author = author;
    AddMemberModel.create(data,function(err,cuser){
        if(err)
            throw err;
      var link = "http://localhost:3000/sign-up-team-member/"+cuser._id;
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'ojas.sign.up@gmail.com',
          pass: 'password@ojas'
        }
      });
      let mailOptions = {
        from: '"Ojas" <ojas.sign.up@gmail.com>', // sender address
        to: req.body.emailid, // list of receivers
        subject:"Signup request",
        text:"You have received a sign up request from "+req.user.username+". Kindly click on following link to go to signup page for the team : "+link+".", // plain text body
        // html: '<b>NodeJS Email Tutorial</b>' // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              // res.render('index');
        });
    })
  });

  router.post("/get-info-requestedmember",function(req,res){
    console.log(req.body);
    var _id = mongoose.Types.ObjectId(req.body._id);
    AddMemberModel.findById(_id,function(err,model){
      if(err){
        throw err; ;
      }else{
        res.setHeader('Content-Type', 'application/json');
        res.send(model);
      }
    })
});

//********** */
module.exports = router;