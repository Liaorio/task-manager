const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectURl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectURl, { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.log(err);

  const db = client.db(databaseName);
  db.collection("tasks").insertMany(
    [
      {
        description: 'task 1',
        completed: true
      },
      {
        description: 'task 2',
        completed: false
      },
      {
        description: 'task 3',
        completed: false
      },
    ],
    (error, result) => {
      if (error) return console.log('Insert Error: ' + error);
      console.log(result.ops);
    }
  );
});
