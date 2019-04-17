let router = require('express').Router();

router.post('/post_upload', function(req,res)
{
    console.log(req.body);
});



module.exports = router;