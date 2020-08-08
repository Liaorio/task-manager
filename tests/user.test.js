const app = require('../src/app');
const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../src/models/user');

const { userTest, userTestId, setupDatabase, disconnectDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

// test('Should signup a new user', async () => {
//   const response = await request(app).post('/users').send({
//     name: 'Alex',
//     email: 'alex@sina.com',
//     password: 'alex112233'
//   }).expect(201);

//   const user = await User.findById(response.body.user._id);

//   expect(response.body).toMatchObject({
//     user: {
//       name: 'Alex',
//       email: 'alex@sina.com'
//     },
//     token: user.tokens[0].token
//   })
// })

// test('Should login existing user', async() => {
//   const response = await request(app).post('/users/login').send({
//     email: userOne.email,
//     password: userTest.password
//   }).expect(200);

//   const { token } = response.body;
//   const me = await User.findById(userTestId);
//   expect(token).toBe(me.tokens[1].token);

// })

// test('Should login failed with non-existing user', async () => {
//   await request(app).post('/users/login').send({
//     email: 'not@not.com',
//     password: 'nopassword'
//   }).expect(400);
// })

test('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .send()
    .expect(200)
})

// test('should not get profile for unauthenticated user', async () => {
//   await request(app)
//     .get('/users/me')
//     .send()
//     .expect(401)
// })

// test('should delete user', async () => {
//   await request(app)
//     .delete('/users/me')
//     .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
//     .send()
//     .expect(200)

//   // const user = await User.findById(userTestId);
//   // expect(user).toBeNull();
// })

// test('Should upload avatar image', async () => {
//   await request(app)
//     .post('/users/me/avatar')
//     .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
//     .attach('avatar', 'tests/fixtures/example.jpg')
//     .expect(200)

//     const user = await User.findById(userTestId);
//     expect(user.avatar).toEqual(expect.any(Buffer))
// })

// test('Should update valid user fields', async() => {
//   await request(app)
//     .patch('/users/me')
//     .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
//     .send({
//       name: 'new test name',
//     })
//     .expect(200);

//   const user = await User.findById(userTestId);
//   expect(user.name).toBe('new test name')
// })

// test('Should not update invalid user fields', async() => {
//   await request(app)
//     .patch('/users/me')
//     .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
//     .send({
//       location: 'Toronto',
//     })
//     .expect(400);
// })


afterAll(disconnectDatabase)
