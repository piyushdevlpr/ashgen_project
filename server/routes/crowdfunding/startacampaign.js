var router  = require('express').Router();
var mongoose = require('mongoose');
var TeamProfileModel = require('../../models/profiles/team/team')
var FundingCampaign = require('../../models/profiles/team/fundingcampaign')
var User = require('../../models/user')
var Dropbox =require('dropbox').Dropbox;
var fs     = require('fs');
var nodemailer = require('nodemailer');

router.post("/fundingcampaign_upload",(req,res)=>{
    data={
        "campaign_name": req.body.campaign_name,
        "short_desc": req.body.short_desc,
        "long_desc": req.body.long_desc,
        "amount": req.body.amount,
        "month":req.body.month,
        "image_link":""
    };
    author={};
    author.id = req.user._id;
    author.username =req.user.username;
    data.author = author;
    
    FundingCampaign.create(data,function(err,model)
    {
        if(err)
            throw err;
            TeamProfileModel.findOneAndUpdate({'author.username':req.user.username},{$set:{funding_status:true}},function(err,mod){
                if(err)
                    throw err ;
                res.sendStatus(200);
            })

    })
})

module.exports = router;