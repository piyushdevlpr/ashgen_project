var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    Message        = require("./models/message"),
    PublicGroup        = require("./models/publicgroup"),
    GroupMessage        = require("./models/groupmessage"),
    PGroup        = require("./models/pgroup"),
    GMessage        = require("./models/gmessage"),
    searchedFriend = {},
    addedFriend = "" ,
    whichPage = "one" ;
    whichPage2 = "six" ;
    frnames = [] ,
   
    multer = require("multer"),
    path = require("path"),
    server= require("http").createServer(app),
    io = require("socket.io").listen(server) 



    mongoose.Promise = global.Promise;
//mongodb://localhost/login-ashgen.......process.env.DATABASEURL
  mongoose.connect("mongodb://127.0.0.1:27017/login-ashgen",{useMongoClient:true})
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));

// ----------To support profile photo uploadation ,multer configurations-------------
//     var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function(req, file, cb) {
    
//     cb(null, file.originalname);
//   }
// });
// function fileFilter(req, file, cb){
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// var upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
//   fileFilter: fileFilter
// });
//-----------------------------------------------------------------------------------
app.use(express.static(__dirname + "/uploads"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION for authentication(registration) of user--------------------
app.use(require("express-session")({
    secret: "ashgen",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
var port = process.env.PORT || 3000;
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});
app.use(function(req, res, next){
   res.fruser = req.fuser;
   next();
});
//-------------------------------------------------------------------------------------

// ---------HOME ROUTE (register page)-------------------------------------------------
app.get("/",function(req,res){
  res.redirect("/register");
});
//-----------LOGIN ROUTE---------------------------------------------------------------
app.get("/login",function(req,res){ 
  res.render("login.ejs");
});
//----------Authnticating the login credentials enterd by user-------------------------
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/signedin",
        failureRedirect: "/register"
    }), function(req, res){
});
//---------REGISTER ROUTE--------------------------------------------------------------
app.get("/register",function(req,res){
  res.render("register.ejs");
});
//---------------Authenticating the register credntials -------------------------------
//app.post("/register",upload.single('profileImage'), function(req, res,next){
  app.post("/register",function(req, res,next){
    //var newUser = new User({username: req.body.username,email:req.body.emailid,profileImage: req.file.filename});
    var newUser = new User({username: req.body.username,email:req.body.emailid});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/signedin"); 
        });
    });
});
//--------------Route to show the page after login -------------------------------------
app.get("/signedin",function(req,res){
  var addedFriend = "" ;
  whichPage2 = "six" ;
  res.render("signedin.ejs",{addedFriend:addedFriend,whichPage:whichPage,searchedFriend:searchedFriend});
});

//---------------Route to logout---------------------------------------------------------
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/login");
});

//----------------Getting asynchronous calls from front end to access data base-----------
io.sockets.on("connection",function(socket){
//----------------Removing a member from private group------------------------------------
       socket.on("remove-member",function(data2){
        var grphashtag = {"hashname": data2.grpname};
          var grouphashtag = {"username": data2.membername} ;
          var isPresent = false ;
          PublicGroup.findOne({hashtag: data2.grpname},function(err,cgroup){
              if(err){
                console.log(err);
              }else{
                cgroup.users.forEach(function(f){
                    if(f.username === data2.membername){
                      console.log(f.username) ;
                      isPresent = true ;
                    }
                });
                if(!isPresent){
           var statement = "member does not exist";
                          var output = {"user": data2.user , "state":statement};
            io.emit("member-removed",output) ;
          }else {
         PublicGroup.findOneAndUpdate({hashtag: data2.grpname},{$pull: {users: grouphashtag,subadmins:grouphashtag}},
                      function(err, cuser) {
                        if(err){console.log(err);}
                        else{
                           User.findOneAndUpdate({ username : data2.membername},{$pull: {publicgrp: grphashtag}},function(err,fuser){
                           if(err){
                          console.log(err);
                          }else{
                              console.log(fuser) ;
                                   
                                    var statement = "member does not exist";
                          var output = {"user": data2.user , "state":statement};
                                    io.emit("member-removed",output);
                              
                    
                                  }
                      
                      });
                
                          
                        }
         });
       }
              }
          });
          
       });
//---------------------REmoving a member from the post of subadmin in private group---------------
         socket.on("remove-subadmin",function(data2){
          var grouphashtag = {"username": data2.membername} ;
          var isPresent = false ;
          PublicGroup.findOne({hashtag: data2.grpname},function(err,cgroup){
              cgroup.subadmins.forEach(function(f){
                if(f.username === data2.membername){
                    isPresent = true ;
                }
              });
              if(isPresent){
                  PublicGroup.findOneAndUpdate({hashtag:data2.grpname},{$pull: {subadmins: grouphashtag}},
                      function(err, cuser) {
                        if(err){
                          console.log(err);
                        }else{
                          var statement = "member removed as a subadmin";
                          var output = {"user": data2.user , "state":statement};

                          io.emit("subadmin-removed",output);
                        }
                      });
              }else{
                 var statement = "no such subadmin exists";
                          var output = {"user": data2.user , "state":statement};
                  io.emit("subadmin-removed", output);
              }
          });   
          
       });
//-------------------Adding a new member to private group---------------------------------------------
      socket.on("add-member",function(data2){
          User.find({ username : data2.membername}).count({},function(err,count){
              if(count===0){
                var statement = "no such user" ;
                io.emit("add-member-result",statement) ;
              }
              else{
                var isP = false;
                var grphashtag = {"hashname": data2.grpname};
                 User.findOne({ username : data2.membername},function(err,cuser){
                  cuser.publicgrp.forEach(function(f){
                    if(f.hashname === data2.grpname){
                      isP = true ;
                    }
                  });
                  if(!isP){
                    User.findByIdAndUpdate(cuser._id,{$addToSet: {publicgrp: grphashtag}},
                      function(err, cuser) {if(err){
                        console.log(err);
                      }
                      });
                  }
                
                 });
                 var isPresent = false ;
                var grouphashtag = {"username": data2.membername} ;
                PublicGroup.findOne({hashtag : data2.grpname},function(err,cgroup){
                  var id = cgroup._id ;
                  cgroup.users.forEach(function(f){
                      if(f.username ===data2.membername){
                        isPresent = true ;
                      }

                  });
                  if(!isPresent){
                  PublicGroup.findByIdAndUpdate(id,{$addToSet: {users: grouphashtag}},
                      function(err, cuser) {
                        if(err){
                          console.log(err);
                        }
                        else{
                          var statement = "member added succesfully";
                          var output = {"user": data2.user , "state":statement};
                          io.emit("add-member-result",output);
                        }
                      });
                }
                else{
                  var statement = "member already present";
                  var output = {"user": data2.user , "state":statement};
                          io.emit("add-member-result",output);
                }
                });
              }
          });
      });
//-------------Making an existing member a sub admin -----------------------------------------
       socket.on("add-subadmin",function(data2){
          var grouphashtag = {"username": data2.membername} ;
          var isPresent = false ;
          PublicGroup.findOne({hashtag: data2.grpname},function(err,cgroup){
              cgroup.users.forEach(function(f){
                if(f.username === data2.membername){
                    isPresent = true ;
                }
              });
              if(isPresent){
                  PublicGroup.findOneAndUpdate({hashtag:data2.grpname},{$addToSet: {subadmins: grouphashtag}},
                      function(err, cuser) {
                        if(err){
                          console.log(err);
                        }else{
                          var statement = "member made subadmin" ;
                          var output = {"user":data2.user , "state":statement};
                          io.emit("subadmin",output);
                        }
                      });
              }else{
                  var statement = "no such member exists" ;
                  var output = {"user":data2.user , "state":statement};
                  io.emit("subadmin", output );
              }
          });
      });
//-------------The settings to show to the user of a private group based on whether he is subadmin, admin or a normal member-------------
        socket.on("settings-to-show",function(data2){
          PublicGroup.findOne({hashtag:data2},function(err,cgroup){
              io.emit("settings-emitted",cgroup);
          });
        });
//-----------Emitting list of private groups of the user -----------------------------------------------------
      socket.on("clickedpublicgroups",function(data2){
          User.findById(data2.id,function(err,cuser){
              if(err){
                console.log(err);
              }
              else{
                io.emit("herearethegroups",cuser);
              }
          });
      });
//-----------Emitting list of public groups of the user -------------------------------------------------------
     socket.on("clickedpgroups",function(data2){
          User.findById(data2.id,function(err,cuser){
              if(err){
                console.log(err);
              }
              else{
                io.emit("herearethepgroups",cuser);
              }
          });
      });
//------------creating a public group --------------------------------------------------------------------------
     socket.on("createpubgroup",function(data2){
          console.log(data2);
          var userss = {"username": data2.maker };
          var output = {"name":data2.maker , "state":""} ;
           PGroup.find({hashtag : data2.hashtagname}).count({},function(err,count1){


          console.log(count1);
                PublicGroup.find({ hashtag : data2.hashtagname}).count({},function(err,count){
                  
                    
                  
                   if(err || count !== 0 || count1!== 0){
                    statement = "group already exists";
                    output = {"name":data2.maker , "state":statement} ;
                      io.emit("groupcreated",output) ; 
                  } 
                  else{
                      grouphashtag = {"hashname" :data2.hashtagname};
                      User.findByIdAndUpdate(data2.id,
                      {$addToSet: {publicgrp: grouphashtag}},
                      function(err, cuser) {
                        if(err){
                          console.log(err);
                        }

                      });
                      var newpubgroup = new PublicGroup({groupname :data2.groupname, hashtag:data2.hashtagname,admin:data2.maker,users: userss }); 
                      newpubgroup.save(function(err){
                        if(err){
                            console.log(err);
                            }
                      });
                      var newgroupmessage = new GroupMessage({to : data2.hashtagname});
                      newgroupmessage.save(function(err){
                        if(err){
                            console.log(err);
                            }
                      });
                      statement = "group created";
                      output = {"name":data2.maker , "state":statement} ;

                      io.emit("groupcreated",output) ; 
                  }
                });
          });    
              
           
    });
//-----------------------Send the list of friends of the user ---------------------------------------
    socket.on("show-friend-list",function(data2){
      User.findById( data2.id,function(err,cuser){
        if(err){
          console.log(err);
        }else{
          io.emit("friend-list-emitted",cuser) ;  
        }
          });
      
    });
//------------------------Add a new friend to the users' account--------------------------------------0
    socket.on("add-friend-name",function(data2){
      User.findOne({ username : data2.friendname},function(err,fuser){
    if (err) {
         res.send("fu");
             }
    else{
         User.find({ username : data2.friendname}).count({},function(err,count){
        if(!err && count!==0){
           var isPresent = false ;
           var friend = {"name": fuser.username, "propic":fuser.profileImage} ;
           User.findById(data2.id,function(err,cuser2){
            
              cuser2.friends.forEach(function(f){
                if( data2.friendname===f.name){
                  isPresent = true ;
                
                }
                
              });
                  if(!isPresent){
    User.findByIdAndUpdate(data2.id,
    {$addToSet: {friends: friend}},
    function(err, cuser) {
        if(err){
           console.log(err);
        }else{
             console.log(cuser);
            var newMessage = new Message({from :cuser.username, to:fuser.username }); 
            newMessage.save(function(err){
              if(err){
                console.log(err);
              }
            });
             var newMessage2 = new Message({from :fuser.username, to:cuser.username }); 
            newMessage2.save(function(err){
              if(err){
                console.log(err);
              }
            });
            var friend2 = {"name": cuser.username, "propic":cuser.profileImage} ;
           console.log(friend2.message);
           User.findByIdAndUpdate(fuser._id,
           {$addToSet: {friends: friend2}},function(err,data){
            if(err){
              console.log(err);
            }else{
              console.log(data);
            var addedFriend = "friend successfully added";
            whichPage="two" ;
            whichPage2 = "six" ;
            io.emit("friend-added",addedFriend);
            }
           });
         }
      });
    }
    else{
      var addedFriend = "friend exists"; 
      io.emit("friend-added",addedFriend);
    }
           });
  }
     else{
       var addedFriend = "no such  friend can be added";
       whichPage="two" ;
       whichPage2 = "six" ;
       io.emit("friend-added",addedFriend);
         }
          });
        }
    });
  });
//----------------Call to search a friend from friend list of the user --------------------------------------------------
     socket.on("search-friend-name",function(data2){
      var isFriend = false ;
      var output = {statement:"" , name:"" , user:""};
      var isGroup = false ;
        User.findById(data2.id,function(err,cuser){
    if(err){
      console.log(err);
    }
    else{
      PGroup.findOne({hashtag:data2.friendname},function(err,cgroup){
      console.log(cgroup);
            if(cgroup !== null){
              isGroup= true ;
              output = {statement:"" , name:data2.friendname , user: data2.from};
              io.emit("group-searched",output);
            }
        });
      cuser.friends.forEach(function(f){
          
           if(f.name===data2.friendname){
                
                isFriend = true ;
                output =  {statement:"" , name:f.name ,user: data2.from};
          
              } 
      }) ;
      } 
      if(isFriend){
        console.log(searchedFriend.name);
        io.emit("friend-searched", output);
        }
        console.log(isFriend);
        console.log(isGroup);
        if(isFriend===false && isGroup===false){
          output = {statement:"No such" , name:"" , user:data2.from};
          io.emit("friend-searched",output) ;
        }
      });


  });
//----------------Call by the user to join a public group ------------------------------------------------------
socket.on("requesttojoin",function(data2){
   var newuser = {"username":data2.name} ;
   var newgroup = {"hashname":data2.grpname} ;

   PGroup.findOne({hashtag:data2.grpname},function(err,cgroup){
    if(!err){
      cgroup.update({$addToSet:{users:newuser}},{new:true},function(err,kgroup){


      console.log(cgroup);
      User.findOne({username:data2.name},function(err,cuser){
          if(!err){
            cuser.update({$addToSet:{pgrp:newgroup}},{new:true},function(err,guser){
                          io.emit("groupjoined",{statement:"groupjoined",name:data2.name});
            });

          }
      });
      }) ;
    }
  });
});
//-----------------User has clicked the Search option for public groups and friends -----------------------------
socket.on("clickedpublicsearch",function(data2){
  PGroup.findOne({hashtag:data2.grpname},function(err,cgroup){
    if(!err){
      var isMember = false ;
      cgroup.users.forEach(function(f){
        if(data2.name===f.username){
          isMember = true ;
        }
      });
      if(isMember){
        var output = {statement:"already a member",name:data2.name};
        
        io.emit("joingroup",output);
      }
      else{
var output = {statement:"" , name:data2.name};
       io.emit("joingroup",output); 
      }
    }
  });
});

//-------------------------------------------------------------------------------------21444444444444444444444444443333
 socket.on("getimg",function(data2){
      User.findOne({username:data2.frname},function(err,fuser){
        if(!err){
        Message.findOne({from:data2.frname},function(err,guser){
        if(!err){
        io.emit("frimg2",{lmsg:guser ,frname:fuser,usname1:data2.usname});
      }

      });
      }  
  });
      
 });
// --------------Load previous messages of a user with another user -----------------------------------
  socket.on("loaded-message",function(data2){
             User.findOne({username:data2.from},function(err,fuser){
            if(err){console.log(err);}
            else{
              var messagefrom = {"users":data2.to};
              User.findByIdAndUpdate(fuser._id,{$pull:{newmessages:messagefrom}},{new:true},
                function(err,cuser){
                  if(err){console.log(err);}
                  else{
                    io.emit("newmessagefrom",cuser) ;
                  }
              });
            }
         });
              User.findOne({username:data2.to},function(err,fuser){
            if(err){console.log(err);}
            else{
                io.emit("friendimage",fuser);
            }
          });
    Message.findOne({from:data2.from,to:data2.to},function(err,cuser){
        if(err){
          console.log(err);
        }else{
          io.emit("previous-message",cuser);
        }
      });
  });
  //------------------Emitting the member names of a public group-------------------------------- 
  socket.on("member-names",function(data2){
     console.log(data2);
      PublicGroup.findOne({hashtag:data2},function(err,cgroup){
          if(err){
            console.log(err);
          }
          else{
            io.emit("names-here",cgroup);
          }
      });
  });
  //-------------------Loading the previous messages of a specific private group ------------------------- 
 socket.on("loaded-message-group",function(data2){
   User.findOne({username:data2.from},function(err,fuser){
            if(err){console.log(err);}
            else{
              var messagefrom = {"users":data2.to};
              User.findByIdAndUpdate(fuser._id,{$pull:{newmessages:messagefrom}},{new:true},
                function(err,cuser){
                  if(err){console.log(err);}
                  else{
                    io.emit("newmessagefrom",cuser) ;
                  }
              });
            }
         });
     GroupMessage.findOne({to:data2.to},function(err,cuser){
        if(err){
          console.log(err);
        }else{
          console.log(cuser);
          io.emit("previous-group-message",cuser);
        }
      });
  });
//-----------------------Loading the previous messages of a specific public group ------------------------- 
socket.on("loaded-message-p-group",function(data2){
   User.findOne({username:data2.from},function(err,fuser){
            if(err){console.log(err);}
            else{
              var messagefrom = {"users":data2.to};
              User.findByIdAndUpdate(fuser._id,{$pull:{newmessages:messagefrom}},{new:true},
                function(err,cuser){
                  if(err){console.log(err);}
                  else{
                    io.emit("newmessagefrom",cuser) ;
                  }
              });
            }
         });
     GMessage.findOne({to:data2.to},function(err,cuser){
        if(err){
          console.log(err);
        }else{
          console.log(cuser);
          io.emit("previous-group-p-message",cuser);
        }
      });
  });

//-----------Emitting any newmessages to the user since the session he last logged in -----------------------------
  socket.on("userloggedin",function(data2){
     User.findOne({username:data2},function(err,fuser){
            if(err){console.log(err);}
            else{
              console.log(fuser);
              io.emit("newmessagefrom",fuser);
            }
         });
  });
//-------------Sending message to a specific user ------------------------------------------------------------------
  socket.on("send-message",function(data1){
         console.log(data1.msg);
         var messagefrom = {"users":data1.from};
         User.findOne({username:data1.to},function(err,fuser){
      //---------------------Saving the message as recently sent for both current user and receiving user-------------
            if(err){console.log(err);}
            else{
              var isPresent  = false ;
              var isPresent1 = false ;
              fuser.newmessages.forEach(function(f){
                if(data1.from === f.users){
                  isPresent = true ;
                }
              });
                fuser.recentmessages.forEach(function(f){
                if(data1.from === f.users){
                  isPresent1 = true ;
                }
              });
              console.log(isPresent) ;
              ////////////////////////////////////////
              if(!isPresent1){
                          
                User.findOne({ username:data1.to},function(err,duser){
                  if(duser.recentmessages.length===10){
                    var lastname = {"users": duser.recentmessages[9].users} ;
                    console.log(duser.recentmessages[9].users);
                       duser.update({$pull : {recentmessages:lastname}},{new:true},function(err,guser){
                          if(!err){
                            console.log(guser);
                          User.findOneAndUpdate({username:data1.to},{$addToSet:{recentmessages:messagefrom}},{new:true},function(err,huser){
                           io.emit("recentmessage",huser);
                          });
                        }
                       });

                  }
                else{
                   User.findOneAndUpdate({username:data1.to},{$addToSet:{recentmessages:messagefrom}},{new:true},function(err,huser){
                            io.emit("recentmessage",huser);
                          });
                }  
                
                });
              }
              ///////////////////////////////////////////
              else{

              
                  User.findOneAndUpdate({ username:data1.to},{$pull:{recentmessages:messagefrom}},function(err,duser){
                  if(duser.recentmessages.length===10){
                    var lastname = {"users": duser.recentmessages[9].users} ;
                    console.log(duser.recentmessages[9].users);
                       duser.update({$pull : {recentmessages:lastname}},{new:true},function(err,guser){
                          if(!err){
                           User.findOneAndUpdate({username:data1.to},{$addToSet:{recentmessages:messagefrom}},{new:true},function(err,huser){
                           io.emit("recentmessage",huser);
                          });
                        }
                       });

                  }
                else{
                   User.findOneAndUpdate({username:data1.to},{$addToSet:{recentmessages:messagefrom}},{new:true},function(err,huser){
                            io.emit("recentmessage",huser);
                          });
                }  
                
                });
              }
              ///////////////////////////////////////////
              if(!isPresent){
              
              User.findByIdAndUpdate(fuser._id,{$addToSet:{newmessages:messagefrom}},{new:true},
                function(err,cuser){
                  if(err){console.log(err);}
                  else{
                    io.emit("newmessagefrom",cuser) ;
                  }
                }
                );
            }
          }
         });
         var newmessage2 = {"users": data1.to};
      
      User.findOne({username:data1.from},function(err,fuser){
 if(err){console.log(err);}
            else{
          
              var isPresent1 = false ;
                fuser.recentmessages.forEach(function(f){
                if(data1.to === f.users){
                  isPresent1 = true ;
                }
              });
                    if(!isPresent1){
                User.findOne({ username:data1.from},function(err,duser){
                  if(duser.recentmessages.length===10){
                    var lastname = {"users": duser.recentmessages[9].users} ;
                    console.log(duser.recentmessages[9].users);
                       duser.update({$pull : {recentmessages:lastname}},{new:true},function(err,guser){
                          if(!err){
                            console.log(guser);
                          User.findOneAndUpdate({username:data1.from},{$addToSet:{recentmessages:newmessage2}},{new:true},function(err,huser){
                           io.emit("recentmessage",huser);
                          });
                        }
                       });

                  }
                else{
                   User.findOneAndUpdate({username:data1.from},{$addToSet:{recentmessages:newmessage2}},{new:true},function(err,huser){
                            io.emit("recentmessage",huser);
                          });
                }  
                
                });
              }
              ///////////////////////////////////////////
              else{

                  User.findOneAndUpdate({ username:data1.from},{$pull:{recentmessages:newmessage2}},{new:true},function(err,duser){
                  if(duser.recentmessages.length===10){
                    var lastname = {"users": duser.recentmessages[9].users} ;
                    console.log(duser.recentmessages[9].users);
                       duser.update({$pull : {recentmessages:lastname}},{new:true},function(err,guser){
                          if(!err){
                           User.findOneAndUpdate({username:data1.from},{$addToSet:{recentmessages:newmessage2}},{new:true},function(err,huser){
                           io.emit("recentmessage",huser);
                          });
                        }
                       });

                  }
                else{
                   User.findOneAndUpdate({username:data1.from},{$addToSet:{recentmessages:newmessage2}},{new:true},function(err,huser){
                            io.emit("recentmessage",huser);
                          });
                }  
                
                });
              }
            }
      });
      //-------------storing message to database -------------------------------------------------------------------------
 Message.findOne({from:data1.to,to:data1.from},function(err,cuser){

        if(err){
          console.log(err);
        }else{
              ms = { "data": data1.from + " : " + data1.msg} ;
              
              Message.findOneAndUpdate({_id : cuser._id},{$push: { messaged : ms}},function(err,duser){
                if(err){
                  console.log(err);
                }
              });
            }
          });

     Message.findOne({from:data1.from,to:data1.to},function(err,cuser){

        if(err){
          console.log(err);
        }else{
              ms = { "data": data1.from + " : " + data1.msg} ;
              
              Message.findOneAndUpdate({_id : cuser._id},{$push: { messaged : ms}},{new:true},function(err,duser){
                if(err){
                  console.log(err);
                }
                // else{
                    console.log(duser);
                   io.emit("new-message",duser);
                // }

              });
            }
});        

       });
      

//-----------------sending new message to a public group-------------------------------------------------------------
socket.on("send-message-p-grp",function(data1){
    var messagefrom = {"users":data1.to};

    PGroup.findOne({hashtag:data1.to},function(err,cgroup){
      if(err){
        console.log(err);
      }
      else{
        cgroup.users.forEach(function(f){
          if(f.username !== data1.from){

         User.findOne({username:f.username},function(err,fuser){
            if(err){console.log(err);}
            else{
              var isPresent  = false ;
              fuser.newmessages.forEach(function(g){
                if(data1.to === g.users){
                  isPresent = true ;
                }
              });
              console.log(isPresent) ;
              if(!isPresent){
          
              User.findByIdAndUpdate(fuser._id,{$addToSet:{newmessages:messagefrom}},{new:true},
                function(err,cuser){
                  if(err){console.log(err);}
                  else{
                    io.emit("newmessagefrom",cuser) ;
                  }
                });
            }
          }

         });
          }
        });
          }
       


     GMessage.findOne({to:data1.to},function(err,cuser){

        if(err){
          console.log(err);
        }else{
              ms = { "data": data1.from + " : " + data1.msg} ;
              
              GMessage.findOneAndUpdate({_id : cuser._id},{$push: { messaged : ms}},{new:true},function(err,duser){
                if(err){
                  console.log(err);
                }
                // else{
                    
                   io.emit("new-message-p-grp",{getmsg:duser,getusers:cgroup});
                // }

              });
            }
          });

       });         
  });

// ----------------------------sending message to a private group ---------------------------------------------------------
  socket.on("send-message-grp",function(data1){
    var messagefrom = {"users":data1.to};
    //-----------------------storing as recent private group meessage ------------------------------------------------------
        PublicGroup.findOne({hashtag:data1.to},function(err,cgroup){
      if(err){
        console.log(err);
      }
      else{
        cgroup.users.forEach(function(f){

         User.findOne({username:f.username},function(err,fuser){
            if(err){console.log(err);}
            else{
              var isPresent  = false ;
              fuser.recentgpmessages.forEach(function(g){
                if(data1.to === g.users){
                  isPresent = true ;
                }
              });
              console.log(isPresent) ;
              User.findById(fuser._id,function(err,usser){
             if(!err){
             var lastman = {"users" : usser.recentgpmessages[9]} ;
              if(usser.recentgpmessages.length===10){
                usser.update({$pull:{recentgpmessages:lastman}});
              }
            }
          });
              if(!isPresent){
          
              User.findByIdAndUpdate(fuser._id,{$addToSet:{recentgpmessages:messagefrom}},{new:true},
                function(err,tuser){
                  if(err){console.log(err);}
                  else{
                    io.emit("recentgrpmsg",tuser) ;
                  }
                });
            }
            else{
                    User.findByIdAndUpdate(fuser._id,{$pull:{recentgpmessages:messagefrom}},{new:true},
                function(err,kuser){
                  if(err){console.log(err);}
                });
                      User.findByIdAndUpdate(fuser._id,{$addToSet:{recentgpmessages:messagefrom}},{new:true},
                function(err,tuser){
                  if(err){console.log(err);}
                  else{
                    io.emit("recentgrpmsg",tuser) ;
                  }
                });
            }
          }

         });
          
        });
          }
        });

    PublicGroup.findOne({hashtag:data1.to},function(err,cgroup){
      if(err){
        console.log(err);
      }
      else{
        cgroup.users.forEach(function(f){
          if(f.username !== data1.from){

         User.findOne({username:f.username},function(err,fuser){
            if(err){console.log(err);}
            else{
              var isPresent  = false ;
              fuser.newmessages.forEach(function(g){
                if(data1.to === g.users){
                  isPresent = true ;
                }
              });
              console.log(isPresent) ;
              if(!isPresent){
          
              User.findByIdAndUpdate(fuser._id,{$addToSet:{newmessages:messagefrom}},{new:true},
                function(err,cuser){
                  if(err){console.log(err);}
                  else{
                    io.emit("newmessagefrom",cuser) ;
                  }
                });
            }
          }

         });
          }
        });
          }
       

      //----------------------saving message to database --------------------------------------------------------------
     GroupMessage.findOne({to:data1.to},function(err,cuser){

        if(err){
          console.log(err);
        }else{
              ms = { "data": data1.from + " : " + data1.msg} ;
              
              GroupMessage.findOneAndUpdate({_id : cuser._id},{$push: { messaged : ms}},{new:true},function(err,duser){
                if(err){
                  console.log(err);
                }
                // else{
                    
                   io.emit("new-message-grp",{getmsg:duser,getusers:cgroup});
                // }

              });
            }
          });

       });         
  });

//-----------------------------------------------------------------------------444444444444444444444444444444444444444444444444
  socket.on("getgrpmsg",function(data1){
    GroupMessage.findOne({to:data1.grpname},function(err,cgroup){
        if(!err){
          io.emit("grpmsg",{grp:cgroup,usname1:data1.usname});
        }
    });
  });

//-----------------------------creating a public group ----------------------------------------------------------------------
socket.on("createpgroup",function(data2){
          console.log(data2);
          var userss = {"username": data2.maker };
          var output = {"name":data2.maker , "state":""} ;
             PublicGroup.find({hashtag:data2.hashtagname}).count({},function(err,count1){

            
                console.log(count1);
                PGroup.find({ hashtag : data2.hashtagname}).count({},function(err,count){
                  
                    
                  
                   if(err || count !== 0 || count1 !==0){
                    statement = "group already exists";
                    output = {"name":data2.maker , "state":statement} ;
                      io.emit("pgroupcreated",output) ; 
                  } 
                  else{
                      grouphashtag = {"hashname" :data2.hashtagname};
                      User.findByIdAndUpdate(data2.id,
                      {$addToSet: {pgrp: grouphashtag}},
                      function(err, cuser) {
                        if(err){
                          console.log(err);
                        }

                      });
                      var newpubgroup = new PGroup({groupname :data2.groupname, hashtag:data2.hashtagname,admin:data2.maker,users: userss }); 
                      newpubgroup.save(function(err){
                        if(err){
                            console.log(err);
                            }
                      });
                      var newgroupmessage = new GMessage({to : data2.hashtagname});
                      newgroupmessage.save(function(err){
                        if(err){
                            console.log(err);
                            }
                      });
                      statement = "group created";
                      output = {"name":data2.maker , "state":statement} ;

                      io.emit("pgroupcreated",output) ; 
                  }
                });
              
            });  
           
    });



});

//------------------------------------listen to local port -----------------------------------------------------------------------------
server.listen(port,function(){
  console.log("server running!!!!");
});

