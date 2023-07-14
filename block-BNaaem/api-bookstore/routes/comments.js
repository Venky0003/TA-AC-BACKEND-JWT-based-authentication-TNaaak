var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Book = require('../models/book');
var auth = require('../middlewares/auth');


router.use(auth.verifyToken)

router.get('/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;

  Comment.find({ bookId })
    .then((comments) => {
      res.json(comments);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


router.put('/:commentId',  auth.isOwnerComment,(req, res, next) => {
  const commentId = req.params.commentId;
  const { text } = req.body;

  Comment.findByIdAndUpdate(commentId, req.body)
    .then((comment) => {
      if (comment) {
        res.json(comment);
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ err: 'Internal Server error' });
    });
});

router.delete('/:commentId', auth.isOwnerComment, (req, res, next) => {
  var commentId = req.params.commentId;
  Comment.findByIdAndDelete(commentId)
    .then((deletedComment) => {
      if (deletedComment) {
        res.json({});
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

module.exports = router;
