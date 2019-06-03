var express            = require("express"),
    app                = express(),
    cors               = require("cors"),
    bodyParser         = require("body-parser"),
    mongoose           = require("mongoose"),
    passport           = require("passport"),
    LocalStrategy      = require("passport-local"),
    User               = require("./models/user"),
    // Team               = require("./models/team"),
    Yourprofile        = require("./models/yourprofile"),
    Teamprofile        = require("./models/teamprofile"),
    Message            = require("./models/message"),
    PublicGroup        = require("./models/publicgroup"),
    GroupMessage       = require("./models/groupmessage"),
    Notification       = require("./models/notifications")
    multer             = require("multer"),
    path               = require("path"),
    server             = require("http").createServer(app),
    io                 = require("socket.io").listen(server),
    getUserRoute       = require('./routes/getUser'),
    postRoute          = require('./routes/post');
    var profileRoute   = require('./routes/profile');
    var siofu          = require("socketio-file-upload");
    const fs           = require('fs');
    mongoose.Promise = global.Promise;
//mongodb://localhost/login-ashgen.......process.env.DATABASEURL
var DBURL = 'mongodb://project:project123@ds139576.mlab.com:39576/project';
  mongoose.connect("mongodb://localhost/login-ashgen",{useNewUrlParser: true})
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));
  var whitelist = [];
  whitelist = ['http://localhost:3000', 'http://localhost:3000/your-profile/','http://localhost:3000/team-profile/','http://localhost:3000/people/']
  // whitelist = ['https://ojus-client-12341fclksjvgjb.herokuapp.com','https://ojus-client-12341fclksjvgjb.herokuapp.com/','https://ojus-client-12341fclksjvgjb.herokuapp.com/your-profile/','https://ojus-client-12341fclksjvgjb.herokuapp.com/team-profile/','https://ojus-client-12341fclksjvgjb.herokuapp.com/people/','https://ojus-client-12341fclksjvgjb.herokuapp.com/groups/','https://ojus-client-12341fclksjvgjb.herokuapp.com/friends/']
  var corsOptions = {
    credentials:true,                           //using credentials from frontend aftr authentication
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
    }
app.use(cors(corsOptions)) ;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION for authentication(registration) of user--------------------
app.use(require("express-session")({
    secret: "ashgen",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('userlocal',new LocalStrategy(User.authenticate()));
//passport.use('teamlocal',new LocalStrategy(Team.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//passport.serializeUser(Team.serializeUser());
//passport.deserializeUser(Team.deserializeUser());
// app.use(function(req,res,next){                            //Populating current users to frontend
//   res.locals.currentUser = req.user;
//   res.locals.error       = req.flash("error");
//   res.locals.success     = req.flash("success");
//   next();
// });
//
app.use(siofu.router)
var port = process.env.PORT || 2000 ;
app.use(getUserRoute);
app.use(postRoute);
app.use(profileRoute);


// app.use(function(req, res, next){
//    res.locals.currentUser = req.user;
//    next();
// });
// app.use(function(req, res, next){
//    res.fruser = req.fuser;
//    next();
// });
//-------------------------------------------------------------------------------------
//----------Authnticating the login credentials enterd by user-------------------------
app.get("/loggedin",function(req,res,next){
  console.log(req.user + "true") ;
  res.json("true") ;
});
app.get("/wrong",function(req,res){
  console.log(req.body + "false") ;
  res.json("false") ;
});
app.post("/login", passport.authenticate("userlocal",
    {   session: true ,
        // successRedirect: "/loggedin",
        failureRedirect: "/wrong"
        
    }), function(req, res){
     // console.log(req.user) ;
      res.redirect("/loggedin")
    });
//---------REGISTER ROUTE--------------------------------------------------------------
//---------------Authenticating the register credntials -------------------------------
//app.post("/register",upload.single('profileImage'), function(req, res,next){
app.post("/register",function(req, res,next){
    console.log("hello") ;
    console.log(req.body) ;
    var tof = req.body.team ;
    var newUser = new User({username: req.body.username,email:req.body.emailid, team:tof});
          User.register(newUser, req.body.password, function(err, user){
            if(err){
                console.log(err);
                console.log("false");
                return res.json("false") ;
                //return res.render("register.ejs");
            }
            passport.authenticate("userlocal")(req, res, function(){
              var newnoti = new Notification({handlename : req.body.username,team:req.body.team}) ;
              
              newnoti.save(function(err,record){
              
                if(err){
                  console.log(err) ;
                }
              })
              if(tof === false){
                var newUser = new Yourprofile({
              username: req.user.username 
                });
              newUser.save(function(err,cuser){
              if(err){
                console.log(err);
              }else{
                console.log(cuser) ;
              }
              });
              }else{
                var user = req.user.username ;
              
                var newUser = new Teamprofile({
                  username: user 
                    });
                  newUser.save(function(err,cuser){
                  if(err){
                    console.log(err);
                  }else{
                    console.log(cuser) ;
                  }
                  });
              }
              console.log("true");  
              res.json("true") ;
            });
        });
});
app.post("/your-profile",function(req, res){
    console.log("hello") ;
  console.log(req.user) ;
  var user = req.user.username ;
  Yourprofile.findOneAndUpdate({username:user},{$set: {  first_name: req.body.first_name,
    Last_Name:req.body.Last_Name,
    Specialisation:req.body.Specialisation,
    College:req.body.College,
    Teams:req.body.Teams,
    Short_Bio:req.body.Short_Bio,
    Message_Request_Option:req.body.Message_Request_Option,
    Projects_and_competitions:req.body.Projects_and_competitions,
    Achievements_in_competitions:req.body.Achievements_in_competitions,
    open_to_which_type_of_company_projects:req.body.open_to_which_type_of_company_projects,
    Open_to_which_type_of_collabs:req.body.Open_to_which_type_of_collabs}},function(err,cuser){
      if(err){
        console.log(err) ;
      }
  });
});

app.post("/team-profile",function(req, res){
  console.log("hello") ;
  console.log(req.user) ;
  var user = req.body.username ;
  mem = []
  for(var i = 0 ; i < req.body.members.length ; i++){
    ob = {};
    ob.name = req.body.members[i];
    ob.status = false;
    mem.push(ob);
  }
  Teamprofile.findOneAndUpdate({username:user},{$set: {  
    Specialisation:req.body.Specialisation,
    College:req.body.College,
    Short_Bio:req.body.Short_Bio,
    Message_Request_Option:req.body.Message_Request_Option,
    Projects_and_competitions:req.body.Projects_and_competitions,
    Achievements_in_competitions:req.body.Achievements_in_competitions,
    open_to_which_type_of_company_projects:req.body.open_to_which_type_of_company_projects,
    Open_to_which_type_of_collabs:req.body.Open_to_which_type_of_collabs},$push:{
      Departments :{$each : req.body.dep} ,
      members : {$each : mem}
      }},{new:true},function(err,cuser){
      if(err){
        console.log(err) ;
      }else{
        for(var i = 0 ; i < req.body.members.length ; i++){
          ob2 = {} ;
          ob2.team = req.body.username ;       
          // ob2.head = ;
        Notification.findOneAndUpdate({handlename : req.body.members[i]},{$push:{teamrequests : ob2}},function(err,fuser){
            if(err){
              console.log(err) ;
            }
          });
        }
        res.json({data:"send"}) ;
      }
  });
});

app.post("/your-profile-update",function(req, res){
  console.log("hello") ;
console.log(req.user) ;
var user = req.user.username ;
Yourprofile.findOneAndUpdate({username:user},{$set: {  first_name: req.body.first_name,
  Last_Name:req.body.Last_Name,
  Specialisation:req.body.Specialisation,
  College:req.body.College,
  Teams:req.body.Teams,
  Short_Bio:req.body.Short_Bio,
  Message_Request_Option:req.body.Message_Request_Option,
  Projects_and_competitions:req.body.Projects_and_competitions,
  Achievements_in_competitions:req.body.Achievements_in_competitions,
  open_to_which_type_of_company_projects:req.body.open_to_which_type_of_company_projects,
  Open_to_which_type_of_collabs:req.body.Open_to_which_type_of_collabs}},function(err,cuser){
    if(err){
      console.log(err) ;
    }
});
});

app.post("/team-profile-update",function(req, res){
console.log("hello") ;
console.log(req.user) ;
var user = req.body.username ;
mem = []
for(var i = 0 ; i < req.body.members.length ; i++){
  ob = {};
  ob.name = req.body.members[i];
  ob.status = false;
  mem.push(ob);
}
Teamprofile.findOneAndUpdate({username:user},{$set: {  
  Specialisation:req.body.Specialisation,
  College:req.body.College,
  Short_Bio:req.body.Short_Bio,
  Message_Request_Option:req.body.Message_Request_Option,
  Projects_and_competitions:req.body.Projects_and_competitions,
  Achievements_in_competitions:req.body.Achievements_in_competitions,
  open_to_which_type_of_company_projects:req.body.open_to_which_type_of_company_projects,
  Open_to_which_type_of_collabs:req.body.Open_to_which_type_of_collabs},$push:{
    Departments :{$each : req.body.dep} ,
    members : {$each : mem}
    }},{new:true},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      for(var i = 0 ; i < req.body.members.length ; i++){
        ob2 = {} ;
        ob2.team = req.body.username ;       
        // ob2.head = ;
      Notification.findOneAndUpdate({handlename : req.body.members[i]},{$push:{teamrequests : ob2}},function(err,fuser){
          if(err){
            console.log(err) ;
          }
        });
      }
      res.json({data:"send"}) ;
    }
});
});

app.post('/newgroup',function(req,res){
  var groupname = req.body.newgroupname ;
  var members = req.body.members ;
  console.log(members) ;
  var currentusers = []
  var pus = {'username' : req.body.name} ;
  currentusers.push(pus);
  var newGroup = new PublicGroup({
    groupname : groupname,
    admin:req.body.name,
    requestedusers : members,
    users : currentusers
  })
  var success = false ;
  var groupid = '' ; 
  newGroup.save(function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      success = true ;
      groupid = cuser._id ;
      group2 = {groupid : groupid , groupname : groupname} ;
      // console.log(data) ;
      console.log(cuser._id) ;
      User.findOneAndUpdate({username : req.body.name} , {$push : {groups:group2}},{new : true},function(err,cuser2){
        if(err){
          console.log(err) ;
        }else{
          console.log(cuser2) ;
          for(var i = 0 ; i < members.length ; i++){
            var usern = members[i].username ;
            group = {'from' : req.body.name , 'groupname' : groupname , 'groupid' : groupid} ;
            Notification.findOneAndUpdate({handlename : usern} , {$push : {groups : group}},function(err,cuser3){
              if(err){
                console.log(err) ;
              }
            })
          }
          var newGroupmessage = new GroupMessage({
            groupname : cuser.groupname,
            groupid : cuser._id 
          });
          newGroupmessage.save(function(err,cuser4){
            if(err){
              console.log(err) ;
            }else{
              data = cuser2.groups ;
              res.json(data) ;
            }
          }) ;
        }
      });
    }
  })
})
app.post("/update-group-addmember/:groupid",function(req,res){
  var groupid = req.params.groupid ;
  console.log(req.body) ;
  var membername = req.body.name ;
  var pus = {'username' : req.body.name} ;
  PublicGroup.findOneAndUpdate({_id : groupid},{$push:{requestedusers:pus}},{new:true},function(err,cuser){
      if(err){
        console.log(err)
      }else{
        group = {from : req.user.username,groupname:cuser.groupname , groupid : groupid}
        Notification.findOneAndUpdate({handlename : membername} , {$push : {groups : group}},function(err,cuser3){
          if(err){
            console.log(err) ;
          }else{
            console.log("mukesh")
            res.json(cuser) ;
          }
        })
      }
  })
})
app.post("/update-group-removemember/:groupid",function(req,res){
  var groupid = req.params.groupid ;
  var membername = req.body.username ;
  var pus = {'username' : req.body.username} ;
  PublicGroup.findOneAndUpdate({_id : groupid},{$pull:{users:pus}},{new:true},function(err,cuser){
      if(err){
        console.log(err)
      }else{
        group = {groupname:cuser.groupname , groupid : groupid}
        User.findOneAndUpdate({username : membername} , {$pull : {groups : group}},function(err,cuser3){
          if(err){
            console.log(err) ;
          }else{
            console.log(cuser.users)
            res.json(cuser) ;
          }
        })
      }
  })
})
app.get("/delete-group/:id",function(req,res){
    var groupid = req.params.id ;
    PublicGroup.findOne({_id:groupid},function(err,cuser){
      if(err){
        console.log(err) ;
      }else{
        for(var i = 0 ; i < cuser.users.length ; i++){
          User.findOneAndUpdate({username : cuser.users[i].username},{$pull : {groups:{'groupid':groupid}}},function(err,c){
            if(err){
              console.log(err) ;
            }
          })
         }
         for(var i = 0 ; i < cuser.requestedusers.length ; i++){
          Notification.findOneAndUpdate({username : cuser.requestedusers[i].username},{$pull : {groups:{'groupid':groupid}}},function(err,c){
            if(err){
              console.log(err) ;
            }
          })
         }
      User.findOneAndUpdate({username : cuser.admin},{$pull : {groups:{'groupid':groupid}}},function(err,c){
        if(err){
          console.log(err) ;
        }
      })
      PublicGroup.findOneAndRemove({_id:groupid},function(err,cuser){
        if(err){
          console.log(err) ;
        }else{
          res.json({verd:"success"}) ;
        }
      })
    }
    })
    GroupMessage.findOneAndRemove({groupid:groupid},function(err,cuser){
      if(err){
        console.log(err) ;
      }
    })
});
app.get('/people/:name',function(req,res){
  var name = '' ;
  name = req.params.name ;
  if(name === null || name === undefined){
    name = '' ;
  }
  //resuser = [] ;
  response = [];
  User.find({username :  {$regex : ".*"+name+".*"}},function(err,cuser){
    if(err){
      console.log(err);
    }else{
       cuser.forEach(function(user){
        response.push({user:user.username,team:user.team,propic:user.propic}) ;
       });
       //response = {users: resuser}
       console.log(response) ;
       res.json(response) ;
    }
  })
});
app.get("/notification/:frname",function(req,res){
  var username = req.user.username ;
  var friend = req.params.frname ;
  var usern = {"from" : username} ;
  var usern2 = {"to" : friend} ;
  Notification.findOneAndUpdate({handlename : friend},{$push: {requests: usern}},function(err,cuser){
    if(err){
      console.log(err);
    }else{
      console.log(cuser);
    }
  })
  Notification.findOneAndUpdate({handlename : username},{$push: {requestsentto: usern2}},function(err,cuser){
    if(err){
      console.log(err);
    }else{
      fr = {friendname : friend}
      console.log(fr) ;
      res.send(fr) 
      console.log(cuser);
    }
  })
})
app.get("/get-notifications",function(req,res){
  var username = req.user.username ;
  Notification.findOne({handlename : username},function(err,cuser){
    if(err){
      console.log(err);
    }else{
      message = [] ;
      request = [] ;
      groupreq = [] ;
      teamrequests = [] ;
      cuser.messages.forEach(function(mes){
          message.push(mes['from']) ;
      });
      cuser.requests.forEach(function(mes){
        request.push(mes.from) ;
      });
      cuser.groups.forEach(function(mes){
        groupreq.push(mes) ;
      });
      cuser.teamrequests.forEach(function(mes){
        teamrequests.push(mes) ;
      });
      var data = {message:message,request:request,groups : groupreq,teamrequests : teamrequests};
      res.json(data) ;
      console.log(message);
      console.log(request);
      console.log(data);
      console.log(cuser);
    }
  })
});
app.get("/getprofile/:username",function(req,res){
  var username = req.params.username ;
  console.log("getprofile"+username) ;
  User.findOne({username : username},function(err,cuser){
    if(cuser.team){
      Teamprofile.findOne({username : username},function(err,kuser){
          res.json({user:kuser,team:true}) ;
      })
    }else{
      Yourprofile.findOne({username : username},function(err,kuser){
          res.json({user:kuser,team:false}) ;
      })
    }
  });
});
app.get("/verdict-accepted/:frname",function(req,res){
  var usernam = req.user.username ;
  var frname = req.params.frname ;
  console.log(frname) ;
  var not = {from:frname} ;
  Notification.findOneAndUpdate({handlename : usernam},{$pull: {requests : not}},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      //console.log(cuser);
      var fr1 = {name:frname,propic:''} ;
      var fr2 = {name:usernam,propic:''} ; 
      User.findOneAndUpdate({username:usernam},{$push: {friends : fr1}},function(err,fuser){
        if(err){
          console.log(err);
        }else{
          console.log(fuser.username)
        }
      });
      User.findOneAndUpdate({username:frname},{$push: {friends : fr2}},function(err,kuser){
        if(err){
          console.log(err);
        }else{
          console.log(kuser)
        }
      });
      var usercombo = usernam+'/'+frname ;
      // var usercombo2 = frname+usernam ;
      var newChat = new Message({usercombo:usercombo}) ;
      //var newChat2 = new Message({from:frname,to:usernam}) ;
      newChat.save(function(err,c){
        if(err){
          console.log(err) ;
        }else{
          res.send({verdict:'success'}) ;
        }
      });
    }
  });
});
app.get("/verdict-declined/:frname",function(req,res){
  var username = req.user.username ;
  var frname = req.params.frname ;
  var not = {from:frname} ;
  Notification.findOneAndUpdate({handlename : username},{$pull: {requests : not}},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      res.send({verdict:'success'}) ;
      console.log(cuser) ;
    }
  });
});
app.post("/verdict-groupaccepted",function(req,res){
  var usernam = req.user.username ;
  var group = req.body ;
  console.log(group) ;
  var not = group ;
  Notification.findOneAndUpdate({handlename : usernam},{$pull: {groups : not}},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      //console.log(cuser);
      var grouptobepushedtouserschema = {groupid:group.groupid,groupname:group.groupname} ;
      var userna = {username : usernam} ; 
      User.findOneAndUpdate({username:usernam},{$push: {groups : grouptobepushedtouserschema}},function(err,fuser){
        if(err){
          console.log(err);
        }else{
          console.log(fuser.username)
        }
      });
      PublicGroup.findOneAndUpdate({_id : group.groupid},{$pull:{requestedusers:userna},$push:{users:userna}},function(err,guser){
        if(err){
          console.log(err);
        }else{
          console.log(guser) ;
          res.send({verdict:'success'}) ;
        }
      })
    }
  });
});
app.post("/verdict-groupdeclined",function(req,res){
  var username = req.user.username ;
  // var groupid = req.params.frname ;
  console.log(req.body)
  var not = req.body ;
  Notification.findOneAndUpdate({handlename : username},{$pull: {groups : not}},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      console.log(cuser) ;
      res.send({verdict:'success'}) ;
    }
  });
});

app.get("/verdict-team-accepted/:key",function(req,res){
  var usernam = req.user.username ;
  var ob = {} ;
  ob.team = req.params.key ;
  console.log(ob) ;
  Notification.findOneAndUpdate({handlename : usernam},{$pull: {teamrequests : ob}},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      // var userna = {username : usernam} ; 
      User.findOneAndUpdate({username:usernam},{$push: {teams : ob}},function(err,fuser){
        if(err){
          console.log(err);
        }else{
          var m = {name:req.user.username,status:"member"} ;
          var m0 = {name:req.user.username,status:"requested"} ;
          var m1 = "member" ;
          console.log(req.params.key + '/' + req.user.username + '/' + usernam) ;
          Teamprofile.findOneAndUpdate({username : req.params.key , 'members.name':req.user.username},{$set:{'members.$.status' : true }},{new:true},function(err,kuser){
            if(err){
              console.log(err) ;
            }else{
              console.log(kuser)
              res.send({verdict:'success'}) ;
            }
          })
        }
      });
    }
  });
});

app.get("/verdict-team-declined/:key",function(req,res){
  var username = req.user.username ;
  // var groupid = req.params.frname ;
  console.log(req.user)
  var ob = {} ;
  ob.team = req.params.key ;
  Notification.findOneAndUpdate({handlename : username},{$pull: {teamrequests : ob}},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      member = {};
      member.name = username;
      member.status = false ;
      Teamprofile.findOneAndUpdate({username : req.params.key},{$pull:{members:member,department:{'head':username}}},function(err,kuser){
        if(err){
          console.log(err) ;
        }else{
          res.send({verdict:'success'}) ;
        }
      })
    }
  });
});
app.get("/get-friends",function(req,res){
  var username = req.user.username ;
  User.findOne({username:username},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      res.json(cuser.friends) ;
    }
  });
});

app.get("/get-notis",function(req,res){
  var username = req.user.username ;
  Notification.findOne({handlename:username},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      res.json(cuser.requestsentto) ;
    }
  });
});

app.get("/get-groups",function(req,res){
  var username = req.user.username ;
  User.findOne({username:username},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      res.json(cuser.groups) ;
    }
  });
});
app.get("/getgroup/:groupid",function(req,res){
  var groupid = req.params.groupid ;
  PublicGroup.findOne({_id:groupid},function(err,cuser){
    if(err){
      console.log(err) ;
    }else{
      console.log(cuser)
      res.json(cuser) ;
    }
  });
});
app.post("/update-new-message-number",function(req,res){
  var currentuser = req.user.username ;
  console.log(req.body) ;
    // for(var i = 0 ; i < req.body.length ; i++){
      User.findOneAndUpdate({username : currentuser, 'friends.name' : req.body.friend},{$set:{'friends.$.newmess' : req.body.number}},function(err,cuser){
        if(err){
          console.log(err) ;
        }else{
           console.log("hellllllllo") ;
        }
      })
})
app.post("/update-new-message-number-group",function(req,res){
  var currentuser = req.user.username ;
  console.log(req.body) ;
    User.findOneAndUpdate({username : currentuser, 'groups.groupid' : req.body.groupid},{$set:{'groups.$.newmess' : req.body.number}},function(err,cuser){
        if(err){
          console.log(err) ;
        }else{
           console.log("hellllllllo") ;
        }
      })
})
//----------------Getting asynchronous calls from front end to access data base-----------
io.sockets.on("connection",function(socket){
//----------------Removing a member from private group------------------------------------
socket.on('join', function (data) {    
  socket.join(data.username);               // make room by name of each user for each user.. when a user needs to send message to thid user, just enter its room.
});
socket.on('joingroup', function (data) {    
  socket.join(data.groupid);               // make room by name of each user for each user.. when a user needs to send message to thid user, just enter its room.
});
socket.on('leave-socket-of-group', function (data) {    
  socket.leave(data.groupid);               // make room by name of each user for each user.. when a user needs to send message to thid user, just enter its room.
});
socket.on("showmessages",function(data){
  var currentuser = data.username ;
        var friendname = data.friendname ;
        var usercombo1 = currentuser+'/'+friendname ;
        var usercombo2 = friendname+'/'+currentuser ;
        console.log(usercombo1) ;
        //var message = data.message ;
        //ms = { "data": currentuser + " : " + message} ;
        Message.findOne({$or:[{usercombo:usercombo1},{usercombo:usercombo2}]},function(err,cuser){
          if(err){
            console.log(err) ;
          }else{
            console.log(cuser) ;
            io.to(currentuser).emit("getmessages",{messages:cuser.messaged});               
          }
        })
})
socket.on("showgroupmessages",function(data){
        var currentgroup = data.groupid ;
        var currentuser = data.username ;
        GroupMessage.findOne({groupid : currentgroup},function(err,cuser){
          if(err){
            console.log(err) ;
          }else{
            console.log(cuser) ;
            io.to(currentuser).emit("getgroupmessages",{messages:cuser.messaged});               
          }
        })
})
socket.on("newmessage",function(data){
        var currentuser = data.username ;
        var friendname = data.friendname ;
        var file   =  data.file;
        
      if(file==null)
      {
        var usercombo1 = currentuser+'/'+friendname ;
        var usercombo2 = friendname+'/'+currentuser ;
        var message = data.message ;
        var obj = {};
        obj.format="text";
        obj.message = message;
        obj.url = null;
        ms = { "from":currentuser,"data":obj } ;
        // io.to(friendname).emit("newmessagereceived",{messages:ms});
        Message.findOneAndUpdate({$or:[{usercombo:usercombo1},{usercombo:usercombo2}]},{$push:{messaged:ms}},{new:true},function(err,cuser){
          if(err){
            console.log(err) ;
          }else{
            console.log(cuser.messaged[cuser.messaged.length - 1]) ;
            io.to(friendname).emit("newmessagereceived",{messages:cuser.messaged[cuser.messaged.length - 1]});               
            io.to(currentuser).emit("newmessagereceived",{messages:cuser.messaged[cuser.messaged.length - 1]});
          } 
        })
         User.findOneAndUpdate({username : friendname, 'friends.name' : currentuser},{$set:{'friends.$.lastUpdatedAt':Date.now()},$inc:{'friends.$.newmess' : 1}},{new:true},function(err,cuser){
          if(err){
            console.log(err) ;
          }else{
            console.log(cuser+">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>") ;
            // User.findOneAndUpdate({username : friendname},{$pullAll:{friends}}) ;
            User.findOneAndUpdate({username : currentuser, 'friends.name' : friendname},{$set:{'friends.$.lastUpdatedAt':Date.now()}},function(err,cuser2){
              if(err){
                console.log(err) ;
              }else{
                 console.log(cuser+">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>") ;
              }
            })
          }
        })
      }
      else{
        var fileName = data.fileName;
        var DateNow = new Date().getTime();
        fileName   = DateNow+fileName;
        var fileType = data.fileType;
        fs.writeFile(__dirname+"/public/uploads/chat/"+fileName,file, function(err) {
          if(err) {
              return console.log(err);
          }
        var usercombo1 = currentuser+'/'+friendname ;
        var usercombo2 = friendname+'/'+currentuser ;
        var message = data.message ;
        var obj = {};
        obj.format=fileType;
        obj.message = message;
        obj.url = "/public/uploads/chat/"+fileName;
      
        ms = { "from":currentuser,"data":obj } ;
            // io.to(friendname).emit("newmessagereceived",{messages:ms});
        Message.findOneAndUpdate({$or:[{usercombo:usercombo1},{usercombo:usercombo2}]},{$push:{messaged:ms}},{new:true},function(err,cuser){
          if(err){
            console.log(err) ;
          }else{
            console.log(cuser.messaged[cuser.messaged.length - 1]) ;
            io.to(friendname).emit("newmessagereceived",{messages:cuser.messaged[cuser.messaged.length - 1]});               
            io.to(currentuser).emit("newmessagereceived",{messages:cuser.messaged[cuser.messaged.length - 1]});
          } 
        })
        User.findOneAndUpdate({username : friendname, 'friends.name' : currentuser},{$set:{'friends.$.lastUpdatedAt':Date.now()},$inc:{'friends.$.newmess' : 1}},{new:true},function(err,cuser){
          if(err){
            console.log(err) ;
          }else{
            console.log(cuser+">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>") ;
            // User.findOneAndUpdate({username : friendname},{$pullAll:{friends}}) ;
            User.findOneAndUpdate({username : currentuser, 'friends.name' : friendname},{$set:{'friends.$.lastUpdatedAt':Date.now()}},function(err,cuser2){
              if(err){
                console.log(err) ;
              }else{
                 console.log(cuser+">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>") ;
              }
            })
          }
        }) 
      })
      }        
      });
  socket.on("afterunmount",function(data){
    console.log(data) ;
    for(var i = 0 ; i < data.data.length ; i++){
      User.findOneAndUpdate({username : data.currentuser, 'friends.name' : data.data[i].friendname},{$set:{'friends.$.newmess' : data.data[i].newmessage}},function(err,cuser){
      if(err){
        console.log(err) ;
      }else{
        //  console.log("hellllllllo") ;
      }
    })
  }
  });
  socket.on("afterunmountgroup",function(data){
    console.log(data) ;
    for(var i = 0 ; i < data.data.length ; i++){
      User.findOneAndUpdate({username : data.currentuser, 'groups.groupid' : data.data[i].groupid},{$set:{'friends.$.newmess' : data.data[i].newmessage}},function(err,cuser){
      if(err){
        console.log(err) ;
      }else{
        //  console.log("hellllllllo") ;
      }
    })
  }
  });
  socket.on("newgroupmessage",function(data){
        var currentuser = data.username ;
        var groupid = data.groupid ;
        // var usercombo1 = currentuser+friendname ;
        var message = data.message ;
        var file   =  data.file;
        if(file==null)
        {
          var obj ={};
          obj.format = "text";
          obj.message = message;
          obj.url = null;
          
          ms = { "from":currentuser,"data":obj } ;
          // io.to(friendname).emit("newmessagereceived",{messages:ms});
          GroupMessage.findOneAndUpdate({groupid : groupid},{$push:{messaged:ms}},{new:true},function(err,cuser){
            if(err){
              console.log(err) ;
            }else{
              // console.log(cuser.messaged[cuser.messaged.length - 1]) ;
              io.sockets.in(groupid).emit("newgroupmessagereceived",{groupid : cuser.groupid , messages:cuser.messaged[cuser.messaged.length - 1]});               
              
            } 
          })
          PublicGroup.findOne({_id : groupid},function(err,cuser0){
            var arr = [];
            // console.log(cuser0);
            arr = cuser0.users ;
            for(var i = 0 ; i < arr.length ; i++){
          if(arr[i].username !== currentuser){
            io.sockets.in(arr[i].username).emit("newnotification",{from : currentuser ,groupid : groupid})
            User.findOneAndUpdate({username : arr[i].username, 'groups.groupid' : groupid},{$set:{'groups.$.lastUpdatedAt':Date.now()},$inc:{'groups.$.newmess' : 1}},{new:true},function(err,cuser){
              if(err){
                console.log(err) ;
              }else{
                console.log(cuser+">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>") ;
              }
            })
          }
          User.findOneAndUpdate({username : currentuser, 'groups.groupid' : groupid},{$set:{'groups.$.lastUpdatedAt':Date.now()}},{new:true},function(err,cuser){
            io.sockets.in(currentuser).emit("newnotification",{from : currentuser ,groupid : groupid})
            if(err){
              console.log(err) ;
            }else{
              console.log(cuser+">>>>>>") ;
            }
          })
          }
          })
        }
        else{

          var fileName = data.fileName;
          var DateNow = new Date().getTime();
          fileName   = DateNow+fileName;
          var fileType = data.fileType;
          fs.writeFile(__dirname+"/public/uploads/chat/"+fileName,file, function(err) {
            if(err) {
                return console.log(err);
            }
            var obj ={};
            obj.format = fileType;
            obj.message = message;
            obj.url = "/public/uploads/chat/"+fileName;
            
            ms = { "from":currentuser,"data":obj } ;
            // io.to(friendname).emit("newmessagereceived",{messages:ms});
            GroupMessage.findOneAndUpdate({groupid : groupid},{$push:{messaged:ms}},{new:true},function(err,cuser){
              if(err){
                console.log(err) ;
              }else{
                // console.log(cuser.messaged[cuser.messaged.length - 1]) ;
                io.sockets.in(groupid).emit("newgroupmessagereceived",{groupid : cuser.groupid , messages:cuser.messaged[cuser.messaged.length - 1]});               
              } 
            })
            PublicGroup.findOne({_id : groupid},function(err,cuser0){
              var arr = [];
              arr = cuser0.users ;
              for(var i = 0 ; i < arr.length ; i++){
            if(arr[i].username !== currentuser){
              io.sockets.in(arr[i].username).emit("newnotification",{from : currentuser ,groupid : groupid})
              User.findOneAndUpdate({username : arr[i].username, 'groups.groupid' : groupid},{$set:{'groups.$.lastUpdatedAt':Date.now()},$inc:{'groups.$.newmess' : 1}},{new:true},function(err,cuser){
                if(err){
                  console.log(err) ;
                }else{
                  console.log(cuser+">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>") ;
                }
              })
            }
            User.findOneAndUpdate({username : currentuser, 'groups.groupid' : groupid},{$set:{'groups.$.lastUpdatedAt':Date.now()}},{new:true},function(err,cuser){
              io.sockets.in(currentuser).emit("newnotification",{from : currentuser ,groupid : groupid})
              if(err){
                console.log(err) ;
              }else{
                console.log(cuser+">>>>>>") ;
              }
            })
            }
            // }
            })


          });
          
        }
       
      });
});

//------------------------------------listen to local port -----------------------------------------------------------------------------
server.listen(port,function(){
  console.log("server running!!!!" + process.env.PORT);
});

