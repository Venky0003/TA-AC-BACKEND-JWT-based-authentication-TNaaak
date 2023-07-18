var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var auth = require('../middlewares/auth');
var Comment = require('../models/comment');

router.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    var article = await Article.findOne({ slug }).populate('comments');
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json(error);
  }
});

// creating the article
router.post('/', auth.verifyToken, async (req, res, next) => {
  req.body.author = req.user.userId;
  try {
    var article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json(error);
  }
});

// updating the article details
router.put(
  '/:slug',
  auth.verifyToken,
  auth.isArticleAuthor,
  async (req, res, next) => {
    var slug = req.params.slug;
    try {
      var article = await Article.findOneAndUpdate({ slug }, req.body);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// deleteing /removing the article along with the comments
router.delete(
  '/:slug',
  auth.verifyToken,
  auth.isArticleAuthor,
  async (req, res, next) => {
    try {
      var slug = req.params.slug;
      var article = await Article.findOneAndDelete({ slug });
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      await Comment.deleteMany({ articleId: article._id });
      res.status(201).json({ message: 'Article deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

// addding comments to article
router.post('/:slug/comments', auth.verifyToken, (req, res, next) => {
  var slug = req.params.slug;
  // Find the associated article by slug
  Article.findOne({ slug })
    .then((article) => {
      if (!article) {
        return res.status(400).json({ error: 'Article not found' });
      } else {
        req.body.articleId = article._id;
        req.body.user = req.user.userId;

        Comment.create(req.body)
          .then((comment) => {
            // update the article with the comment ID
            Article.findByIdAndUpdate(
              article._id,
              { $push: { comments: comment._id } },
              { new: true }
            )
              .then((updatedArticle) => {
                res.status(201).json(updatedArticle);
              })
              .catch((error) => {
                res.status(400).json(error);
              });
          })
          .catch((error) => {
            res.status(400).json(error);
          });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// get the comments
router.get('/:slug/comments', auth.verifyToken, async (req, res, next) => {
  try {
    var slug = req.params.slug;

    var article = await Article.findOne({ slug }).populate('comments');
    if (!article) {
      return res.status(400).json({ error: 'Article not found' });
    }

    let comments = article.comments;
    res.status(201).json({ comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete(
  '/:slug/comments/:id',
  auth.verifyToken,
  auth.isArticleAuthor,
  async (req, res, next) => {
    try {
      var slug = req.params.slug;
      var id = req.params.id;

      var article = await Article.findOne({ slug }).populate('comments');
      if (!article) {
        return res.status(400).json({ error: 'Article not found' });
      }

      let comments = article.comments;
      const commentIndex = comments.findIndex((comment) =>
        comment._id.equals(id)
      );

      if (commentIndex === -1) {
        return res.status(400).json({ error: 'Comment not found' });
      }

      // removing the comment
      comments.splice(commentIndex, 1);

      //save
      await article.save();

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.post('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
  try {
    var slug = req.params.slug;
    const userId = req.user.userId;

    const article = await Article.findOne({ slug });
    console.log(article);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // checking if the user has already favorited the article
    if (article.favorited.includes(userId)) {
      return res.status(400).json({ error: 'Article already favorited' });
    }

    // adding userId to favoritedBy array
    article.favorited.push(userId);

    // increase favoritesCount by 1
    article.favoritesCount++;

    // Save the updated article
    await article.save();

    res.status(201).json({ message: 'Article favorited successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
  try {
    var slug = req.params.slug;
    var userId = req.user.userId;

    var article = await Article.findOne({ slug });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    if (!article.favorited.includes(userId)) {
      res.status(400).json({ error: 'Article not favorited' });
    }
    if (article.favorited.includes(userId)) {
      article.favorited.pull(userId);
      article.favoritesCount--;
    }

    // saving the updated article
    await article.save();

    res.status(201).json({ message: 'Article Unfavorited successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
