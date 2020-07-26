const express = require("express");
require('./db/mongoose'); // nothing to grab, just make sure to connect to the db
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // can use console.log to print req.body

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user.save().then(() => {
    res.status(201).send(user); // no need to add status if it is 200
  }).catch(e => {
    res.status(400).send(e);
  })
})

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);
  task.save().then(() => {
    res.status(201).send(task);
  }).catch(e => {
    res.status(400).send(e);
  })
})

app.get('/users', (req, res) => {
  User.find({}).then(result => {
    res.send(result)
  }).catch(e => {
    res.status(500).send(e);
  })
})

app.get('/users/:id', (req, res) => {
  const _id = req.params.id; // mongoose convert String id to ObjectId automatically
  User.findById(_id).then(user => {
    if(!user) return res.status(404).send('No user found')
    res.send(user)
  }).catch(e => {
    res.status(500).send('Server Error')
  })
})

app.get('/tasks', (req, res) => {
  Task.find({}).then(result => {
    res.send(result)
  }).catch(e => {
    res.status(500).send(e);
  })
})

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id; // mongoose convert String id to ObjectId automatically
  Task.findById(_id).then(user => {
    if(!user) return res.status(404).send('No user found')
    res.send(user)
  }).catch(e => {
    res.status(500).send('Server Error')
  })
})

app.listen(port, () => {
  console.log('Server Start')
});