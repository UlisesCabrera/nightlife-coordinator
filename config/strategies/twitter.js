var TwitterStrategy = require("passport-twitter").Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {

  passport.use('twitter', new TwitterStrategy({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: process.env.BASEURL+'auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
      // asynchronous
      process.nextTick(function() {

        // find the user in the database based on their facebook id
        User.findOne({
          'username': profile.displayName
        }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
            return done(err);

          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {

            // if there is no user found with that twitter id, create them
            var newUser = new User();

            newUser.username = profile.displayName;
            newUser.password = profile.id;


            // save our user to the database
            newUser.save(function(err, newUser) {
              if (err) {
                console.log("error saving user: " + err);
                return done(null, false);
              } else {
                // if successful, return the new user
                return done(null, newUser);
              }
            });
          }
        });
      });
    }
  ));
};