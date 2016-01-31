// npm module to read .env variables
require('dotenv').load();

var FacebookStrategy = require("passport-facebook").Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {
  passport.use('facebook', new FacebookStrategy({
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL:  process.env.BASEURL + 'auth/facebook/callback'
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
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

            // if there is no user found with that facebook id, create them
            var newUser = new User();

            newUser.username = profile.displayName;
            newUser.password = profile.id;
            // set all of the facebook information in our user model


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
    }));
};