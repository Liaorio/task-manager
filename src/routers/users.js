const express = require("express");
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require("sharp");
const { sendWelcomEmail } = require('../emails/account');

const upload = multer({
  dest: 'avatars',
  limits: {
    fileSize: 1000000 // 1mb
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith('.pdf'))
    // https://regex101.com/
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('file must be JPG, JPEG or PNG'));
    cb(undefined, true)
    // cb(undefined, false)
  },
  storage: multer.memoryStorage() // need this to provide file.buffer
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => { // upload match the key in request
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send('Upload avatar success!');
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send('Delete avatar success!');
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error('No such user or avatar')
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error.message);
  }
})

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomEmail(user.email, user.name); // no need to use await here
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

