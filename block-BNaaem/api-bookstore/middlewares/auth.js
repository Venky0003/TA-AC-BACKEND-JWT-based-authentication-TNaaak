var jwt = require('jsonwebtoken');
var Book = require('../models/book');
var Comment = require('../models/comment');

module.exports = {
  verifyToken: async (req, res, next) => {
    var token = req.headers.authorization;
    // console.log(token)
    try {
      if (token) {
        var payload = await jwt.verify(token, process.env.TOKEN_SECRET);
        // console.log(payload)
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
    isOwnerBook: async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const bookId = req.params.id;
    
        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(400).json({ error: 'Book not found' });
        }
    
        if (book.creator.toString() !== userId) {
          return res.status(400).json({error:"Unauthorized access"});
        }
    
        next(); // User is authorized to continue to the next middleware or route handler
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server error' });
      }
  },
  isOwnerComment: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const commentId = req.params.commentId;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(400).json({ error: 'Comment not found' });
      }

      if (comment.commentor.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      next(); // User is authorized to continue to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server error' });
    }
  },

};
