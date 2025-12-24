import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

// We must pass { schema } here so db.query works!
export const db = drizzle(sql, { schema });
