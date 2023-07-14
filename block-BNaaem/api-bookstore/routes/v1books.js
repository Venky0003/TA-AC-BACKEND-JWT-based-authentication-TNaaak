var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var auth = require('../middlewares/auth');

// const books = [];

router.get('/', (req, res, next) => {
  Book.find({})
    .then((books) => {
      res.json({ books });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.use(auth.verifyToken);

router.post('/', (req, res, next) => {
  // const { title, author } = req.body;

  //   Save the new book to the database
  Book.create(req.body)
    .then((createBook) => {
      res.status(201).json(createBook);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/:id', (req, res) => {
  const bookId = req.params.id;
  Book.findById(bookId)
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

router.delete('/:id', (req, res) => {
  let bookId = req.params.id;
  Book.findByIdAndDelete(bookId)
    .then((deleteBook) => {
      if (deleteBook) {
        res.status.json(deleteBook);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

module.exports = router;
