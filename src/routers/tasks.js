const express = require("express");
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();


router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task); // no need to add status if it is 200
  } catch (e) {
    res.status(400).send(e);
  }
})

// tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) match.completed = req.query.completed === 'true';

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();  // connection is built in user model: virtual
    // res.send(tasks);
    res.send(req.user.tasks);
  } catch(e) {
    res.status(500).send(e);
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id; // mongoose convert String id to ObjectId automatically
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if(!task) return res.status(404).send('No task found');
    res.send(task);
  } catch(e) {
    res.status(500).send('Server Error');
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValid = updates.every(key => allowedUpdates.includes(key));

  if(!isValid) return res.status(400).send({ error: 'Invalid updates' });

  try {
    // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }); // return the updated user
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if(!task) return res.status(404).send('No task found');
    updates.forEach(key => {
      task[key] = req.body[key];
    })
    await task.save();
    res.send(task);
  } catch(e) {
    res.status(500).send('Server Error');
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    const task = Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })
    if(!task) return res.status(404).send('No task found');
    // await task.remove();
    res.send('Delete success!');
  } catch(e) {
    res.status(500).send(e);
  }
})

module.exports = router;