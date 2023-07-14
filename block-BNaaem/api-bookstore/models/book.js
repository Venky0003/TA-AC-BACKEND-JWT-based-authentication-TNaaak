var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');

var bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    categories: [String],
    tags: [String],
    price: Number,
    quantity: Number,
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;

