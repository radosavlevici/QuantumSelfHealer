/**
 * DNA-Protected Secure Storage Service
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 *
 * This file manages secure storage with DNA-based protection, watermarking,
 * and anti-theft mechanisms. All data operations are secured and tracked.
 */

import { 
  users, 
  protectedContent,
  securityLogs,
  antiTheftTokens,
  conversations,
  messages,
  activityLogs,
  userSettings,
  terminalCommands,
  integrityChecks,
  type User, 
  type InsertUser,
  type ProtectedContent,
  type InsertProtectedContent,
  type SecurityLog,
  type InsertSecurityLog,
  type AntiTheftToken,
  type InsertAntiTheftToken,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type ActivityLog,
  type InsertActivityLog,
  type UserSettings,
  type InsertUserSettings,
  type TerminalCommand,
  type InsertTerminalCommand,
  type IntegrityCheck,
  type InsertIntegrityCheck
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { createSecurityWatermark, createSecureResponse } from "./services/security-service";
import bcrypt from "bcrypt";
import crypto from "crypto";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// PostgreSQL session store for persistent sessions
const PostgresSessionStore = connectPg(session);

// STORAGE INTERFACE
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Protected content operations
  protectContent(content: InsertProtectedContent): Promise<ProtectedContent>;
  getProtectedContent(id: string): Promise<ProtectedContent | undefined>;
  verifyContentIntegrity(contentId: string): Promise<boolean>;
  
  // Security logging
  logSecurityEvent(event: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(userId?: number, limit?: number): Promise<SecurityLog[]>;
  
  // Anti-theft protection
  createAntiTheftToken(token: InsertAntiTheftToken): Promise<AntiTheftToken>;
  validateAntiTheftToken(token: string, resourceId: string): Promise<boolean>;
  invalidateAntiTheftToken(token: string): Promise<boolean>;
  
  // Conversation operations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  updateConversation(id: string, data: Partial<InsertConversation>): Promise<Conversation | undefined>;
  deleteConversation(id: string): Promise<boolean>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getConversationMessages(conversationId: string): Promise<Message[]>;
  
  // Activity log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getUserActivityLogs(userId: number, limit?: number): Promise<ActivityLog[]>;
  clearActivityLogs(userId: number): Promise<boolean>;
  
  // User settings
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  
  // Terminal command operations
  saveTerminalCommand(command: InsertTerminalCommand): Promise<TerminalCommand>;
  getUserTerminalCommands(userId: number, limit?: number): Promise<TerminalCommand[]>;
  
  // System integrity
  logIntegrityCheck(check: InsertIntegrityCheck): Promise<IntegrityCheck>;
  getIntegrityChecks(limit?: number): Promise<IntegrityCheck[]>;
  
  // Session management
  sessionStore: session.SessionStore;
}

// DATABASE IMPLEMENTATION
export class SecureDatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    // Initialize session store with PostgreSQL
    this.sessionStore = new PostgresSessionStore({
      pool, 
      createTableIfMissing: true, 
      tableName: 'secured_sessions'
    });
    
    // Initialize root users if they don't exist
    this.initializeRootUsers().catch(err => {
      console.error("Failed to initialize root users:", err);
    });
  }
  
  private async initializeRootUsers() {
    // Root user information
    const rootUsers = [
      {
        username: "ervin210",
        password: await this.hashPassword("quantum-secure-password"),
        email: "ervin210@icloud.com",
        isRoot: true,
        securityLevel: "maximum"
      },
      {
        username: "ervin.radosavlevici",
        password: await this.hashPassword("quantum-secure-password"),
        email: "radosavlevici.ervin@gmail.com",
        isRoot: true,
        securityLevel: "maximum"
      }
    ];
    
    // Add each root user if they don't already exist
    for (const rootUser of rootUsers) {
      const existingUser = await this.getUserByEmail(rootUser.email);
      
      if (!existingUser) {
        // Create security watermark for the user
        const userId = crypto.randomUUID();
        const securityInfo = createSecurityWatermark(userId);
        
        // Create the user with DNA protection
        await db.insert(users).values({
          username: rootUser.username,
          email: rootUser.email,
          password: rootUser.password,
          isRoot: rootUser.isRoot,
          securityLevel: rootUser.securityLevel,
          dnaSignature: securityInfo.dnaSignature,
          watermark: securityInfo.watermark
        });
        
        // Log the creation
        console.log(JSON.stringify(createSecureResponse({
          event: 'root_user_created',
          username: rootUser.username,
          securityLevel: rootUser.securityLevel,
          timestamp: new Date()
        })));
      }
    }
  }
  
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }
  
  private async comparePasswords(plaintext: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plaintext, hashed);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    // Create security watermark for the user
    const userId = crypto.randomUUID();
    const securityInfo = createSecurityWatermark(userId);
    
    // Hash the password
    const hashedPassword = await this.hashPassword(insertUser.password);
    
    // Insert with security features
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
      dnaSignature: securityInfo.dnaSignature,
      watermark: securityInfo.watermark
    }).returning();
    
    // Log security event
    await this.logSecurityEvent({
      eventType: 'user_created',
      userId: user.id,
      severity: 'info',
      details: {
        username: user.username,
        timestamp: new Date()
      }
    });
    
    return user;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }
    
    const [user] = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // Protected content operations
  async protectContent(content: InsertProtectedContent): Promise<ProtectedContent> {
    const [result] = await db.insert(protectedContent).values(content).returning();
    return result;
  }
  
  async getProtectedContent(id: string): Promise<ProtectedContent | undefined> {
    const [content] = await db.select()
      .from(protectedContent)
      .where(eq(protectedContent.id, id));
    
    return content;
  }
  
  async verifyContentIntegrity(contentId: string): Promise<boolean> {
    const [content] = await db.select()
      .from(protectedContent)
      .where(eq(protectedContent.contentId, contentId));
    
    // In a real implementation, this would verify the watermark and DNA signature
    return content?.isValid ?? false;
  }
  
  // Security logging
  async logSecurityEvent(event: InsertSecurityLog): Promise<SecurityLog> {
    const [log] = await db.insert(securityLogs).values(event).returning();
    return log;
  }
  
  async getSecurityLogs(userId?: number, limit: number = 100): Promise<SecurityLog[]> {
    if (userId) {
      return await db.select()
        .from(securityLogs)
        .where(eq(securityLogs.userId, userId))
        .orderBy(desc(securityLogs.timestamp))
        .limit(limit);
    }
    
    return await db.select()
      .from(securityLogs)
      .orderBy(desc(securityLogs.timestamp))
      .limit(limit);
  }
  
  // Anti-theft protection
  async createAntiTheftToken(token: InsertAntiTheftToken): Promise<AntiTheftToken> {
    const [result] = await db.insert(antiTheftTokens).values(token).returning();
    return result;
  }
  
  async validateAntiTheftToken(token: string, resourceId: string): Promise<boolean> {
    const [storedToken] = await db.select()
      .from(antiTheftTokens)
      .where(
        and(
          eq(antiTheftTokens.token, token),
          eq(antiTheftTokens.resourceId, resourceId),
          eq(antiTheftTokens.used, false)
        )
      );
    
    if (!storedToken) {
      return false;
    }
    
    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      await this.invalidateAntiTheftToken(token);
      return false;
    }
    
    // Mark token as used
    await db.update(antiTheftTokens)
      .set({
        used: true,
        usedAt: new Date()
      })
      .where(eq(antiTheftTokens.id, storedToken.id));
    
    return true;
  }
  
  async invalidateAntiTheftToken(token: string): Promise<boolean> {
    const result = await db.update(antiTheftTokens)
      .set({
        used: true,
        usedAt: new Date()
      })
      .where(eq(antiTheftTokens.token, token));
    
    return result.rowCount > 0;
  }
  
  // Conversation operations
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    // Create security watermark
    const convId = crypto.randomUUID();
    const securityInfo = createSecurityWatermark(convId);
    
    const [result] = await db.insert(conversations).values({
      ...conversation,
      watermark: securityInfo.watermark,
      dnaSignature: securityInfo.dnaSignature
    }).returning();
    
    return result;
  }
  
  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select()
      .from(conversations)
      .where(eq(conversations.id, id));
    
    return conversation;
  }
  
  async getUserConversations(userId: number): Promise<Conversation[]> {
    return await db.select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }
  
  async updateConversation(id: string, data: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const [conversation] = await db.update(conversations)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(conversations.id, id))
      .returning();
    
    return conversation;
  }
  
  async deleteConversation(id: string): Promise<boolean> {
    // First, delete all messages in the conversation
    await db.delete(messages)
      .where(eq(messages.conversationId, id));
    
    // Then delete the conversation
    const result = await db.delete(conversations)
      .where(eq(conversations.id, id));
    
    return result.rowCount > 0;
  }
  
  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    // Create security watermark
    const msgId = crypto.randomUUID();
    const securityInfo = createSecurityWatermark(msgId);
    
    const [result] = await db.insert(messages).values({
      ...message,
      watermark: securityInfo.watermark,
      dnaSignature: securityInfo.dnaSignature
    }).returning();
    
    return result;
  }
  
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }
  
  // Activity log operations
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    // Create security watermark for important logs
    let watermark = null;
    if (log.securityRelated) {
      const logId = crypto.randomUUID();
      const securityInfo = createSecurityWatermark(logId);
      watermark = securityInfo.watermark;
    }
    
    const [result] = await db.insert(activityLogs).values({
      ...log,
      watermark
    }).returning();
    
    return result;
  }
  
  async getUserActivityLogs(userId: number, limit: number = 50): Promise<ActivityLog[]> {
    return await db.select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.timestamp))
      .limit(limit);
  }
  
  async clearActivityLogs(userId: number): Promise<boolean> {
    const result = await db.delete(activityLogs)
      .where(eq(activityLogs.userId, userId));
    
    return result.rowCount > 0;
  }
  
  // User settings
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db.select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    
    return settings;
  }
  
  async upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    // Check if settings exist
    const existing = await this.getUserSettings(settings.userId);
    
    if (existing) {
      // Update existing settings
      const [updated] = await db.update(userSettings)
        .set(settings)
        .where(eq(userSettings.userId, settings.userId))
        .returning();
      
      return updated;
    } else {
      // Create new settings
      const [created] = await db.insert(userSettings)
        .values(settings)
        .returning();
      
      return created;
    }
  }
  
  // Terminal command operations
  async saveTerminalCommand(command: InsertTerminalCommand): Promise<TerminalCommand> {
    // Create security watermark for sensitive commands
    let watermark = null;
    if (command.securityLevel !== 'standard') {
      const cmdId = crypto.randomUUID();
      const securityInfo = createSecurityWatermark(cmdId);
      watermark = securityInfo.watermark;
    }
    
    const [result] = await db.insert(terminalCommands).values({
      ...command,
      watermark
    }).returning();
    
    return result;
  }
  
  async getUserTerminalCommands(userId: number, limit: number = 50): Promise<TerminalCommand[]> {
    return await db.select()
      .from(terminalCommands)
      .where(eq(terminalCommands.userId, userId))
      .orderBy(desc(terminalCommands.timestamp))
      .limit(limit);
  }
  
  // System integrity
  async logIntegrityCheck(check: InsertIntegrityCheck): Promise<IntegrityCheck> {
    const [result] = await db.insert(integrityChecks).values(check).returning();
    return result;
  }
  
  async getIntegrityChecks(limit: number = 20): Promise<IntegrityCheck[]> {
    return await db.select()
      .from(integrityChecks)
      .orderBy(desc(integrityChecks.timestamp))
      .limit(limit);
  }
}

// Create and export the storage instance
export const storage = new SecureDatabaseStorage();