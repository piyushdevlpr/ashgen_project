var router  = require('express').Router();
var mongoose = require('mongoose');
var TeamProfileModel = require('../../models/profiles/team/team')
var FundingCampaign = require('../../models/profiles/team/fundingcampaign')
var User = require('../../models/user')
var Dropbox =require('dropbox').Dropbox;
var fs     = require('fs');
var nodemailer = require('nodemailer');

router.get("/get-user-campaign",(req,res)=>{
    FundingCampaign.findOne({'author.username':req.user.username},function(err,model){
        if(!err){
            res.send(model) ;
        }
    })
})
//profile photo upload
const storagePhoto = multer.diskStorage({
    destination: "./public/uploads/campaign",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });

 const uploadPhoto = multer({
    storage: storagePhoto,
    limits:{fileSize: 1000000},
 }).single("campaignimage");

router.post("/fundingcampaign_upload",(req,res)=>{
    console.log(req.body);
    uploadPhoto(req, res, (err) => {
        
        if(err)
            throw err;
        console.log(req.file);
        console.log(req.body);
        var dbx = new Dropbox({ accessToken: "AYVLLAhjYcAAAAAAAAAATEk58hbsRiUSoR09dPZLc2VD34rqlK2KoUSdMBsACHWQ" });
        fs.readFile(path.join(__dirname+'/../../public/uploads/campaign/'+req.file.filename), function (err, contents) {
            if (err) {
              console.log('Error: ', err);
            }
            dbx.filesUpload({ path: '/Uploads/'+req.file.filename, contents: contents })
         .then(function (response) {
            dbx.sharingCreateSharedLinkWithSettings({path:'/Uploads/'+req.file.filename }).then(function (response) {
                var campaignimage = response.url.split('?')[0]+'?dl=1';
                data={
                    "campaign_name": req.body.campaignname,
                    "short_desc": req.body.shortdesc,
                    "long_desc": req.body.longdesc,
                    "amount": req.body.amount,
                    "month":req.body.month,
                    "image_link":response.url.split('?')[0]+'?dl=1',
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
            .catch((err)=>{throw err})



         })
         .catch((err)=>{throw err})
        });

    })



    // FundingCampaign.create(data,function(err,model)
    // {
    //     if(err)
    //         throw err;
    //         TeamProfileModel.findOneAndUpdate({'author.username':req.user.username},{$set:{funding_status:true}},function(err,mod){
    //             if(err)
    //                 throw err ;
    //             res.sendStatus(200);
    //         })

    // })
})

module.exports = router;