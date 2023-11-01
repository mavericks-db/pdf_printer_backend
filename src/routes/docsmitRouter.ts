import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    const response = await fetch(`${process.env.BASEAPI}/token`, {
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

// create a new message
router.post(
  '/messages/new',
  [getToken, upload.single('pdf')],
  async (req: any, res: any) => {
    try {
      const { title, rtnName, rtnAddress1 } = req.body;
      const messageObject = {
        title,
        rtnName,
        rtnAddress1,
        rtnState: 'WA',
        rtnZip: '12345-1234',
      };
      // create a new message
      const response = await fetch(`${process.env.BASEAPI}/messages/new`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${req.session.token}:`).toString(
            'base64',
          )}`,
        },
        body: JSON.stringify(messageObject),
      });
      if (!response.ok) {
        throw new Error('Failed to create a new message');
      }

      const data = await response.json();
      req.session.messageID = data.messageID;

      // upload the file
      const response2 = await fetch(
        `${process.env.BASEAPI}/messages/${req.session.messageID}/upload`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Basic ${Buffer.from(
              `${req.session.token}:`,
            ).toString('base64')}`,
          },
          body: req.file,
        },
      );
      if (!response2.ok) {
        throw new Error('Failed to upload the file');
      }
      res.status(200).json({ msg: 'File uploaded successfully.' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;
