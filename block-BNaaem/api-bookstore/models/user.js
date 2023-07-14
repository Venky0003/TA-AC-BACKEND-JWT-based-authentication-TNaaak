var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 5, required: true },
    cart: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  } 
};

userSchema.methods.signToken = async function () {
  // console.log(this);
  var payload = { userId: this.id, email: this.email };
  // console.log(payload)
  try {
    var token = await jwt.sign(payload, process.env.TOKEN_SECRET);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
  };
};

module.exports = mongoose.model('User', userSchema);



// router.get('/products/:id/cart', requireLogin, (req, res, next) => {
//   const productId = req.params.id;
//   const userId = req.session.userId;

//   Product.findById(productId)
//     .then((product) => {
//       if (!product) {
//         return res.status(404).send('Product not found.');
//       }

//       User.findByIdAndUpdate(
//         userId,
//         { $push: { cart: productId } },
//         { new: true }
//       )
//         .then((user) => {
//           if (!user) {
//             return res.status(404).send('User not found.');
//           }

//           // Redirect the user to the cart page
//           res.redirect('/users/cart');
//         })
//         .catch((error) => {
//           console.log(error);
//           res
//             .status(500)
//             .send('An error occurred while adding the product to the cart.');
//         });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).send('An error occurred while finding the product.');
//     });
// });