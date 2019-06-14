var router = require('express').Router();
var MemberProfileModel = require('../../models/profiles/team_member/team_member');



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



module.exports = router;