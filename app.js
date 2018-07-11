var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    Message        = require("./models/message"),
    PublicGroup        = require("./models/publicgroup"),
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

app.get("/signedin/:id",function(req,res){
  var addedFriend = "" ;
  whichPage = "two";
  whichPage2 = "six" ;
  res.render("signedin.ejs",{addedFriend:addedFriend,whichPage:whichPage,whichPage2:whichPage2,searchedFriend:searchedFriend});
});


app.post("/signedin/:id",function(req,res,next){
  console.log(req.body.addfriend);
      

  User.findOne({ username : req.body.addfriend},function(err,fuser){
    if (err) {
         res.send("fu");
             }
    else{
         User.find({ username : req.body.addfriend}).count({},function(err,count){
        if(!err && count!==0){
           
           var friend = {"name": fuser.username, "propic":fuser.profileImage} ;
           
    User.findByIdAndUpdate(req.params.id,
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
            res.render("signedin.ejs",{addedFriend:addedFriend,whichPage:whichPage,whichPage2:whichPage2,searchedFriend});
            }
           });
         }
      });
    }
     else{
       var addedFriend = "no such  friend can be added";
       whichPage="two" ;
       whichPage2 = "six" ;
       res.render("signedin.ejs",{addedFriend:addedFriend,whichPage:whichPage,whichPage2:whichPage2,searchedFriend:searchedFriend}) ;
         }
          });
        }
    });
});

app.post("/Sfriends/:id",function(req,res){
  // User.findById(req.params.id,function(err,cuser){
  //   cuser.friends.
  // });

  
});

app.get("/searchfriends/:id",function(req,res){
  // User.findById(req.params.id,function(err,cuser){
  //   cuser.friends.
  // });
  searchedFriend = {} ;
  whichPage="three";
  whichPage2 = "six" ;
  res.render("signedin.ejs",{whichPage:whichPage,searchedFriend:searchedFriend,whichPage2:whichPage2,addedFriend:addedFriend});
});

app.get("#friends/:id",function(req,res){
  // User.findById(req.params.id,function(err,cuser){
  //   cuser.friends.
  // });
  whichPage = "four" ;
    whichPage2 = "six" ;

  res.render("signedin.ejs",{searchedFriend:searchedFriend,whichPage:whichPage,whichPage2:whichPage2,addedFriend:addedFriend});
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/login");
});

app.get("/chat/:friendname",function(req,res){
      whichPage = "one" ;
      whichPage2 = "five" ;
      res.render("signedin.ejs",{friendname:req.params.friendname,whichPage2:whichPage2,whichPage:whichPage,searchedFriend:searchedFriend,addedFriend:addedFriend}) ;
     
  
    
});

io.sockets.on("connection",function(socket){
     socket.on("createpubgroup",function(data2){
          console.log(data2);
          var userss = {"username": data2.maker };
                PublicGroup.find({ hashtag : data2.hashtagname}).count({},function(err,count){
                  
                    
                  
                   if(err || count !== 0){
                    statement = "group already exists";
                      io.emit("groupcreated",statement) ; 
                  }
                  else{
                      var newpubgroup = new PublicGroup({groupname :data2.groupname, hashtag:data2.hashtagname,users: userss }); 
                      newpubgroup.save(function(err){
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
          io.emit("friend-list-emitted",cuser.friends) ;  
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
    Message.findOne({from:data2.from,to:data2.to},function(err,cuser){
        if(err){
          console.log(err);
        }else{
          io.emit("previous-message",cuser);
        }
      });
  });

  socket.on("send-message",function(data1){
    // console.log(data);
    //  socket.frname = data.to ;
    //  frnames.push(socket.frname);
    // console.log(data.from);
         console.log(data1.msg);
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
     
  });
















server.listen(port,function(){
  console.log("server running!!!!");
});

// https://sheltered-island-82789.herokuapp.com/