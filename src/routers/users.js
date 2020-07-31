const express = require("express");
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token }); // no need to add status if it is 200
  } catch (e) {
    res.status(400).send(e);
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
})

// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id; // mongoose convert String id to ObjectId automatically
//   try {
//     const user = await User.findById(_id);
//     if(!user) return res.status(404).send('No user found');
//     res.send(user);
//   } catch(e) {
//     res.status(500).send('Server Error');
//   }
// })

router.patch('/users/me', auth, async (req, res) => {
  // const _id = req.params.id; // mongoose convert String id to ObjectId automatically
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValid = updates.every(key => allowedUpdates.includes(key));

  if(!isValid) return res.status(400).send({ error: 'Invalid updates' });

  try {
    updates.forEach(key => {
      req.user[key] = req.body[key];
    })
    await req.user.save();
    res.send(req.user);
  } catch(e) {
    res.status(400).send('Update failed');
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send('Delete success!');
  } catch(e) {
    res.status(500).send(e);
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch(e) {
    res.status(400).send(e.toString()); // is there any solution for send error ??
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send('logout')
  } catch (error) {
    res.status(500).send(error.toString());
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send('logout all');
  } catch (error) {
    res.status(500).send(error.toString());
  }
})


module.exports = router;

