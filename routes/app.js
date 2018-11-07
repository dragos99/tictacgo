var http = require('http');
var graph = require('fbgraph');
var User = require('../models/user');
var express = require('express');
var router = express.Router();



// Enable CORS
router.use(function(res, req, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});


router.get('/leaderboard', function(req, res) {
	if(req.session && req.session.userId) {
		User.find({}, function(err, data) {
			if(err) {
				res.send({msg: {status: 'There was a problem with the server!'}});
				return;
			}

			var users = [];
			for(var i = 0; i < data.length; ++i) {
				var user = {
					name: data[i].profile.name,
					picture: data[i].profile.picture,
					apples: data[i].profile.apples
				};
				users.push(user);
			}

			res.send({msg:{status: 'success', data: users}});
		});
	} else {

		res.send({msg:{status: 'Please sign in!'}});
	}
});

router.post('/me', validate, function(req, res) {
	var data = req.body.data;
	
	// login user
	if(!req.session.userId) {
		User.authenticate(data.id, function(err, user) {
			if(err) {
				res.send({msg: err});
				return;
			}

			// register new user
			if(!user) {
				registerUser(req, res, data);
				return;		
			}

			req.session.userId = user._id;
			updateUserProfile(user, data);

			res.send({msg: 'success'});
		});
	} else {
		User.findById(req.session.userId, function(err, user) {
			if(err || !user) {
				res.send({msg: 'Couldn\'t retrieve your profile!'});
				req.session.destroy();
				return;
			}

			updateUserProfile(user, data);
			res.send({msg: 'success'});
		});
	}
});

router.post('/updateApples', function(req, res){
	if(req.session.userId) {
		var data = req.body.data;
		User.findById(req.session.userId, function(err, user) {
			if(err || !user) {
				res.send({msg: 'Couldn\'t retrieve your profile!'});
				req.session.destroy();
				return;
			}
			
			// save his apples
			user.profile.apples = data.apples;
			user.save();

			res.send({msg: 'success'});
		});
	} else {
		res.send({msg: 'Please sign in!'});
	}
});


router.post('/logout', function(req, res) {
	if(req.session){
		req.session.destroy();
	}

	res.send({msg: 'success'});
});


function registerUser(req, res, data) {
	var userData = {
		id: data.id,
		email: data.email,
		profile: {
			name: data.name,
			picture: data.picture,
			apples: data.apples
		}
	};

	User.create(userData, function(err, user) {
		if(err) {
			res.send({msg: 'Something went wrong! Please try again!'});
			return;
		}

		req.session.userId = user._id;
		res.send({msg: 'success'});
	});
}


function validate(req, res, next) {
	if(req.session.userId) {
		next();
		return;
	}

	//TODO: validate accessToken
	var data = req.body.data;
	if(!data || !data.accessToken) {
		return;
	}

	console.log(data);

	graph.get('me?fields=id&access_token=' + data.accessToken, function(err, response) {
		if(response.id === data.id) {
			next();
		} else {
			req.session.destroy();
			res.send({msg: 'Not a valid access token!'});
		}
	});
}



function updateUserProfile(user, data){
	user.id = data.id;
	user.email = data.email;
	user.profile.apples = data.apples;
	user.profile.name = data.name;
	user.profile.picture = data.picture;

	user.save();
}










module.exports = router;