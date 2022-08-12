import express from 'express';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// database connection
const client = new MongoClient(process.env.DB_URL);

// Application Settings
app.set('view engine', 'ejs');
// Middleware

// will look in public directory, so links don't need the public directory in the path
// works for nested folders too
app.use(express.static('public'));

// variable setup
const indexPath = path.join(__dirname, 'views', 'index.ejs');

// Routes
app.get('/', async (req, res) => {
  /*
steps on GET
1. get data from DB
2. put data into array
3. render page with data array passed in

*/
  await client.connect();
  const database = client.db('todo');
  const todoListCollection = database.collection('todos');

  // returns a cursor, with no filter return all
  const allTodoItems = await todoListCollection.find().toArray();
  //

  const taskArr = allTodoItems.map((item) => item.thing);

  console.log(taskArr);
  res.render(indexPath, {
    data: taskArr,
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
  res.redirect('/');
});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, (err) => {
  console.log(`Server live on port ${PORT}`);
});
