var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({message:'Register / login to view Bookstore'});
});

// register handler
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// login handler
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    res.status(200).json({ error: 'Email/Password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Incorrect Password' });
    }
    // generate tokens
    var token = await user.signToken();
    // console.log(token);
    res.json({ user: user.userJSON(token) });
   
  } catch (error) {
    next(error);
  }
});

module.exports = router;
