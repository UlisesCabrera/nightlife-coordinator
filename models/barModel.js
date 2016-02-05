var mongoose = require('mongoose');


var barsSchema = new mongoose.Schema({
	barId: String,
    whoIsGoing: Array
});

// declare a model called User Which has schema userSchema.
mongoose.model("Bar", barsSchema);