//database
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {
  
  //fb strategy
  require("./strategies/fb")(passport);

  //twitter strategy
  require("./strategies/twitter")(passport);

  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    // tell passport which id to use for user
    console.log('serializing user: ', user._id);
    return done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    // return user object back
    User.findById(id, function(err, user) {

      if (err) {
        return done(err, false);
      }

      if (!user) {
        return done('user not found', false);
      };
      console.log('Derializing user: ', user._id);
      return done(null, user);

    })

  });
  
};