var express = require('express');
var router = express.Router();
var authCtrl =  require("../controllers/authController");

module.exports = function(passport){

	// TWITTER
	router.get('/twitter', passport.authenticate('twitter'));
	router.get('/twitter/callback', 
	  passport.authenticate('twitter', authCtrl.socialLoginLogic)
	);

	
	// FACEBOOK
	router.get('/facebook', passport.authenticate('facebook'));
	router.get('/facebook/callback',
	  passport.authenticate('facebook', authCtrl.socialLoginLogic)
	);

	router.get('/signout', authCtrl.logout);	 
	
	return router;
};