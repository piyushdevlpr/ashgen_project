var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user")
    
    
 mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/login_ashgen',{useMongoClient:true})
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

app.use(bodyParser.urlencoded({extended: true}));
// app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
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
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
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
	res.render("signedin.ejs");
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/login");
});

app.listen(port,function(){
	console.log("server running!!!!");
});

// https://sheltered-island-82789.herokuapp.com/