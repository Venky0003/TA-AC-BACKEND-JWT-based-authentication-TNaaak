var express = require('express');
var router = express.Router();
// var Book = 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({msg:"Welcome to RESTful api Basics"});
});

module.exports = router;
