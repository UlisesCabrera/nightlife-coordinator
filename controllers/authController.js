exports.socialLoginLogic = {
	// if success go to home page, if not stay at login '#' angular view
		 successRedirect: '/',
         failureRedirect: '/#login'
};

exports.logout = function(req, res) {
	// only works if there an actual user logged in.
	if (req.user) {
		req.logout();
		res.redirect('/');
	}
};