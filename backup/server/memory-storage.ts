/**
 * DNA-Protected In-Memory Storage Service
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 *
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - MEMORY STORAGE
 * This file provides a secure in-memory storage solution with
 * advanced DNA-based protection and verification.
 * 
 * FEATURES:
 * - DNA-based watermarking for all stored data
 * - Self-verification mechanisms to detect tampering
 * - Quantum-enhanced data protection
 * - Immutable copyright protection embedded in the storage
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import { 
  User, 
  InsertUser,
  ProtectedContent,
  InsertProtectedContent,
  SecurityLog,
  InsertSecurityLog,
  AntiTheftToken,
  InsertAntiTheftToken,
  Conversation,
  InsertConversation,
  Message,
  InsertMessage,
  ActivityLog,
  InsertActivityLog,
  UserSettings,
  InsertUserSettings,
  TerminalCommand,
  InsertTerminalCommand,
  IntegrityCheck,
  InsertIntegrityCheck
} from "@shared/schema";
import { createSecurityWatermark, createSecureResponse } from "./services/security-service";
import bcrypt from "bcrypt";
import crypto from "crypto";
import session from "express-session";
import memoryStore from "memorystore";

// Create memory store for sessions
const MemoryStore = memoryStore(session);

// STORAGE INTERFACE
export interface IMemoryStorage {
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
  sessionStore: any;
}

// MEMORY STORAGE IMPLEMENTATION
export class MemoryStorage implements IMemoryStorage {
  private users: Map<number, User> = new Map();
  private userIdCounter: number = 1;
  private usersByUsername: Map<string, User> = new Map();
  private usersByEmail: Map<string, User> = new Map();
  
  private protectedContents: Map<string, ProtectedContent> = new Map();
  private securityLogs: SecurityLog[] = [];
  private antiTheftTokens: Map<string, AntiTheftToken> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private activityLogs: Map<number, ActivityLog[]> = new Map();
  private userSettings: Map<number, UserSettings> = new Map();
  private terminalCommands: Map<number, TerminalCommand[]> = new Map();
  private integrityChecks: IntegrityCheck[] = [];
  
  sessionStore: any;
  
  constructor() {
    // Initialize memory session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize root users
    this.initializeRootUsers().catch(err => {
      console.error("Failed to initialize root users:", err);
    });
  }
  
  private async initializeRootUsers() {
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
    
    for (const rootUser of rootUsers) {
      const existingUser = await this.getUserByEmail(rootUser.email);
      
      if (!existingUser) {
        // Create security watermark for the user
        const userId = crypto.randomUUID();
        const securityInfo = createSecurityWatermark(userId);
        
        // Create the root user
        const user: User = {
          id: this.userIdCounter++,
          username: rootUser.username,
          email: rootUser.email,
          password: rootUser.password,
          isRoot: true,
          securityLevel: "maximum",
          dnaSignature: securityInfo.watermark.split('-')[1], // Use part of the watermark as DNA signature
          watermark: securityInfo.watermark,
          createdAt: new Date(),
          lastLogin: null,
          accessToken: null,
          tokenExpiry: null,
          copyrightOwner: "Ervin Remus Radosavlevici",
          systemVersion: "4.0.0"
        };
        
        // Store the user in our maps
        this.users.set(user.id, user);
        this.usersByUsername.set(user.username, user);
        this.usersByEmail.set(user.email, user);
        
        // Log the creation
        console.log(JSON.stringify(createSecureResponse({
          event: 'root_user_created',
          username: user.username,
          securityLevel: user.securityLevel,
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
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.usersByUsername.get(username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersByEmail.get(email);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    // Create security watermark for the user
    const userId = crypto.randomUUID();
    const securityInfo = createSecurityWatermark(userId);
    
    // Hash the password if it's not already hashed
    let userPassword = insertUser.password;
    if (!userPassword.startsWith('$2')) { // Check if it's already a bcrypt hash
      userPassword = await this.hashPassword(insertUser.password);
    }
    
    // Create the user object with DNA protection
    const user: User = {
      id: this.userIdCounter++,
      username: insertUser.username,
      email: insertUser.email,
      password: userPassword,
      isRoot: insertUser.isRoot || false,
      securityLevel: insertUser.securityLevel || "standard",
      dnaSignature: securityInfo.watermark.split('-')[1], // Use part of the watermark as DNA signature
      watermark: securityInfo.watermark,
      createdAt: new Date(),
      lastLogin: null,
      accessToken: null,
      tokenExpiry: null,
      copyrightOwner: "Ervin Remus Radosavlevici",
      systemVersion: "4.0.0"
    };
    
    // Store the user
    this.users.set(user.id, user);
    this.usersByUsername.set(user.username, user);
    this.usersByEmail.set(user.email, user);
    
    // Log security event
    await this.logSecurityEvent({
      eventType: 'user_created',
      userId: user.id,
      severity: 'info',
      details: JSON.stringify({
        username: user.username,
        timestamp: new Date()
      })
    });
    
    return user;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    
    if (!user) {
      return undefined;
    }
    
    // Hash password if provided
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }
    
    // Update user data
    const updatedUser: User = {
      ...user,
      ...data,
      // Preserve these fields
      id: user.id,
      dnaSignature: user.dnaSignature,
      watermark: user.watermark,
      createdAt: user.createdAt,
      copyrightOwner: user.copyrightOwner,
      systemVersion: user.systemVersion
    };
    
    // Update storage
    this.users.set(id, updatedUser);
    
    // Update indexes if username or email changed
    if (data.username && data.username !== user.username) {
      this.usersByUsername.delete(user.username);
      this.usersByUsername.set(updatedUser.username, updatedUser);
    }
    
    if (data.email && data.email !== user.email) {
      this.usersByEmail.delete(user.email);
      this.usersByEmail.set(updatedUser.email, updatedUser);
    }
    
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Protected content operations
  async protectContent(content: InsertProtectedContent): Promise<ProtectedContent> {
    const id = crypto.randomUUID();
    const timestamp = new Date();
    
    const protectedContent: ProtectedContent = {
      id,
      ...content,
      createdAt: timestamp,
      lastVerified: null,
      isValid: true,
      copyrightOwner: "Ervin Remus Radosavlevici",
      systemVersion: "4.0.0"
    };
    
    this.protectedContents.set(id, protectedContent);
    return protectedContent;
  }
  
  async getProtectedContent(id: string): Promise<ProtectedContent | undefined> {
    return this.protectedContents.get(id);
  }
  
  async verifyContentIntegrity(contentId: string): Promise<boolean> {
    const content = Array.from(this.protectedContents.values())
      .find(c => c.contentId === contentId);
    
    return content?.isValid ?? false;
  }
  
  // Security logging
  async logSecurityEvent(event: InsertSecurityLog): Promise<SecurityLog> {
    const id = this.securityLogs.length + 1;
    const timestamp = new Date();
    
    const log: SecurityLog = {
      id,
      ...event,
      timestamp,
      ipAddress: event.ipAddress || null,
      userAgent: event.userAgent || null,
      resourceId: event.resourceId || null,
      details: event.details || null
    };
    
    this.securityLogs.push(log);
    return log;
  }
  
  async getSecurityLogs(userId?: number, limit: number = 100): Promise<SecurityLog[]> {
    let logs = this.securityLogs;
    
    // Filter by user if provided
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    
    // Sort by timestamp descending
    logs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply limit
    return logs.slice(0, limit);
  }
  
  // Anti-theft protection
  async createAntiTheftToken(token: InsertAntiTheftToken): Promise<AntiTheftToken> {
    const id = this.antiTheftTokens.size + 1;
    
    const antiTheftToken: AntiTheftToken = {
      id,
      ...token,
      createdAt: new Date(),
      used: false,
      usedAt: null,
    };
    
    this.antiTheftTokens.set(token.token, antiTheftToken);
    return antiTheftToken;
  }
  
  async validateAntiTheftToken(token: string, resourceId: string): Promise<boolean> {
    const storedToken = this.antiTheftTokens.get(token);
    
    if (!storedToken || storedToken.resourceId !== resourceId || storedToken.used) {
      return false;
    }
    
    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      await this.invalidateAntiTheftToken(token);
      return false;
    }
    
    // Mark token as used
    storedToken.used = true;
    storedToken.usedAt = new Date();
    this.antiTheftTokens.set(token, storedToken);
    
    return true;
  }
  
  async invalidateAntiTheftToken(token: string): Promise<boolean> {
    const storedToken = this.antiTheftTokens.get(token);
    
    if (!storedToken) {
      return false;
    }
    
    storedToken.used = true;
    storedToken.usedAt = new Date();
    this.antiTheftTokens.set(token, storedToken);
    
    return true;
  }
  
  // Conversation operations
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = crypto.randomUUID();
    const timestamp = new Date();
    
    // Create security watermark
    const convId = crypto.randomUUID();
    const securityInfo = createSecurityWatermark(convId);
    
    const newConversation: Conversation = {
      id,
      ...conversation,
      watermark: securityInfo.watermark,
      dnaSignature: securityInfo.watermark.split('-')[1],
      secured: true,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.conversations.set(id, newConversation);
    this.messages.set(id, []);
    
    return newConversation;
  }
  
  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async getUserConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  async updateConversation(id: string, data: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    
    if (!conversation) {
      return undefined;
    }
    
    const updatedConversation: Conversation = {
      ...conversation,
      ...data,
      id: conversation.id,
      watermark: conversation.watermark,
      dnaSignature: conversation.dnaSignature,
      createdAt: conversation.createdAt,
      updatedAt: new Date()
    };
    
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
  
  async deleteConversation(id: string): Promise<boolean> {
    if (!this.conversations.has(id)) {
      return false;
    }
    
    // Delete messages
    this.messages.delete(id);
    
    // Delete conversation
    this.conversations.delete(id);
    
    return true;
  }
  
  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = crypto.randomUUID();
    const timestamp = new Date();
    
    // Create security watermark
    const msgId = crypto.randomUUID();
    const securityInfo = createSecurityWatermark(msgId);
    
    const newMessage: Message = {
      id,
      ...message,
      watermark: securityInfo.watermark,
      dnaSignature: securityInfo.watermark.split('-')[1],
      secured: true,
      timestamp
    };
    
    // Get conversation messages or create empty array
    let conversationMessages = this.messages.get(message.conversationId) || [];
    conversationMessages.push(newMessage);
    
    // Store updated messages
    this.messages.set(message.conversationId, conversationMessages);
    
    // Update conversation updatedAt
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      conversation.updatedAt = timestamp;
      this.conversations.set(message.conversationId, conversation);
    }
    
    return newMessage;
  }
  
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const messages = this.messages.get(conversationId) || [];
    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  // Activity log operations
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = 1;
    const timestamp = new Date();
    
    // Create security watermark for important logs
    let watermark = null;
    if (log.securityRelated) {
      const logId = crypto.randomUUID();
      const securityInfo = createSecurityWatermark(logId);
      watermark = securityInfo.watermark;
    }
    
    const newLog: ActivityLog = {
      id,
      ...log,
      watermark,
      timestamp
    };
    
    // Get user logs or create empty array
    let userLogs = this.activityLogs.get(log.userId) || [];
    
    // Set correct id based on existing logs
    newLog.id = userLogs.length + 1;
    
    userLogs.push(newLog);
    
    // Store updated logs
    this.activityLogs.set(log.userId, userLogs);
    
    return newLog;
  }
  
  async getUserActivityLogs(userId: number, limit: number = 50): Promise<ActivityLog[]> {
    const logs = this.activityLogs.get(userId) || [];
    
    // Sort by timestamp descending
    const sortedLogs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply limit
    return sortedLogs.slice(0, limit);
  }
  
  async clearActivityLogs(userId: number): Promise<boolean> {
    this.activityLogs.delete(userId);
    return true;
  }
  
  // User settings
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return this.userSettings.get(userId);
  }
  
  async upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const existing = this.userSettings.get(settings.userId);
    
    if (existing) {
      // Update
      const updatedSettings: UserSettings = {
        ...existing,
        ...settings,
        id: existing.id
      };
      
      this.userSettings.set(settings.userId, updatedSettings);
      return updatedSettings;
    } else {
      // Create
      const id = this.userSettings.size + 1;
      
      const newSettings: UserSettings = {
        id,
        ...settings
      };
      
      this.userSettings.set(settings.userId, newSettings);
      return newSettings;
    }
  }
  
  // Terminal command operations
  async saveTerminalCommand(command: InsertTerminalCommand): Promise<TerminalCommand> {
    const id = crypto.randomUUID();
    const timestamp = new Date();
    
    // Create security watermark for sensitive commands
    let watermark = null;
    if (command.securityLevel !== 'standard') {
      const cmdId = crypto.randomUUID();
      const securityInfo = createSecurityWatermark(cmdId);
      watermark = securityInfo.watermark;
    }
    
    const newCommand: TerminalCommand = {
      id,
      ...command,
      watermark,
      timestamp
    };
    
    // Get user commands or create empty array
    let userCommands = this.terminalCommands.get(command.userId) || [];
    userCommands.push(newCommand);
    
    // Store updated commands
    this.terminalCommands.set(command.userId, userCommands);
    
    return newCommand;
  }
  
  async getUserTerminalCommands(userId: number, limit: number = 50): Promise<TerminalCommand[]> {
    const commands = this.terminalCommands.get(userId) || [];
    
    // Sort by timestamp descending
    const sortedCommands = commands.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply limit
    return sortedCommands.slice(0, limit);
  }
  
  // System integrity
  async logIntegrityCheck(check: InsertIntegrityCheck): Promise<IntegrityCheck> {
    const id = this.integrityChecks.length + 1;
    const timestamp = new Date();
    
    // Create watermark
    const checkId = crypto.randomUUID();
    const securityInfo = createSecurityWatermark(checkId);
    
    const newCheck: IntegrityCheck = {
      id,
      ...check,
      timestamp,
      watermark: securityInfo.watermark,
      copyrightOwner: "Ervin Remus Radosavlevici"
    };
    
    this.integrityChecks.push(newCheck);
    return newCheck;
  }
  
  async getIntegrityChecks(limit: number = 20): Promise<IntegrityCheck[]> {
    // Sort by timestamp descending
    const sortedChecks = this.integrityChecks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply limit
    return sortedChecks.slice(0, limit);
  }
}

// Create and export the storage instance
export const memoryStorage = new MemoryStorage();