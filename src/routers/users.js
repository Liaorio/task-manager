const express = require("express");
const User = require('../models/user');
const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user); // no need to add status if it is 200
  } catch (e) {
    res.status(400).send(e);
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users)
  } catch(e) {
    res.status(500).send(e);
  }
})

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id; // mongoose convert String id to ObjectId automatically
  try {
    const user = await User.findById(_id);
    if(!user) return res.status(404).send('No user found');
    res.send(user);
  } catch(e) {
    res.status(500).send('Server Error');
  }
})

router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id; // mongoose convert String id to ObjectId automatically
  // const allowedUpdates = ['name', 'email', 'password', 'age']; // add this to prevent non-existing field update
  try {
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }); // return the updated user
    if(!user) return res.status(404).send('No user found');
    res.send(user);
  } catch(e) {
    res.status(500).send('Server Error');
  }
})

router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    await User.findByIdAndDelete(_id);
    res.send('Delete success!');
  } catch(e) {
    res.status(500).send(e);
  }
})

module.exports = router;

