import express from 'express';

const router = express.Router();

router.post('/sign-up', (req, res) => {
  console.log('sign-up was called');
  res.send('POST  sign-up');
});

router.post('/sign-in', (req, res) => {
  res.send('POST  sign-in');
});

router.post('/sign-out', (req, res) => {
  res.send('POST  sign-out');
});

export default router;