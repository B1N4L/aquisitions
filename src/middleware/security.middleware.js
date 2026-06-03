import aj from '#config/arcjet.js';
import {slidingWindow} from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 5;
        message = 'Admin request limit exceeded (5 per 10 seconds), slow down';
        break;

      case 'user':
        limit = 5;
        message = 'User request limit exceeded (5 per 10 seconds), slow down';
        break;

      case 'guest':
      default:
        limit = 5;
        message = 'Guest request limit exceeded (5 per 10 seconds), slow down';
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '10s',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req, { requested: 1 });

    if (decision.isDenied && decision.reason.isBot()) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Automated requests are not allowed',
      });
    }

    if (decision.isDenied && decision.reason.isShield()) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Request blocked by security policy',
      });
    }

    // if (decision.isDenied && decision.reason.isRateLimit()) {
    //   return res.status(429).json({
    //     error: 'Too Many Requests',
    //     message,
    //   });
    // }

    next();
  } catch (e) {
    console.error('Arcjet middleware error', e);
    res.status(500).json({
      error: 'Internal server error',
      message: 'something went wrong with security middleware',
    });
  }
};

export default securityMiddleware;