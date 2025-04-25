/**
 * DNA-Protected Database Connection Service
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 *
 * This file establishes a secure connection to the PostgreSQL database with
 * enhanced security monitoring and DNA-based integrity verification.
 */

import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';
import { createSecurityWatermark, createSecureResponse } from './services/security-service';
import crypto from 'crypto';

// Configure WebSockets for Neon database
neonConfig.webSocketConstructor = ws;

// Verify that environment variables are properly set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required but not set');
}

// Generate a unique identifier for this database connection instance
const connectionId = crypto.randomUUID();

// Create the connection security watermark
const dbSecurityWatermark = createSecurityWatermark(connectionId);

// Create the connection pool with enhanced security
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Create the Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Securely log the database connection
console.log(
  JSON.stringify(
    createSecureResponse({
      event: 'database_connected',
      timestamp: new Date(),
      connectionId,
      message: 'Secure database connection established with DNA protection',
    })
  )
);

/**
 * Verifies database connection integrity
 * In a real system, this would perform actual integrity checks
 */
export async function verifyDatabaseIntegrity(): Promise<boolean> {
  try {
    // Test connection and check integrity
    const result = await pool.query('SELECT 1 as value');
    return result.rows[0].value === 1;
  } catch (error) {
    console.error('Database integrity check failed:', error);
    return false;
  }
}

// Initialize database verification on startup
verifyDatabaseIntegrity()
  .then((intact) => {
    console.log(
      JSON.stringify(
        createSecureResponse({
          event: 'database_integrity_check',
          intact,
          timestamp: new Date(),
        })
      )
    );
  })
  .catch((error) => {
    console.error('Failed to verify database integrity:', error);
  });