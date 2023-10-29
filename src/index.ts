import express from 'express';
import 'dotenv/config';

// env variables
const port = process.env.PORT;

// express instance
const app = express();

// home route
app.get('/', (req, res) => {
  res.status(200).send('Express');
});

// listen to port
app.listen(port, () => {
  console.log(`now runnning at http://localhost:${port}`);
});
