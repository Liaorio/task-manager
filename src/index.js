const express = require("express");
require('./db/mongoose'); // nothing to grab, just make sure to connect to the db
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // can use console.log to print req.body
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('Server Start')
});