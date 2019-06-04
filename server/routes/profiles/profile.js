var router  = require('express').Router();



router.post('/team_profile',(req,res)=>{   // form data is post here
    console.log(req.body);
    res.send(200);
})

module.exports = router;