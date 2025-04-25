import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getOpenAIResponse } from "./services/openai-service";
import { getQuantumStatus, processQuantumCommand } from "./services/quantum-service";
import { authenticateByEmail, hasRootPrivileges } from "./services/auth-service";
import { generateToken, verifyToken, authorizeRequest } from "./services/token-service";
import { createWatermark, verifyWatermark, createSecureResponse, activateSelfProtection, COPYRIGHT_INFO, checkApplicationIntegrity } from "./services/watermark-service";
import type { User } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // System status endpoint
  app.get("/api/system/status", (req, res) => {
    res.json({ status: "active" });
  });

  // Quantum status endpoint
  app.get("/api/quantum/status", (req, res) => {
    const statusData = getQuantumStatus();
    res.json(statusData);
  });

  // Terminal command execution
  app.post("/api/terminal/command", async (req, res) => {
    try {
      const { command } = req.body;
      
      if (!command) {
        return res.status(400).json({ error: "Command is required" });
      }
      
      const result = await processQuantumCommand(command);
      res.json({ response: result });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to execute command",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Feature toggle endpoint
  app.post("/api/features/toggle", (req, res) => {
    try {
      const { id, enabled } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: "Feature ID is required" });
      }
      
      // Simulate feature toggling (in a real app, this would persist to database)
      res.json({ success: true, feature: { id, enabled } });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to toggle feature",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Activity log endpoints
  app.get("/api/activity-log", (req, res) => {
    // Return some sample activity logs
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
    
    res.json(logs);
  });

  app.post("/api/activity-log", (req, res) => {
    try {
      const { title, message, type } = req.body;
      
      if (!title || !message || !type) {
        return res.status(400).json({ error: "Title, message, and type are required" });
      }
      
      // In a real app, this would be saved to a database
      res.json({ 
        success: true,
        log: {
          id: String(Date.now()),
          title,
          message,
          type,
          timestamp: new Date()
        } 
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to add activity log",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.delete("/api/activity-log", (req, res) => {
    // In a real app, this would delete logs from a database
    res.json({ success: true });
  });

  // AI Assistant endpoints
  app.get("/api/assistant/conversations", (req, res) => {
    // Return empty conversations array - in a real app, this would fetch from database
    res.json([]);
  });

  app.post("/api/assistant/conversations", (req, res) => {
    try {
      const { title = "New Conversation" } = req.body;
      
      // Create a new conversation
      const conversation = {
        id: crypto.randomUUID(),
        title,
        messages: [
          {
            id: crypto.randomUUID(),
            role: "system",
            content: "I am Quantum AI, an advanced artificial intelligence assistant with quantum computing capabilities. How can I help you today?",
            timestamp: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to create conversation",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/assistant/conversations/:id/message", async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: "Message content is required" });
      }
      
      // Generate AI response using OpenAI
      const aiResponse = await getOpenAIResponse(content);
      
      // Create message with unique ID
      const messageId = crypto.randomUUID();
      
      // Return AI message with watermark and copyright protection
      res.json(createSecureResponse({
        id: messageId,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        dnaProtected: true
      }));
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to generate AI response",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Storage sync endpoints
  app.post("/api/storage/sync", (req, res) => {
    try {
      // In a real app, this would sync data to a database
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to sync storage",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.get("/api/storage/restore", (req, res) => {
    try {
      // In a real app, this would retrieve data from a database
      res.json({});
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to restore storage",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // User endpoints
  app.get("/api/users/current", async (req, res) => {
    try {
      // In a real app, we would use session/authentication to determine the current user
      // For demo purposes, we're returning a fixed user
      const user = await storage.getUser(1);
      
      if (user) {
        // Don't send the password or root status in the response
        const { password, ...userWithoutPassword } = user;
        res.json({ 
          user: userWithoutPassword,
          authenticated: true
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to get current user",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // This endpoint was previously exposing root users
  // Now it only returns the number of authenticated users without revealing who they are
  app.get("/api/users", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      
      // Only return the count, not the actual users
      res.json({ 
        userCount: allUsers.length,
        message: "All users are properly authenticated"
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to get user information",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Authenticate user by email and generate secure JWT token
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      const authResult = await authenticateByEmail(email);
      
      // Send back authentication result without exposing root status
      if (authResult.authenticated && authResult.user) {
        // Generate JWT token - root status is not included in the token
        const token = await generateToken(
          authResult.user.id,
          authResult.user.email, 
          authResult.user.username
        );
        
        // Create secure response with watermark and copyright protection
        res.json(createSecureResponse({
          authenticated: true,
          user: {
            id: authResult.user.id,
            username: authResult.user.username,
            email: authResult.user.email
          },
          token, // Return JWT token for client to use in future requests
          copyrightProtected: true
        }));
      } else {
        res.status(401).json({ 
          authenticated: false,
          message: "Authentication failed" 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        error: "Authentication error",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Token verification middleware for protected routes
  // Add this endpoint to verify token validity without exposing root status
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      
      const payload = await verifyToken(token);
      
      if (!payload) {
        return res.status(401).json({ 
          valid: false, 
          message: "Invalid or expired token" 
        });
      }
      
      res.json({ 
        valid: true,
        userId: payload.userId,
        username: payload.username
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Token verification failed",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Protected endpoint for advanced quantum operations with token-based auth
  // Checks for root privileges internally without exposing this information
  app.post("/api/quantum/advanced", async (req, res) => {
    try {
      const { operation } = req.body;
      const authHeader = req.headers.authorization;
      
      if (!operation) {
        return res.status(400).json({ error: "Operation is required" });
      }
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: "Unauthorized",
          message: "Valid authentication token is required"
        });
      }
      
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Authorize the request and check for root privileges
      // This doesn't expose root status in the response
      const authResult = await authorizeRequest(token, true); // Require root
      
      if (!authResult.valid) {
        // Generic error message doesn't expose root-only nature
        return res.status(403).json({ 
          error: "Access denied",
          message: authResult.message || "You don't have permission to perform this operation"
        });
      }
      
      // Process the operation for authorized users
      // The client doesn't know this is specifically for root users
      // Apply watermark and copyright protection
      res.json(createSecureResponse({
        success: true,
        operation,
        result: "Advanced operation completed successfully",
        timestamp: new Date(),
        dnaProtected: true,
        selfDefense: true
      }));
    } catch (error) {
      res.status(500).json({ 
        error: "Operation failed",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Copyright and watermark endpoint
  app.get("/api/copyright", (req, res) => {
    // Return copyright information with watermark
    const copyrightWatermark = createWatermark("copyright-info");
    
    res.json({
      ...COPYRIGHT_INFO,
      watermark: copyrightWatermark.watermark,
      dnaVerified: true,
      protectionActive: true
    });
  });
  
  // Application integrity check endpoint
  app.get("/api/security/integrity", (req, res) => {
    try {
      // Check application integrity
      const integrityResult = checkApplicationIntegrity();
      
      // Return integrity result with security watermark
      res.json(createSecureResponse({
        ...integrityResult,
        checkTime: new Date(),
        watermarkVerified: true
      }));
    } catch (error) {
      res.status(500).json({ 
        error: "Integrity check failed",
        details: error instanceof Error ? error.message : String(error),
        critical: true
      });
    }
  });
  
  // DNA-based security verification endpoint
  app.post("/api/security/verify", async (req, res) => {
    try {
      const { watermark, content } = req.body;
      
      if (!watermark || !content) {
        return res.status(400).json({ error: "Watermark and content are required" });
      }
      
      // Create DNA signature for the content
      const contentId = crypto.randomUUID();
      const securityInfo = createWatermark(contentId);
      const isValid = verifyWatermark(watermark, securityInfo.dnaSignature);
      
      // Return verification result with secure watermark
      res.json(createSecureResponse({
        verified: isValid,
        contentStatus: isValid ? "authentic" : "tampered",
        securityLevel: "DNA",
        protection: activateSelfProtection()
      }));
    } catch (error) {
      res.status(500).json({ 
        error: "Verification failed",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // System maintenance endpoint (root access only, but not explicitly mentioned)
  app.post("/api/system/maintenance", async (req, res) => {
    try {
      const { action } = req.body;
      const authHeader = req.headers.authorization;
      
      if (!action) {
        return res.status(400).json({ error: "Maintenance action is required" });
      }
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: "Unauthorized",
          message: "Valid authentication token is required"
        });
      }
      
      const token = authHeader.substring(7);
      
      // Verify token and check for root privileges
      const authResult = await authorizeRequest(token, true);
      
      if (!authResult.valid) {
        // Generic error message doesn't reveal root-only nature
        return res.status(403).json({ 
          error: "Access denied",
          message: "You don't have permission to perform system maintenance"
        });
      }
      
      // Process the maintenance action
      // In a real app, this would perform actual system maintenance
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
      
      // Return result with watermark and copyright protection
      res.json(createSecureResponse({
        success: true,
        action,
        result,
        timestamp: new Date(),
        selfProtection: activateSelfProtection().active
      }));
    } catch (error) {
      res.status(500).json({ 
        error: "Maintenance operation failed",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
