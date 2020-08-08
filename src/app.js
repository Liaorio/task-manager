const express = require("express");
require('./db/mongoose'); // nothing to grab, just make sure to connect to the db
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();

app.use(express.json()); // can use console.log to print req.body
app.use(userRouter);
app.use(taskRouter);

module.exports = app;