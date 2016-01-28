var express = require('express');
var app = express();
var http = require('http').Server(app);
var jwt = require('jsonwebtoken');
var io = require('socket.io')(http);
var socketioJwt = require('socketio-jwt');
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var jwtSecret = "salalause";

app.get('/', function(req, res) {
	res.send("<html><head><title>Hello</title><body><h1>Hello!</h1></body></html>");
})

app.post('/login', function (req, res) {
	//TODO validate req.body.username and req.body.password
	//if is invalid, return 401
	console.log(req.body);
	if (!(req.body.username === 'foo' && req.body.password === 'bar')) {
	  res.send(401, 'Wrong user or password');
	  return;
	}

  // TODO: validate the actual user user
  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  };

  // we are sending the profile in the token
  var token = jwt.sign(profile, jwtSecret, { expiresInMinutes: 60*5 });

  res.json({token: token});
});

app.listen(3000);