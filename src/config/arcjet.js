import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/node';
// import { isSpoofedBot } from '@arcjet/inspect';
// import http from 'node:http';

const aj = arcjet({
  key: process.env.ARCJET_KEY, // Get your site key from https://app.arcjet.com
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: 'LIVE' }),
    // Create a bot detection rule
    detectBot({
      mode: 'DRY_RUN', // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        'CATEGORY:MONITOR', // Uptime monitoring services
        'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
        'CATEGORY:UNKNOWN'
      ],
    }),
    slidingWindow({
      mode: 'DRY_RUN',
      interval: '10s',
      max: 5
    }),
  ],
});
export default aj;
