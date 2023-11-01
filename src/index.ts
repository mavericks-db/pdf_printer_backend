import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import cors from 'cors';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

declare module 'express-session' {
  interface SessionData {
    token: String;
    messageID: String;
  }
}

// env variables
const port = process.env.PORT;

// express instance
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(cors());
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
