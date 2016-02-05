var express = require('express');
var router = express.Router();
var yelpCtrl = require("../controllers/yelpController");

router.get('/:location', yelpCtrl.serveResults);

router.put('/:barId/:user', yelpCtrl.going);

router.delete('/:barId/:user', yelpCtrl.notGoing);

module.exports = router;