// npm module to read .env variables
require('dotenv').load();
var mongoose = require('mongoose');
var Bar = mongoose.model('Bar');
var User = mongoose.model('User');

var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

exports.serveResults = function(req, res, next) {
    //step1: perform yelp search
    yelp.search({ term: 'bar', location: req.params.location })
    .then(function (yelpData) {
      //step2:Grabing businesses from the yelp response
      var businesses = yelpData.businesses;
      
      //step3: get all business where users are going
      Bar.find({}, function(err, bars){
        if (err) {
          console.log('Error doing finding one -' + err);
        } else 
           if (bars.length >= 1) {
             
             //step4: match all bars where user are going with the yelpdata 
             // or add empty array
             for (var i = 0; i < bars.length; i++) {
                for (var j = 0; j < businesses.length; j++) {
                  if (bars[i].barId === businesses[j].id) {

                    businesses[j].whoIsGoing = bars[i].whoIsGoing;
                  } else {

                    if (businesses[j].whoIsGoing == null) {
                      businesses[j].whoIsGoing = [];
                    }
                  }
                }
             }
            res.send({state: 'success', bars: businesses}); 
           } else {
              //adding whoIsGoing array to each business, only used when db is empty
              console.log('did not do search');
              businesses.forEach(function(bus){
                bus.whoIsGoing = [];
              });
              res.send({state: 'success', bars: businesses});
           }
        });
        
      }).catch(function (err) {
        res.send({state: 'failure'});
        console.error(err);
      });       
  };

    
exports.going = function(req, res, next) {
  
    Bar.findOneAndUpdate(
        { "barId": req.params.barId },
        { 
            "$push": {
                'whoIsGoing' : req.params.user
            }
        },{
          'upsert' : true
        },
        function(err,doc) {
            if (err) {
                console.log('failure while updating or adding the bar - ' + err);
                res.send({state:'failure', message: 'error adding yourself to the bar list'});
            } else {
              console.log('succesfully update or added the bar');
              res.send({state:'success', message: 'Good! you are on the list!'});
            } 
        }
    );
};

exports.notGoing = function(req, res, next) {
    Bar.findOne({"barId" : req.params.barId}, function(err, bar){
        if (err) {
          console.log('error finding bar to remove user, error:' + err);
          res.send({state:'failure', message: 'error finding bar to remove user'});
        } else {
          if (bar) {
            var index = bar.whoIsGoing.indexOf(req.params.user);
            bar.whoIsGoing.splice(index, 1);
            
            bar.save(function(err, barUpdated) {
              if (err) {
                console.log('error saving bar after removing user');
                res.send({state:'failure', message: 'error saving user from bar'});
              } else {
                console.log(barUpdated);
                res.send({state:'success', message: 'remove user from bar'});
              }
            });
          } else {
            res.send({state:'failure', message: 'did not find bar to remove user'});
          }
        }
    });

  
};