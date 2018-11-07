var fs = require('fs');
var compression = require('compression');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);
var helmet = require('helmet');
var express = require('express');
var app = express();

app.enable('trust proxy');

// database connection
/*mongoose.connect('mongodb://tictacadmin:r26wsujx3cde@ds147995.mlab.com:47995/tictacgo');
var db = mongoose.connection;
db.on('error', function(err) {
	throw err;
});*/


// use middlewears
app.use(compression());
app.use(helmet());
/*app.use(session({
	secret: 'doYouWannaKnowMySecret?',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));
*/

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 


// include routes
var main = require('./routes/index');
var mobile = require('./routes/app');
app.use('/app', mobile);
app.use('/', main);


// serve static files from /public
app.use(express.static(__dirname + '/public'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	return res.send('Not found!');
});


// listen on port 3001
app.listen(3001, () => {
	var env = app.get('env');
	console.log('Server is running in %s on port %d', env, 3001);
});



