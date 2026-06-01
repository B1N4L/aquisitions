import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const jwtToken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
    } catch(e){
      logger.error('failed to authenticate token', e);
      throw new Error('Authentication token error');
    }
  },
  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch(e){
      logger.error('failed to verify token', e);
      throw new Error('Authentication token error');
    }
  }
};