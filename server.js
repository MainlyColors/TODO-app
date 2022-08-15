import express from 'express';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// variable setup
const indexPath = path.join(__dirname, 'views', 'index.ejs');
let database;
const dbName = 'todo';

// database connection & DB setup
const client = new MongoClient(process.env.DB_URL);
client.connect().then((client) => {
  console.log(`Connected to ${dbName} Database`);
  database = client.db('todo');
});

// Application Settings
app.set('view engine', 'ejs');
// Middleware

// will look in public directory, so links don't need the public directory in the path
// works for nested folders too
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', async (req, res) => {
  /*
steps on GET
1. get data from DB
2. put data into array
3. render page with data array passed in

*/
  const todoListCollection = database.collection('todos');

  // returns a cursor, with no filter return all
  const allTodoItems = await todoListCollection.find().toArray();
  //

  const taskArr = [];
  let count = 0;

  // build out
  allTodoItems.forEach((item) => {
    if (!item.completed) count++;

    taskArr.push({
      todoItem: item.todoItem,
      completed: item.completed,
    });
  });

  console.log(taskArr);
  res.render(indexPath, {
    data: taskArr,
    count,
  });
});

app.post('/newItem', (req, res) => {
  /*
steps on post
1. take req.body and build a full object
2. connect to DB
3. update with new object
4. reload page with a redirect

   */
  console.log('in post');
  console.log(req.body);

  const todoItemObj = {
    ...req.body,
    completed: false,
  };

  const todoListCollection = database.collection('todos');

  // returns promise
  todoListCollection
    .insertOne(todoItemObj)
    .then((result) => {
      console.log('Todo Added');
      res.redirect('/');
    })
    .catch((err) => console.error(err));
});

// update
app.put('/complete', (req, res) => {});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, (err) => {
  console.log(`Server live on port ${PORT}`);
});
