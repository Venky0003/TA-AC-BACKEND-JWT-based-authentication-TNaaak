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
