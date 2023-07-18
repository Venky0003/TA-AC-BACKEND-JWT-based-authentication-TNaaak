var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('slugify');

var articleSchema = new Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: { type: String, unique: true, required: true },
    description: String,
    body: String,
    tagList: [String],
    favorited: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    favoritesCount: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

articleSchema.pre('save', async function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = await slugify(this.title, { lowercase: true, strict: true });
  next();
});

module.exports = mongoose.model('Article', articleSchema);
