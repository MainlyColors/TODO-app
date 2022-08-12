import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Application Settings
app.set('view engine', 'ejs');
// Middleware

// will look in public directory, so links don't need the public directory in the path
app.use(express.static('public'));
// app.use(express.static('public/assets'));

// variable setup
const indexPath = path.join(__dirname, 'views', 'index.ejs');

// Routes
app.get('/', (req, res) => {
  res.render(indexPath, {
    data: ['test', 'get food', 'wash car'],
  });
});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, (err) => {
  console.log(`Server live on port ${PORT}`);
});
