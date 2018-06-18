var express = require("express");
var app = express();

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


app.listen(3000,function(){
	console.log("server running!!!!");
});
