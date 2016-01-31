// npm module to read .env variables
require('dotenv').load();

var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

exports.serveResults = function(req, res, next) {

    yelp.search({ term: 'bar', location: req.params.location })
    .then(function (data) {
      console.log(data);
      res.send({state: 'success', bars : data});
    })
    .catch(function (err) {
      res.send({state: 'failure'});
      console.error(err);
    });
    
};