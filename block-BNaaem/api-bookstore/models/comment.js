var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  text: { type: String, required: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  commentor: { type: Schema.Types.ObjectId, ref: 'User' },
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
