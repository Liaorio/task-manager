const app = require('../src/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Task = require('../src/models/task');

const { userTest, userTestId, setupDatabase, disconnectDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .send({
      description: 'Test task'
    })
    .expect(201)

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
})

test('Should get task of user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .send()
    .expect(200)

  // const task = response.body;
})

// other test idea go http://links.mead.io/extratests