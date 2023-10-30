import express from 'express';

const router = express.Router();

router.get('/message/new', (req, res) => {
  res.status(200).json({
    status: 'Message successfully created.',
    messageID: 'placeholder for message ID',
  });
});

export default router;
