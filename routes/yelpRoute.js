var express = require('express');
var router = express.Router();
var yelpCtrl = require("../controllers/yelpController");

router.get('/:location', yelpCtrl.serveResults);

module.exports = router;