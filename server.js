var express = require('express');
var path = require('path'); 
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var app = express();

//Establish connection with MongoDB
var new_db = "mongodb://localhost:27017/demo_database";

app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/index.html');
});

app.use('/public', express.static(__dirname + '/public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true}));

//For hash the PASSWORD
var getHash = function( pass , phone ){
				
				var hashPass = crypto.createHmac('sha512', phone);
				data = hashPass.update(pass);
				gen_hashPass= data.digest('hex');
				return gen_hashPass;
}

//Registration function start from here
app.post('/registration' ,function(req,res){
	var name = req.body.name;
	var gender = req.body.gender;
	var email= req.body.email;
	var pass = req.body.password;
	var phone = req.body.phone;
	var password = getHash( pass , phone ); 				

	
	var data = {
		"name":name,
		"gender":gender,
		"email":email,
		"password": password, 
		"phone" : phone
	}
	
	mongo.connect(new_db , function(error , db){
		if (error){
			throw error;
		}
		console.log("connected to database successfully");

		db.collection("UserRegistration").insertOne(data, (err , collection) => {
			if(err) throw err;
			console.log("Record inserted successfully");
			console.log(collection);
		});
	});
	
	console.log("DATA is " + JSON.stringify(data) );
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/success.html');  

});

app.listen(9999, function(err){
	if(err) throw  err;
	else
	console.log("Server Running on Port : 9999");
});