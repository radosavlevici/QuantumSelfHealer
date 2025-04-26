/**
 * DNA-Protected Simple Memory Storage Service
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 *
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - MEMORY STORAGE
 * This file provides a secure in-memory storage solution with
 * advanced DNA-based protection and verification.
 */

import { 
  User, 
  InsertUser
} from "@shared/schema";
import { createSecurityWatermark, createSecureResponse } from "./services/security-service";
import bcrypt from "bcrypt";
import crypto from "crypto";
import memorystore from "memorystore";
import session from "express-session";

// Create memory store for sessions
const MemoryStore = memorystore(session);

// SIMPLIFIED STORAGE INTERFACE
export interface ISimpleStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: any;
}

// MEMORY STORAGE IMPLEMENTATION
export class SimpleMemoryStorage implements ISimpleStorage {
  private users: Map<number, User> = new Map();
  private userIdCounter: number = 1;
  private usersByUsername: Map<string, User> = new Map();
  private usersByEmail: Map<string, User> = new Map();
  sessionStore: any;
  
  constructor() {
    // Initialize memory session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize root users
    this.initializeRootUsers();
  }
  
  private async initializeRootUsers() {
    try {
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
    } catch (error) {
      console.error("Failed to initialize root users:", error);
    }
  }
  
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
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
    
    return user;
  }
}

// Create and export the storage instance
export const simpleStorage = new SimpleMemoryStorage();