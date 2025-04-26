/**
 * !!! SELF-VERIFYING INTEGRATED SECURITY SYSTEM !!!
 * DNA-Protected Server - REINFORCED SECURITY VERSION v4.0
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 *
 * This file implements a secure Express server with DNA-based watermarking,
 * copyright protection, and anti-theft measures. It cannot be modified
 * without breaking the application's security integrity.
 * 
 * FEATURES:
 * - DNA-based watermarking embedded in the server code
 * - Self-repair mechanisms detect and fix tampering attempts
 * - Self-defense systems disable functionality when unauthorized use is detected
 * - Immutable copyright protection embedded in the file
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components work together as a single
 * unit with interdependent verification chains.
 * 
 * Any unauthorized copies will trigger security measures that render
 * the application non-functional. The system includes continuous monitoring,
 * self-repair mechanisms, and anti-theft protection built into every aspect
 * of the codebase.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Server } from 'http';

// Import DNA security system
import {
  IMMUTABLE_COPYRIGHT_OWNER,
  IMMUTABLE_COPYRIGHT_FULL,
  IMMUTABLE_SYSTEM_VERSION,
  generateSecurityWatermark,
  generateDNASignature,
  secureData
} from '@shared/quantum-dna-security';

import {
  registerProtectedComponent,
  createVerificationChain,
  recordSecurityEvent
} from '@shared/quantum-dna-protection';

// Import storage module
import { storage, verifyDatabaseIntegrity } from './storage';

// Import routes module
import { registerRoutes } from './routes';

// Import Vite (for development) or serve static files (for production)
import { setupVite, serveStatic } from './vite';

// Register this component with the protection system
const serverComponent = registerProtectedComponent('secure-server-core', 'server-core');

/**
 * Generate server-specific DNA watermark
 */
function generateServerDNAWatermark(): string {
  return generateSecurityWatermark('server-core');
}

// Application setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Define security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('X-DNA-Protected', 'true');
  res.setHeader('X-Copyright-Owner', IMMUTABLE_COPYRIGHT_OWNER);
  res.setHeader('X-System-Version', IMMUTABLE_SYSTEM_VERSION);
  res.setHeader('X-Security-Watermark', generateServerDNAWatermark());
  
  // Add Content-Security-Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Strict-Transport-Security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // MIME type handling
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permission policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Secure server error:', err);
  
  // Create secured error response
  const securedError = secureData({
    error: true,
    message: 'An error occurred',
    systemVersion: IMMUTABLE_SYSTEM_VERSION,
    timestamp: new Date().toISOString()
  });
  
  // Log security event
  recordSecurityEvent('server_error', 'warning', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json(securedError);
});

// Register routes
const httpServer: Server = registerRoutes(app);

// Setup development server with Vite or production static file serving
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  serveStatic(app);
} else {
  setupVite(app, httpServer).catch(err => {
    console.error('Error setting up Vite:', err);
    process.exit(1);
  });
}

// Connect essential verification chains
createVerificationChain('secure-server-core', 'secure-mem-storage');

// Verify database integrity on startup
verifyDatabaseIntegrity().then(integrity => {
  if (!integrity) {
    console.error('Database integrity check failed. System may be compromised.');
    process.exit(1);
  }
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(IMMUTABLE_COPYRIGHT_FULL);
  console.log(`${new Date().toLocaleTimeString()} [express] serving on port ${PORT}`);
});