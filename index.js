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
    searchedFriend = {},
    addedFriend = "" ,
    whichPage = "one" ;
    whichPage2 = "six" ;
    frnames = [] ,
   // Friend        = require("./models/friends"),
   // addedFriend = "",
    multer = require("multer"),
    path = require("path"),
    server= require("http").createServer(app),
    io = require("socket.io").listen(server) 



    mongoose.Promise = global.Promise;
//mongodb://localhost/login-ashgen.......process.env.DATABASEURL
  mongoose.connect(process.env.DATABASEURL,{useMongoClient:true})
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));

// MULTER CONFIGURATIONS ---
    var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    
    cb(null, file.originalname);
  }
});
function fileFilter(req, file, cb){
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
app.use(express.static(__dirname + "/uploads"));

app.use(bodyParser.urlencoded({extended: true}));
// app.set("view engine", "ejs");
 app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION------------
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


// ---------ROUTES--------------------
app.get("/",function(req,res){
  res.redirect("/register");
});
app.get("/login",function(req,res){
 // res.sendFile(path.join(__dirname+'/login.html')); 
  res.render("login.ejs");
});
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/signedin",
        failureRedirect: "/register"
    }), function(req, res){
});
app.get("/register",function(req,res){
  res.render("register.ejs");
});
app.post("/register",upload.single('profileImage'), function(req, res,next){
    
    var newUser = new User({username: req.body.username,email:req.body.emailid,profileImage: req.file.filename});
    
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
app.get("/signedin",function(req,res){
  var addedFriend = "" ;
  whichPage2 = "six" ;
  res.render("signedin.ejs",{addedFriend:addedFriend,whichPage:whichPage,searchedFriend:searchedFriend});
});


app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/login");
});


io.sockets.on("connection",function(socket){
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
           // console.log(isPresent) ;
            io.emit("member-removed","member does not exist") ;
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
                                   
                                    var statement = "member removed" ;
                                    io.emit("member-removed",statement);
                              
                                    // var statement = "member does not exist" ;
                                    // io.emit("member-removed",statement);
                                  }
                      
                      });
                
                          
                        }
         });
       }
              }
          });
          //console.log(isPresent) ;
          
       });
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
                          io.emit("subadmin-removed","member removed as a subadmin");
                        }
                      });
              }else{
                  io.emit("subadmin-removed", "no such subadmin exists");
              }
          });   
          
       });
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
                          io.emit("add-member-result",statement);
                        }
                      });
                }
                else{
                  var statement = "member already present";
                          io.emit("add-member-result",statement);
                }
                });
              }
          });
      });

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
                          io.emit("subadmin","member made subadmin");
                        }
                      });
              }else{
                  io.emit("subadmin", "no such member exists");
              }
          });
      });
        socket.on("settings-to-show",function(data2){
          PublicGroup.findOne({hashtag:data2},function(err,cgroup){
              io.emit("settings-emitted",cgroup);
          });
        });
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
     socket.on("createpubgroup",function(data2){
          console.log(data2);
          var userss = {"username": data2.maker };
                PublicGroup.find({ hashtag : data2.hashtagname}).count({},function(err,count){
                  
                    
                  
                   if(err || count !== 0){
                    statement = "group already exists";
                      io.emit("groupcreated",statement) ; 
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
                      io.emit("groupcreated",statement) ; 
                  }
                });
              
              
           
    });

    socket.on("show-friend-list",function(data2){
      User.findById( data2.id,function(err,cuser){
        if(err){
          console.log(err);
        }else{
          io.emit("friend-list-emitted",cuser) ;  
        }
          });
      
    });

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
            // res.render("signedin.ejs",{addedFriend:addedFriend,whichPage:whichPage,whichPage2:whichPage2,searchedFriend});
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
           //console.log(isPresent) ;

  }
     else{
       var addedFriend = "no such  friend can be added";
       whichPage="two" ;
       whichPage2 = "six" ;
       //res.render("signedin.ejs",{addedFriend:addedFriend,whichPage:whichPage,whichPage2:whichPage2,searchedFriend:searchedFriend}) ;
       io.emit("friend-added",addedFriend);
         }
          });
        }
    });
  });

     socket.on("search-friend-name",function(data2){
        User.findById(data2.id,function(err,cuser){
    if(err){
      console.log(err);
    }
    else{
      var isFriend = false ;
      searchedFriend = {} ;
      cuser.friends.forEach(function(f){
          
           if(f.name===data2.friendname){
                
                isFriend = true ;
                searchedFriend = f ;
              } 
      }) ;
      } 
      if(isFriend){
        console.log(searchedFriend.name);
        whichPage = "three" ;
        whichPage2 = "six" ;
        io.emit("friend-searched", searchedFriend);
        }
        else{
           whichPage = "three" ;
           whichPage2 = "six" ;
           console.log(searchedFriend.name);
          io.emit("friend-searched", searchedFriend);
        }
  });
  });


  socket.on("loaded-message",function(data2){
             User.findOne({username:data2.from},function(err,fuser){
            if(err){console.log(err);}
            else{
              var messagefrom = {"users":data2.to};
              User.findByIdAndUpdate(fuser._id,{$pull:{newmessages:messagefrom}},{new:true},
                function(err,cuser){
                  if(err){console.log(err);}
                
                }
                );
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
 socket.on("loaded-message-group",function(data2){
     GroupMessage.findOne({to:data2.to},function(err,cuser){
        if(err){
          console.log(err);
        }else{
          console.log(cuser);
          io.emit("previous-group-message",cuser);
        }
      });
  });

  socket.on("userloggedin",function(data2){
     User.findOne({username:data2},function(err,fuser){
            if(err){console.log(err);}
            else{
              console.log(fuser);
              io.emit("newmessagefrom",fuser);
            }
         });
  });
  socket.on("send-message",function(data1){
    // console.log(data);
    //  socket.frname = data.to ;
    //  frnames.push(socket.frname);
    // console.log(data.from);
         console.log(data1.msg);
         var messagefrom = {"users":data1.from};
         User.findOne({username:data1.to},function(err,fuser){
            if(err){console.log(err);}
            else{
              User.findByIdAndUpdate(fuser._id,{$addToSet:{newmessages:messagefrom}},{new:true},
                function(err,cuser){
                  if(err){console.log(err);}
           
                }
                );
            }
         });

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

     // Message.findOne({from:data1.from,to:data1.to},function(err,kuser){
     //      if(err){
     //      console.log(err);
     //    }else{
     //      console.log(kuser);
     //           io.emit("new-message",kuser);
     //    }
     // });         

       });
      

       socket.on("send-message-grp",function(data1){

    PublicGroup.findOne({hashtag:data1.to},function(err,cgroup){
      if(err){
        console.log(err);
      }
      else{
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
                    console.log(cgroup);
                   io.emit("new-message-grp",{getmsg:duser,getusers:cgroup});
                // }

              });
            }
          });

           }
      });
       });     
  });
















server.listen(port,function(){
  console.log("server running!!!!");
});

// https://sheltered-island-82789.herokuapp.com/