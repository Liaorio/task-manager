const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userTestId = new mongoose.Types.ObjectId();
const userTest = {
  _id: userTestId,
  name: 'Test',
  email: 'test@test.com',
  password: 'test123456',
  tokens: [{
    token: jwt.sign({ _id: userTestId }, process.env.JWT_SECRET)
  }]
}

const taskTest = {
  _id: new mongoose.Types.ObjectId(),
  description: 'New Test Task',
  owner: userTestId
}

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userTest).save(); // for login test
  await new Task(taskTest).save();
}

const disconnectDatabase = async () => {
  mongoose.connection.close()
}

module.exports = {
  userTest,
  userTestId,
  setupDatabase,
  disconnectDatabase
}