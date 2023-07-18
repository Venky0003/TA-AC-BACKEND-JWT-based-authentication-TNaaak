var express = require('express');
var router = express.Router();
var Article = require('../models/article');

router.get('/', async (req, res, next) => {
  try {
    var tags = await Article.distinct('tagList');

    res.status(200).json({ tags });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
