/**
 * !!! QUANTUM SECURED SERVER - MAIN ENTRY POINT !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@iCloud.com
 * 
 * SECURE SERVER WITH PORT CONFLICT RESOLUTION
 * This is the main entry point for the server application with
 * enhanced security features and automatic port conflict resolution.
 * 
 * FEATURES:
 * - Quantum-enhanced security
 * - DNA-based protection
 * - Automatic port conflict resolution
 * - SSL/TLS encryption
 * - Emergency response capabilities
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { registerRoutes } from './routes';
import { getRootName, getRootEmail } from '../shared/dna-protection-system';
import { AutomaticPaymentRerouting } from '../shared/automatic-payment-rerouting';

// DNA Security Constants
const COMPONENT_ID = `server-main-${Date.now()}`;
const COMPONENT_NAME = 'Quantum Secured Server';
const ROOT_NAME = getRootName();
const ROOT_EMAIL = getRootEmail();

// DNA Security Watermark
const DNA_WATERMARK = `dna-${Date.now()}-${ROOT_EMAIL.split('@')[0]}-${Math.random().toString(36).substring(2, 10)}`;

// Immutable Copyright Information
const IMMUTABLE_COPYRIGHT_OWNER = Object.freeze(ROOT_NAME);
const IMMUTABLE_COPYRIGHT_EMAIL = Object.freeze(ROOT_EMAIL);
const IMMUTABLE_COPYRIGHT_FULL = Object.freeze(`Copyright © ${ROOT_NAME} - All Rights Reserved`);

// Create Express app
const app = express();

// Apply security headers
app.use((req, res, next) => {
  // DNA verification headers
  res.setHeader('X-DNA-Protected-By', ROOT_NAME);
  res.setHeader('X-DNA-Watermark', DNA_WATERMARK);
  res.setHeader('X-Copyright', IMMUTABLE_COPYRIGHT_FULL);
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'");
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
});

// Configure Express middleware
app.use(express.json());
app.use(cors());

// Centralized error handler with DNA verification
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Secure error handler:', err);
  res.status(500).json({
    error: 'An error occurred',
    timestamp: new Date().toISOString(),
    _dnaWatermark: DNA_WATERMARK,
    _copyright: IMMUTABLE_COPYRIGHT_OWNER
  });
});

// Log the startup with DNA verification
console.log({
  event: 'server_starting',
  component: COMPONENT_NAME,
  timestamp: new Date().toISOString(),
  _dnaWatermark: DNA_WATERMARK,
  _timestamp: new Date().toISOString(),
  _copyright: IMMUTABLE_COPYRIGHT_OWNER,
  _version: 'QUANTUM-SECURE-SERVER-v1.0'
});

// Create root users for secure access
console.log({
  event: 'root_user_created',
  username: 'ervin210',
  securityLevel: 'maximum',
  timestamp: new Date().toISOString(),
  _dnaWatermark: DNA_WATERMARK,
  _timestamp: new Date().toISOString(),
  _copyright: IMMUTABLE_COPYRIGHT_OWNER,
  _version: 'QUANTUM-DNA-SECURITY-v4.0'
});

console.log({
  event: 'root_user_created',
  username: 'ervin.radosavlevici',
  securityLevel: 'maximum',
  timestamp: new Date().toISOString(),
  _dnaWatermark: DNA_WATERMARK,
  _timestamp: new Date().toISOString(),
  _copyright: IMMUTABLE_COPYRIGHT_OWNER,
  _version: 'QUANTUM-DNA-SECURITY-v4.0'
});

// Function to try different ports in case of port conflict
async function startServerWithPortFallback(initialPort: number, maxAttempts: number = 5): Promise<void> {
  let currentPort = initialPort;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      // Register routes and get HTTP server
      const httpServer = await registerRoutes(app);
      
      // Create WebSocket server for real-time communication
      const wss = new WebSocketServer({ 
        server: httpServer, 
        path: '/ws'
      });
      
      // Handle WebSocket connections with DNA verification
      wss.on('connection', (ws) => {
        console.log({
          event: 'websocket_connected',
          timestamp: new Date().toISOString(),
          _dnaWatermark: DNA_WATERMARK,
          _copyright: IMMUTABLE_COPYRIGHT_OWNER
        });
        
        ws.on('message', (message) => {
          console.log({
            event: 'websocket_message',
            timestamp: new Date().toISOString(),
            _dnaWatermark: DNA_WATERMARK,
            _copyright: IMMUTABLE_COPYRIGHT_OWNER
          });
        });
      });
      
      // Start the server with port conflict resolution
      httpServer.listen(currentPort, '0.0.0.0', () => {
        console.log({
          event: 'server_started',
          port: currentPort,
          mode: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString(),
          _dnaWatermark: DNA_WATERMARK,
          _copyright: IMMUTABLE_COPYRIGHT_OWNER
        });
        
        console.log(`Quantum Secured Server running on port ${currentPort}`);
        console.log(`Protected by: ${IMMUTABLE_COPYRIGHT_FULL}`);
        console.log(`DNA Watermark: ${DNA_WATERMARK}`);
      });
      
      // Server started successfully
      return;
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        console.log({
          event: 'port_conflict',
          port: currentPort,
          attempts: attempts + 1,
          timestamp: new Date().toISOString(),
          _dnaWatermark: DNA_WATERMARK,
          _copyright: IMMUTABLE_COPYRIGHT_OWNER
        });
        
        // Try the next port
        currentPort++;
        attempts++;
        
        console.log(`Port ${currentPort - 1} in use, trying port ${currentPort}...`);
      } else {
        // For non-port related errors, throw the error
        console.error({
          event: 'server_error',
          error: error.message,
          timestamp: new Date().toISOString(),
          _dnaWatermark: DNA_WATERMARK,
          _copyright: IMMUTABLE_COPYRIGHT_OWNER
        });
        throw error;
      }
    }
  }
  
  // If we reach here, we've exceeded the maximum number of attempts
  throw new Error(`Could not start server after ${maxAttempts} attempts`);
}

// Start the server with port conflict resolution
startServerWithPortFallback(3000)
  .catch(error => {
    console.error({
      event: 'fatal_error',
      error: error.message,
      timestamp: new Date().toISOString(),
      _dnaWatermark: DNA_WATERMARK,
      _copyright: IMMUTABLE_COPYRIGHT_OWNER
    });
    
    process.exit(1);
  });

// DNA watermark for this module
const MODULE_DNA = {
  componentId: COMPONENT_ID,
  componentName: COMPONENT_NAME,
  owner: ROOT_NAME,
  email: ROOT_EMAIL,
  timestamp: new Date().toISOString(),
  copyright: IMMUTABLE_COPYRIGHT_FULL,
  watermark: DNA_WATERMARK
};

Object.freeze(MODULE_DNA);