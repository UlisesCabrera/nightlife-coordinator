var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: {type: String , required: true},
	password: {type: String , required: true},
	created_at: {type: Date, default: Date.now}
});

// declare a model called User Which has schema userSchema.
mongoose.model("User", userSchema);