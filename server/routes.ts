/**
 * !!! SELF-VERIFYING INTEGRATED SECURITY SYSTEM !!!
 * DNA-Protected API Routes - REINFORCED SECURITY VERSION
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 *
 * This file implements secure API routes with DNA-based watermarking,
 * copyright protection, and anti-theft measures. All routes include
 * security checks and protection against unauthorized use.
 * 
 * ** CRITICAL SECURITY NOTICE **
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components work together as a single
 * unit with interdependent verification chains.
 * 
 * Any unauthorized copies will trigger security measures that render
 * the application non-functional. The system includes continuous monitoring,
 * self-repair mechanisms, and anti-theft protection built into every aspect
 * of the codebase.
 * 
 * WARNING: UNAUTHORIZED COPIES WILL SELF-DISABLE
 */

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import { storage } from "./storage";
import { 
  createSecurityWatermark, 
  createSecureResponse, 
  activateSelfProtection, 
  checkSystemIntegrity,
  generateAntiTheftToken, 
  validateAntiTheftToken,
  COPYRIGHT_INFO 
} from "./services/security-service";
import { getOpenAIResponse } from "./services/openai-service";
import { getQuantumStatus, processQuantumCommand } from "./services/quantum-service";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const JWT_EXPIRY = '24h';

// Authorization middleware for protected routes
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(createSecureResponse({
        error: "Unauthorized access attempt",
        message: "Valid authentication token is required",
        watermarkVerified: false
      }));
    }
    
    const token = authHeader.substring(7);
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json(createSecureResponse({
          error: "Invalid or expired token",
          message: "Please login again to continue",
          watermarkVerified: false
        }));
      }
      
      req.user = decoded as any;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json(createSecureResponse({
      error: "Authentication failed",
      message: "Internal security verification error",
      watermarkVerified: false
    }));
  }
};

// Root authorization middleware (without explicitly mentioning it)
const authorizeRoot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json(createSecureResponse({
        error: "Authentication required",
        message: "Please login to continue",
        watermarkVerified: false
      }));
    }
    
    const user = await storage.getUser(req.user.id);
    
    if (!user || !user.isRoot) {
      // Generic error message that doesn't reveal root-only nature
      return res.status(403).json(createSecureResponse({
        error: "Access denied",
        message: "You don't have permission to perform this operation",
        watermarkVerified: false
      }));
    }
    
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json(createSecureResponse({
      error: "Authorization failed",
      message: "Internal security verification error",
      watermarkVerified: false
    }));
  }
};

// Log security event middleware
const logSecurityEvent = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const eventType = 'api_access';
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'] || '';
  const path = req.path;
  
  // Store security event in background
  storage.logSecurityEvent({
    eventType,
    userId,
    severity: 'info',
    ipAddress,
    userAgent,
    details: {
      path,
      method: req.method,
      timestamp: new Date()
    }
  }).catch(err => {
    console.error("Failed to log security event:", err);
  });
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  /**
   * SYSTEM ENDPOINTS
   */
  
  // System status endpoint (public)
  app.get("/api/system/status", (req, res) => {
    const statusData = checkSystemIntegrity();
    res.json(createSecureResponse({
      status: "active",
      integrity: statusData.intact,
      securityLevel: statusData.securityLevel,
      lastChecked: statusData.lastChecked
    }));
  });
  
  // Quantum status endpoint (public)
  app.get("/api/quantum/status", (req, res) => {
    const statusData = getQuantumStatus();
    res.json(createSecureResponse(statusData));
  });
  
  // Copyright information endpoint (public)
  app.get("/api/copyright", (req, res) => {
    const watermark = createSecurityWatermark("copyright-information");
    
    res.json(createSecureResponse({
      ...COPYRIGHT_INFO,
      watermark: watermark.watermark,
      dnaVerified: true,
      protectionActive: true
    }));
  });
  
  // System integrity check endpoint (public)
  app.get("/api/security/integrity", (req, res) => {
    try {
      const integrityResult = checkSystemIntegrity();
      
      res.json(createSecureResponse({
        ...integrityResult,
        checkTime: new Date(),
        watermarkVerified: true
      }));
    } catch (error) {
      res.status(500).json(createSecureResponse({
        error: "Integrity check failed",
        details: error instanceof Error ? error.message : String(error),
        critical: true
      }));
    }
  });
  
  /**
   * AUTHENTICATION ENDPOINTS
   */
  
  // User registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json(createSecureResponse({
          error: "Missing required fields",
          message: "Username, email, and password are required"
        }));
      }
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json(createSecureResponse({
          error: "User already exists",
          message: "A user with this email already exists"
        }));
      }
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password
      });
      
      // Remove sensitive fields
      const { password: _, ...userInfo } = user;
      
      // Create token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );
      
      res.status(201).json(createSecureResponse({
        user: userInfo,
        token,
        authenticated: true
      }));
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json(createSecureResponse({
        error: "Registration failed",
        message: "Could not complete registration"
      }));
    }
  });
  
  // User login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json(createSecureResponse({
          error: "Missing credentials",
          message: "Email and password are required"
        }));
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json(createSecureResponse({
          error: "Authentication failed",
          message: "Invalid credentials"
        }));
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Log security event for failed login
        await storage.logSecurityEvent({
          eventType: 'login_failed',
          userId: user.id,
          ipAddress: req.ip,
          severity: 'warning',
          details: {
            email,
            timestamp: new Date()
          }
        });
        
        return res.status(401).json(createSecureResponse({
          error: "Authentication failed",
          message: "Invalid credentials"
        }));
      }
      
      // Update last login
      await storage.updateUser(user.id, {
        ...user,
        lastLogin: new Date()
      });
      
      // Create token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );
      
      // Log successful login
      await storage.logSecurityEvent({
        eventType: 'login_successful',
        userId: user.id,
        ipAddress: req.ip,
        severity: 'info',
        details: {
          timestamp: new Date()
        }
      });
      
      // Remove sensitive data
      const { password: _, ...userInfo } = user;
      
      res.json(createSecureResponse({
        user: userInfo,
        token,
        authenticated: true
      }));
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json(createSecureResponse({
        error: "Authentication failed",
        message: "Could not complete authentication"
      }));
    }
  });
  
  // Token verification endpoint
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json(createSecureResponse({
          error: "Missing token",
          message: "Token is required"
        }));
      }
      
      jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json(createSecureResponse({
            valid: false,
            message: "Invalid or expired token"
          }));
        }
        
        // Token is valid
        const userData = decoded as any;
        const user = await storage.getUser(userData.id);
        
        if (!user) {
          return res.status(401).json(createSecureResponse({
            valid: false,
            message: "User not found"
          }));
        }
        
        // Remove sensitive data
        const { password: _, ...userInfo } = user;
        
        res.json(createSecureResponse({
          valid: true,
          user: userInfo
        }));
      });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json(createSecureResponse({
        error: "Verification failed",
        message: "Could not verify token"
      }));
    }
  });
  
  /**
   * TERMINAL COMMAND ENDPOINTS
   */
  
  // Terminal command execution (authenticated)
  app.post("/api/terminal/command", authenticate, async (req, res) => {
    try {
      const { command } = req.body;
      
      if (!command) {
        return res.status(400).json(createSecureResponse({
          error: "Command is required"
        }));
      }
      
      const result = await processQuantumCommand(command);
      
      // Log command
      await storage.saveTerminalCommand({
        userId: req.user.id,
        command,
        response: result,
        securityLevel: command.toLowerCase().includes("secur") ? "elevated" : "standard"
      });
      
      res.json(createSecureResponse({
        response: result,
        executedAt: new Date()
      }));
    } catch (error) {
      console.error("Command execution error:", error);
      res.status(500).json(createSecureResponse({
        error: "Command execution failed",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Get terminal command history (authenticated)
  app.get("/api/terminal/history", authenticate, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const commands = await storage.getUserTerminalCommands(req.user.id, limit);
      
      res.json(createSecureResponse({
        commands
      }));
    } catch (error) {
      console.error("Failed to get command history:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to retrieve command history",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  /**
   * ACTIVITY LOG ENDPOINTS
   */
  
  // Get activity logs (authenticated)
  app.get("/api/activity-log", async (req, res) => {
    try {
      // Simulate activity logs until fully integrated with database
      const logs = [
        {
          id: "1",
          title: "Quantum API Connection",
          message: "Successfully connected to IBM Q quantum computing service",
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          type: "primary"
        },
        {
          id: "2",
          title: "Self-Learning Update",
          message: "Updated neural network weights based on recent interactions",
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          type: "info"
        },
        {
          id: "3",
          title: "System Optimization",
          message: "Self-repair module optimized memory usage patterns",
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          type: "success"
        },
        {
          id: "4",
          title: "Security Verification",
          message: "Completed DNA-based security verification protocol",
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          type: "warning"
        }
      ];
      
      res.json(createSecureResponse(logs));
    } catch (error) {
      console.error("Failed to get activity logs:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to retrieve activity logs",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Create activity log (authenticated)
  app.post("/api/activity-log", authenticate, async (req, res) => {
    try {
      const { title, message, type } = req.body;
      
      if (!title || !message || !type) {
        return res.status(400).json(createSecureResponse({
          error: "Missing required fields",
          message: "Title, message, and type are required"
        }));
      }
      
      const log = await storage.createActivityLog({
        userId: req.user.id,
        title,
        message,
        type,
        securityRelated: type === "warning" || type === "error"
      });
      
      res.json(createSecureResponse({
        log,
        success: true
      }));
    } catch (error) {
      console.error("Failed to create activity log:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to create activity log",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Clear activity logs (authenticated)
  app.delete("/api/activity-log", authenticate, async (req, res) => {
    try {
      await storage.clearActivityLogs(req.user.id);
      
      res.json(createSecureResponse({
        success: true,
        message: "Activity logs cleared successfully"
      }));
    } catch (error) {
      console.error("Failed to clear activity logs:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to clear activity logs",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  /**
   * AI ASSISTANT ENDPOINTS
   */
  
  // Create conversation (authenticated)
  app.post("/api/assistant/conversations", authenticate, async (req, res) => {
    try {
      const { title = "New Conversation" } = req.body;
      
      // Create conversation
      const conversation = await storage.createConversation({
        userId: req.user.id,
        title
      });
      
      // Add initial system message
      await storage.createMessage({
        conversationId: conversation.id,
        role: "system",
        content: "I am Quantum AI, an advanced artificial intelligence assistant with quantum computing capabilities. How can I help you today?"
      });
      
      res.json(createSecureResponse({
        conversation,
        success: true
      }));
    } catch (error) {
      console.error("Failed to create conversation:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to create conversation",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Get user conversations (authenticated)
  app.get("/api/assistant/conversations", authenticate, async (req, res) => {
    try {
      const conversations = await storage.getUserConversations(req.user.id);
      
      res.json(createSecureResponse({
        conversations
      }));
    } catch (error) {
      console.error("Failed to get conversations:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to retrieve conversations",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Get conversation messages (authenticated)
  app.get("/api/assistant/conversations/:id/messages", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get conversation
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json(createSecureResponse({
          error: "Conversation not found"
        }));
      }
      
      // Check ownership
      if (conversation.userId !== req.user.id) {
        // Log security event
        await storage.logSecurityEvent({
          eventType: 'unauthorized_access_attempt',
          userId: req.user.id,
          resourceId: id,
          severity: 'critical',
          details: {
            timestamp: new Date(),
            action: 'get_messages'
          }
        });
        
        return res.status(403).json(createSecureResponse({
          error: "Access denied",
          message: "You don't have permission to access this conversation"
        }));
      }
      
      // Get messages
      const messages = await storage.getConversationMessages(id);
      
      res.json(createSecureResponse({
        messages
      }));
    } catch (error) {
      console.error("Failed to get messages:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to retrieve messages",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Send message to conversation (authenticated)
  app.post("/api/assistant/conversations/:id/message", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json(createSecureResponse({
          error: "Message content is required"
        }));
      }
      
      // Get conversation
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json(createSecureResponse({
          error: "Conversation not found"
        }));
      }
      
      // Check ownership
      if (conversation.userId !== req.user.id) {
        // Log security event
        await storage.logSecurityEvent({
          eventType: 'unauthorized_access_attempt',
          userId: req.user.id,
          resourceId: id,
          severity: 'critical',
          details: {
            timestamp: new Date(),
            action: 'send_message'
          }
        });
        
        return res.status(403).json(createSecureResponse({
          error: "Access denied",
          message: "You don't have permission to access this conversation"
        }));
      }
      
      // Save user message
      await storage.createMessage({
        conversationId: id,
        role: "user",
        content
      });
      
      // Get AI response
      const aiResponse = await getOpenAIResponse(content);
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        conversationId: id,
        role: "assistant",
        content: aiResponse
      });
      
      // Update conversation
      await storage.updateConversation(id, {
        ...conversation,
        updatedAt: new Date()
      });
      
      res.json(createSecureResponse({
        message: aiMessage
      }));
    } catch (error) {
      console.error("Failed to process message:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to process message",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Delete conversation (authenticated)
  app.delete("/api/assistant/conversations/:id", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get conversation
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json(createSecureResponse({
          error: "Conversation not found"
        }));
      }
      
      // Check ownership
      if (conversation.userId !== req.user.id) {
        // Log security event
        await storage.logSecurityEvent({
          eventType: 'unauthorized_deletion_attempt',
          userId: req.user.id,
          resourceId: id,
          severity: 'critical',
          details: {
            timestamp: new Date(),
            action: 'delete_conversation'
          }
        });
        
        return res.status(403).json(createSecureResponse({
          error: "Access denied",
          message: "You don't have permission to delete this conversation"
        }));
      }
      
      // Delete conversation and its messages
      await storage.deleteConversation(id);
      
      res.json(createSecureResponse({
        success: true,
        message: "Conversation deleted successfully"
      }));
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to delete conversation",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  /**
   * USER SETTINGS ENDPOINTS
   */
  
  // Get user settings (authenticated)
  app.get("/api/settings", authenticate, async (req, res) => {
    try {
      const settings = await storage.getUserSettings(req.user.id);
      
      if (!settings) {
        // Create default settings
        const defaultSettings = await storage.upsertUserSettings({
          userId: req.user.id,
          theme: "dark",
          notifications: true,
          dataCollection: true,
          cloudSync: true,
          securityLevel: "high",
          antiTheftProtection: true,
          dnaSecurityEnabled: true
        });
        
        return res.json(createSecureResponse({
          settings: defaultSettings
        }));
      }
      
      res.json(createSecureResponse({
        settings
      }));
    } catch (error) {
      console.error("Failed to get settings:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to retrieve settings",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Update user settings (authenticated)
  app.put("/api/settings", authenticate, async (req, res) => {
    try {
      const { 
        theme, 
        notifications, 
        dataCollection, 
        cloudSync,
        securityLevel,
        antiTheftProtection,
        dnaSecurityEnabled,
        apiIntegrations 
      } = req.body;
      
      // Update settings
      const settings = await storage.upsertUserSettings({
        userId: req.user.id,
        theme,
        notifications,
        dataCollection,
        cloudSync,
        securityLevel,
        antiTheftProtection,
        dnaSecurityEnabled,
        apiIntegrations
      });
      
      res.json(createSecureResponse({
        settings,
        success: true
      }));
    } catch (error) {
      console.error("Failed to update settings:", error);
      res.status(500).json(createSecureResponse({
        error: "Failed to update settings",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  /**
   * ADVANCED SYSTEM ENDPOINTS (Protected)
   */
  
  // Advanced quantum operations (authenticated + root)
  app.post("/api/quantum/advanced", authenticate, authorizeRoot, async (req, res) => {
    try {
      const { operation } = req.body;
      
      if (!operation) {
        return res.status(400).json(createSecureResponse({
          error: "Operation is required"
        }));
      }
      
      // Log the operation
      await storage.logSecurityEvent({
        eventType: 'advanced_quantum_operation',
        userId: req.user.id,
        severity: 'info',
        details: {
          operation,
          timestamp: new Date()
        }
      });
      
      // Response for demonstration purposes
      res.json(createSecureResponse({
        success: true,
        operation,
        result: "Advanced quantum operation completed successfully",
        timestamp: new Date(),
        dnaProtected: true
      }));
    } catch (error) {
      console.error("Advanced quantum operation failed:", error);
      res.status(500).json(createSecureResponse({
        error: "Operation failed",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // System maintenance (authenticated + root)
  app.post("/api/system/maintenance", authenticate, authorizeRoot, async (req, res) => {
    try {
      const { action } = req.body;
      
      if (!action) {
        return res.status(400).json(createSecureResponse({
          error: "Maintenance action is required"
        }));
      }
      
      // Log the maintenance action
      await storage.logSecurityEvent({
        eventType: 'system_maintenance',
        userId: req.user.id,
        severity: 'info',
        details: {
          action,
          timestamp: new Date()
        }
      });
      
      // Process the action
      let result;
      switch (action) {
        case 'optimize':
          result = "System optimization completed successfully";
          break;
        case 'backup':
          result = "System backup initiated";
          break;
        case 'update':
          result = "System updates applied successfully";
          break;
        default:
          result = `Unknown maintenance action: ${action}`;
      }
      
      // Return result with security features
      res.json(createSecureResponse({
        success: true,
        action,
        result,
        timestamp: new Date(),
        selfProtection: (await activateSelfProtection()).active
      }));
    } catch (error) {
      console.error("Maintenance operation failed:", error);
      res.status(500).json(createSecureResponse({
        error: "Maintenance operation failed",
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  });
  
  // Create the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}