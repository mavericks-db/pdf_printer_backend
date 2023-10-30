import express from 'express';
import 'dotenv/config';

// env variables
const port = process.env.PORT;

// express instance
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import docsmitRouter from './routes/docsmitRouter';
app.use('/api', docsmitRouter);

// home route
app.get('/', (req, res) => {
  res.status(200).send('Express');
});

// listen to port
app.listen(port, () => {
  console.log(`now runnning at http://localhost:${port}`);
});
