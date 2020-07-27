const express = require("express");
const Task = require('../models/task');
const router = new express.Router();


router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task); // no need to add status if it is 200
  } catch (e) {
    res.status(400).send(e);
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks)
  } catch(e) {
    res.status(500).send(e);
  }
})

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id; // mongoose convert String id to ObjectId automatically
  try {
    const task = await Task.findById(_id);
    if(!task) return res.status(404).send('No user found');
    res.send(task);
  } catch(e) {
    res.status(500).send('Server Error');
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id; // mongoose convert String id to ObjectId automatically
  // const allowedUpdates = ['description', 'completed']; // add this to prevent non-existing field update
  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }); // return the updated user
    if(!task) return res.status(404).send('No user found');
    res.send(task);
  } catch(e) {
    res.status(500).send('Server Error');
  }
})

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    await Task.findByIdAndDelete(_id);
    res.send('Delete success!');
  } catch(e) {
    res.status(500).send(e);
  }
})

module.exports = router;