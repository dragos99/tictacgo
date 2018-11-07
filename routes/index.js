var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
	var ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
	console.log('Request incoming from ' + ip);
	res.sendFile(path.join(__dirname, '../public/index.html'));
});



// POST /gameLog
router.post('/gameLog', (req, res) => {
	var date = new Date();
	var day = date.getDate();
	var hour = date.getHours();
	var min = date.getMinutes();
	var fileName = day + '-' + hour + '-' + min + '.log';

	fs.writeFile('./gameLogs/' + fileName, req.body.data, (err) => {
		if (err) {
			console.log('Couldn\' save game log ' + fileName);
			return;
		}

		res.send({msg: 'Game log received! Thank you!'});
	});
});


// GET /heuristic
router.get('/heuristic', (req, res) => {
	res.send({msg: heuristic});
	return ;
});


// GET /getGameLog
router.get('/getGameLog', (req, res) => {
	var gameLogId = req.query.data;

	fs.readFile('./gameLogs/' + gameLogId + '.log', (err, data) => {
		if(err) {
			console.log('Error reading game log file ' + gameLogId);
		}

		res.send({msg: data + ''});
		return;
	});
});


module.exports = router;








// POST /login
/*router.post('/login', (req, res) => {
	var data = req.body.data;
	if (data.username && data.password) {
		User.authenticate(data.username, data.password, function(error, user) {
			if(error || !user){
				return res.send({msg: 'Wrong username or password'});
			} else {
				req.session.userId = user._id;
				return res.send({msg: 'success'});
			}
		});
	} else {
		res.send({msg: 'All fields required!'});
	}
});*/


/*// POST /register
router.post('/register', (req, res) => {
	var data = req.body.data;
	if (data.email && data.username && data.password) {
		// create object with form input
		var userData = {
			email: data.email,
			username: data.username,
			password: data.password
		};

		// use schema's `create` method to insert document into Mongo
		User.create(userData, function(err, user) {
			if(err) {
				res.send({msg: 'Couldn\'t create new user!'});
				return;
			} else {
				req.session.userId = user._id;
				res.send({msg: 'success'});
			}
		});

	} else {
		res.send({msg: 'All fields required!'});
	}
});*/


/**
 *
 * Read bot's heuristic from file
 *
 */
var heuristic = [];

var data = fs.readFileSync('./heuristic.txt', {encoding: 'utf-8'});
var lines = data.split('\n');
var values = [];
for(var i = 0; i < lines.length; ++i){
	values = lines[i].split(' ');
	heuristic.push([values[0], values[1]]);
}