var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    books: [{ bookId:String,quantity:Number,title:String,price:Number }],
    total:{type: Number, default: 0},
    active: {
        type: Boolean,
        default: true
      },
      modifiedOn: {
        type: Date,
        default: Date.now
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
