const mongoose = require('mongoose');
var validator = require('validator');
 
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true
})

// const User = mongoose.model('User', {
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 7,
//     validate(v) {
//       // if (v.length <= 6) {
//       //   throw new Error('Password should greater than 6 digits')
//       // }
//       if (v.includes('password')) {
//         throw new Error('Password should not contains \"password\"')
//       } 
//     } 
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     validate(v) {
//       if (!validator.isEmail(v)) {
//         throw new Error('Not a valid email address');
//       }
//     }
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(v) {
//       if(v < 0) {
//         throw new Error('Not a valid age')
//       }
//     }
//   }
// });

// const user = new User({
//   name: 'Mike',
//   password: '123456789',
//   email: 'ao@gmail.com',
//   age: 100
// })

// user.save().then(() => {
//   console.log(user);
// }).catch(e => {
//   console.log('Error', e)
// })

const Task = mongoose.model('Task', {
  description: {
    type: String,
    require: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const newTask = new Task({
  description: 'First         task    1',
})

newTask.save().then(() => {
  console.log(newTask);
}).catch(e => {
  console.log('Error', e)
})