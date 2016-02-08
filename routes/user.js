

var express = require('express');
var router = express.Router();



router.post('/login', function (req, res, next) {

});

router.post('/register', function (req, res, next) {
	console.log(req.body);/*
	var username = req.body.username;
	var name = req.body.name;
	var password = req.body.password;
	if (!username) {
		return res.status(400).json({error: 'InvalidUserName'});
	}
	if (!name) {
		return res.status(400).json({error: 'InvalidName'});
	}
	if (!password) {
		return res.status(400).json({error: 'InvalidPassword'});
	}

	  // TODO:
	  // Hash passwords!!!!!

	  // Check if username exists -> Throw 409.
	  var query = {where: {username: username}};
	  models.User.findOne(query).then(function(user) {
	  	if (user) {
	  		return res.status(409).json({error: 'UserNameExists'});
	  	}
	  	models.User.create({
	  		username: username,
	  		name: name,
	  		password: password //TODO: Save the hash, not the pass!!!
	  	}).then(function userCreated(createdUser){
	  		console.log(createdUser.get({
	  			plain:true
	  		});
	  	}, function(err) {
	  		return res.status(500).json({error: 'ServerError'});
	  	});*/
	res.sendStatus(200);
});

router.get('/logout', function (req, res, next) {

});

router.get('/:id/messages', function (req, res, next) {

});

module.exports = router;