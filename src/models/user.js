const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(v) {
      // if (v.length <= 6) {
      //   throw new Error('Password should greater than 6 digits')
      // }
      if (v.includes('password')) {
        throw new Error('Password should not contains \"password\"')
      } 
    } 
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(v) {
      if (!validator.isEmail(v)) {
        throw new Error('Not a valid email address');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(v) {
      if(v < 0) {
        throw new Error('Not a valid age')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})
 
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
})

userSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
})

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject(); // turn document to a plain object
  delete userObj.tokens;
  delete userObj.password;
  delete userObj.avatar;

  return userObj;
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('No such user');
  // bcrypt method are asynchronous
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch)  throw new Error('Password not correct');
  return user;
}

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = [ ...user.tokens, { token } ]; // token is an object
  await user.save();
  return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;