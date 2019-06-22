let router = require('express').Router();
var mongoose = require('mongoose');
var TeamProfileModel = require('../models/profiles/team/team')
var MemberProfileModel = require('../models/profiles/team_member/team_member')


router.get('/getUser', function(req,res)
{
    console.log(req.user);
    res.setHeader('Content-Type', 'application/json');
    res.send(req.user);
});

router.post('/fetch_team_details',function(req,res)
{
    var user_id = mongoose.Types.ObjectId(req.body.user_id);
    TeamProfileModel.find({"author.id":user_id},function(err,model)
    {
        if(err)
        {
            throw err;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(model);

    })


});

router.post('/fetch_member_details',function(req,res)
{
    var user_id = mongoose.Types.ObjectId(req.body.user_id);
    MemberProfileModel.find({"author.id":user_id},function(err,model)
    {
        if(err)
        {
            throw err;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(model);

    })
    

});


module.exports = router;