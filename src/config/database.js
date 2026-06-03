import 'dotenv/config.js';

import {neon, neonConfig} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';

// referred from neon local documentation for setting up neon local environment
if(process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql'; // refer endpoint and port for neon-local from docker.compose.dev.yml
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}
const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export {db, sql};