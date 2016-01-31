var mongoose = require('mongoose');

var placesSchema = new mongoose.Schema({
    placeId : {type: String , required: true},
    going: Boolean
});

var userSchema = new mongoose.Schema({
	username: {type: String , required: true},
	password: {type: String , required: true}, //hash created from password
	created_at: {type: Date, default: Date.now},
	going: [placesSchema]
});

// declare a model called User Which has schema userSchema.
mongoose.model("User", userSchema);