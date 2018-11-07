var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	email: {type: String, unique: true, required: true, trim: true},
	id: {type: String, required: true},
	profile: {
		name: String,
		picture: String,
		apples: Number
	}
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(id, callback) {
	User.findOne({id: id}, function(err, user) {
		if(err) {
			callback(error);
			return;
		}

		callback(null, user);
	});
}

var User = mongoose.model('User', UserSchema);
module.exports = User;