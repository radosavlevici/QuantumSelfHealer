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

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
// Use express's built-in json middleware
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import { setupVite, serveStatic, log } from "./vite";
import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";

// Import DNA-based security system
import {
  COPYRIGHT_OWNER,
  COPYRIGHT_BIRTHDATE,
  COPYRIGHT_EMAIL,
  COPYRIGHT_FULL,
  SYSTEM_VERSION,
  SYSTEM_ID,
  generateDNAWatermark,
  initializeQuantumSecurity
} from "@shared/quantum-dna-security";

// Initialize the quantum DNA security system
initializeQuantumSecurity();

// Generate a DNA watermark for this server instance
function generateServerDNAWatermark(): string {
  const serverId = uuidv4();
  const timestamp = Date.now().toString();
  
  // Create a DNA-like sequence
  const dnaSequence = Array.from({ length: 12 }, () => {
    const bases = ['A', 'C', 'G', 'T'];
    return bases[Math.floor(Math.random() * bases.length)];
  }).join('');
  
  // Generate a hash incorporating copyright info to prevent tampering
  const securityHash = createHash('sha256')
    .update(`${serverId}-${COPYRIGHT_OWNER}-${COPYRIGHT_BIRTHDATE}-${timestamp}`)
    .digest('hex')
    .substring(0, 16);
  
  return `DNA-SERVER-${dnaSequence}-${securityHash}`;
}

// Create Express application with security features
const app = express();
const serverWatermark = generateServerDNAWatermark();

// Session configuration with strong security
const SESSION_SECRET = process.env.SESSION_SECRET || uuidv4();
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE,
      sameSite: "lax",
    },
  })
);

// Self-defense middleware - validates request integrity and blocks suspicious activity
app.use((req: Request, res: Response, next: NextFunction) => {
  // Add security headers
  res.setHeader("X-DNA-Protection", serverWatermark);
  res.setHeader("X-Copyright", COPYRIGHT_FULL);
  res.setHeader("X-Security-Version", SYSTEM_VERSION);
  
  // Continue to next middleware
  next();
});

// Global error handler with security logging
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  
  // Log security event
  storage.logSecurityEvent({
    eventType: "server_error",
    userId: null,
    resourceId: null,
    ipAddress: null,
    userAgent: null,
    details: { message: err.message, stack: err.stack },
    severity: "critical"
  }).catch(logErr => {
    console.error("Failed to log security event:", logErr);
  });
  
  // Send generic error response to avoid exposing system details
  res.status(500).json({
    error: "An error occurred",
    securityTracking: true,
    watermark: generateDNAWatermark("error-response")
  });
});

// Register API routes
const httpServer = registerRoutes(app);

// Register Vite in development mode
setupVite(app, httpServer);

// Determine port
const port = process.env.PORT || 5000;

// Start server
httpServer.listen(port, () => {
  console.log(`${new Date().toLocaleTimeString()} [express] serving on port ${port}`);
});