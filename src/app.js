import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
import usersRoutes from '#routes/users.routes.js';
import securityMiddleware from '#middleware/security.middleware.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// passing morgan messages into logger
app.use(morgan('combined', {stream: {write: (message)=>logger.info(message.trim())}})); //combined: both dev and production?
app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('hello world');
  //missing semicolon and inconsistent spacing not detected by eslint.
  res.status(200).send('hello world');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 200,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Acquisition API is running now',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

export default app;
