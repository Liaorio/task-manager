const mongoose = require('mongoose');
var validator = require('validator');
 
const User = mongoose.model('User', {
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
  }
});

module.exports = User;