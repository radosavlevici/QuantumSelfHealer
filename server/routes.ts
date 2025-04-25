import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getOpenAIResponse } from "./services/openai-service";
import { getQuantumStatus, processQuantumCommand } from "./services/quantum-service";
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
      
      // Return AI message
      res.json({
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      });
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
      // For demo purposes, we'll return the first root user
      const user = await storage.getUser(1);
      
      if (user) {
        // Don't send the password in the response
        const { password, ...userWithoutPassword } = user;
        res.json({ 
          user: userWithoutPassword,
          isRoot: true
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
  
  app.get("/api/users", async (req, res) => {
    try {
      // In a real app, this would be secured and only accessible to admins
      // Here we're returning all root users for the assistant
      const rootUsers = [];
      
      // Get users with IDs 1 and 2 (our root users)
      const user1 = await storage.getUser(1);
      const user2 = await storage.getUser(2);
      
      if (user1) {
        const { password: _p1, ...userWithoutPassword1 } = user1;
        rootUsers.push(userWithoutPassword1);
      }
      
      if (user2) {
        const { password: _p2, ...userWithoutPassword2 } = user2;
        rootUsers.push(userWithoutPassword2);
      }
      
      res.json({ rootUsers });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to get root users",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
