var router = require('express').Router();
var mongoose = require('mongoose');
var MemberProfileModel = require('../../models/profiles/team_member/team_member');
var MemberAchievementModel = require('../../models/profiles/team_member/member_achievements');
var MemberProjectModel = require('../../models/profiles/team_member/member_projects')
var MemberEducationModel = require('../../models/profiles/team_member/member_education')
var MemberExperienceModel = require('../../models/profiles/team_member/member_experience')
var Dropbox =require('dropbox').Dropbox;
var fs     = require('fs');


//form creatte
router.post('/member_profile',(req,res)=>{   // form data is post here
    data={
        "name":req.body.name,
        "team_name": req.body.team_name,
        "institute": req.body.institute,
        "position": req.body.info.position,
        "dept": req.body.info.dept,

    };
    author={};
    author.id = req.user._id;
    author.username =req.user.username;
    data.author = author;
    team ={
        "id":req.body.info.team.id,
        "username":req.body.info.team.username
    }
    data.team = team;
    
    MemberProfileModel.create(data,function(err,model)
    {
        if(err)
            throw err;
       res.sendStatus(200);
    })
})



//fetching
router.get('/fetch_member_profile',function(req,res)
{

    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberProfileModel.find({author:author},function(err,model)
    {
        if(err)
            throw err;
            console.log(model);
            res.setHeader('Content-Type', 'application/json');
            res.send(model);

    })

})


router.get('/member_achievement',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberAchievementModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    console.log(model);
    res.setHeader('Content-Type', 'application/json');
    res.send(model);
        
    })

})

router.post('/member_achievement',function(req,res)
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
    MemberAchievementModel.create(data,function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(model);
        
    });


});

//projects
router.get('/member_project',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberProjectModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    console.log(model);
    res.setHeader('Content-Type', 'application/json');
    res.send(model);
        
    })

})

router.post('/member_project',function(req,res)
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
    MemberProjectModel.create(data,function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(model);
        
    });


});

//education 
router.get('/member_education',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberEducationModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    console.log(model);
    res.setHeader('Content-Type', 'application/json');
    res.send(model);
        
    })

})

router.post('/member_education',function(req,res)
{
    var data ={
        "school":req.body.educationSchool,
        "course":req.body.educationCourse,
        "startYear":req.body.educationStart,
        "endYear":req.body.educationEnd,

    }
    author={};
    author.id = req.user._id;
    author.username =req.user.username;
    data.author = author;
    MemberEducationModel.create(data,function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(model);
        
    });


});

//experience
router.get('/member_experience',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberExperienceModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    console.log(model);
    res.setHeader('Content-Type', 'application/json');
    res.send(model);
        
    })

})

router.post('/member_experience',function(req,res)
{
    var data ={
        "company":req.body.experienceCompany,
        "position":req.body.experiencePosition,
        "startYear":req.body.experienceStart,
        "endYear":req.body.experienceEnd,

    }
    author={};
    author.id = req.user._id;
    author.username =req.user.username;
    data.author = author;
    MemberExperienceModel.create(data,function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(model);
        
    });


});


//hobbies
router.get('/member_hobby',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberProfileModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(model[0].hobbies);
        
    })

})

router.post('/member_hobby',function(req,res)
{
    console.log(req.body);
    var data ={
        "hobby":req.body.hobby

    }
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberProfileModel.findOneAndUpdate({author:author},  { "$push": { "hobbies": data }},{ "new": true, "upsert": true },function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.sendStatus(200);
        
    });


});

//interests
router.get('/member_interest',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberProfileModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(model[0].interests);
        
    })

})

router.post('/member_interest',function(req,res)
{
    console.log(req.body);
    var data ={
        "interest":req.body.interest

    }
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberProfileModel.findOneAndUpdate({author:author},  { "$push": { "interests": data }},{ "new": true, "upsert": true },function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.sendStatus(200);
        
    });


});


//skills
router.get('/member_skill',function(req,res){
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberProfileModel.find({author:author},function(err,model)
    {
        if(err) 
            throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(model[0].skills);
        
    })

})

router.post('/member_skill',function(req,res)
{
    console.log(req.body);
    var data ={
        "skill":req.body.skill

    }
    author ={
        "id":req.user._id,
        "username":req.user.username
    }
    MemberProfileModel.findOneAndUpdate({author:author},  { "$push": { "skills": data }},{ "new": true, "upsert": true },function(err,model){
        if(err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.sendStatus(200);
        
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

router.post('/member/profile-photo',function(req,res)
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

                MemberProfileModel.findOneAndUpdate({_id:req.body.team_id},{"profilePhoto":profilePhoto},function(err,model)
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




module.exports = router;