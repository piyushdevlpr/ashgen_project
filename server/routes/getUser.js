let router = require('express').Router();

router.get('/getUser', function(req,res)
{
    console.log(req.user);
    res.setHeader('Content-Type', 'application/json');
    res.send(req.user);
});



module.exports = router;