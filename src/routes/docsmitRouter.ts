import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// env variables
const docsmitCredential = {
  email: process.env.USERNAME,
  password: process.env.PASSWORD,
  softwareID: process.env.SOFTWAREID,
};

// middleware
const getToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await fetch(`${process.env.BASEURL}/token`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(docsmitCredential),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token. Status: ${response.status}`);
    }

    const data = await response.json();
    req.session.token = data.token;
    console.log(req.session);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  next();
};

// middleware
const addTokenToHeaders = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.token) {
    req.headers['Authorization'] = `Basic ${Buffer.from(
      `${req.session.token}:`,
    ).toString('base64')}`;
  }

  next();
};

// create a new message
router.post('/message/new', getToken, addTokenToHeaders, async (req, res) => {
  const { title, rtnName, rtnAddress1 } = req.body;
  const messageObject = {
    title,
    rtnName,
    rtnAddress1,
  };

  try {
    const response = await fetch(`${process.env.BASEURL}/message/new`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageObject),
    });
    const data = await response.json();
    res.status(200).json({ data: data, messageObject: messageObject });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  // res.status(200).json({
  //   status: 'Message successfully created.',
  //   messageID: 'placeholder for message ID',
  //   token: req.session.token,
  // });
});

export default router;
