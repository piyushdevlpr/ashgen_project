var router  = require('express').Router();
var mongoose = require('mongoose');
var TeamProfileModel = require('../../models/profiles/team/team')
var TeamAchievementModel = require('../../models/profiles/team/team_achievements');
var TeamProjectModel = require('../../models/profiles/team/team_projects');


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


module.exports = router;