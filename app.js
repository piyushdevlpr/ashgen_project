var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
app.get("/",function(req,res){
 // res.sendFile(path.join(__dirname+'/login.html'));	
	res.render("login.ejs");
});
app.get("/register",function(req,res){
	res.render("register.ejs");
});
app.get("/signin",function(req,res){
	res.render("signin.ejs");
});


app.listen(port,function(){
	console.log("server running!!!!");
});

// https://sheltered-island-82789.herokuapp.com/