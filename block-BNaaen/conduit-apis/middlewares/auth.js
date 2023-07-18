var jwt = require('jsonwebtoken');
var Article = require('../models/article');

module.exports = {
  verifyToken: async (req, res, next) => {
    // console.log(req.headers);
    var token = req.headers.authorization;
    try {
      if (token) {
        var payload = await jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(payload);
        req.user = payload;
        next();
      } else {
        res.status(400).json({ error: 'Token Required' });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  isArticleAuthor: async (req, res, next) => {
    try {
      var userId = req.user.userId;
      var slug = req.params.slug;
  
      var article = await Article.findOne({slug});

      if (!article) {
        return res.status(400).json({ error: 'article not found' });
      }

      if (article.author.toString() !== userId) {
        return res.status(400).json({ error: 'you are not authorized' });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server error' });
    }
  },
};
