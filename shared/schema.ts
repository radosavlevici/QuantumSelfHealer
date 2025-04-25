/**
 * !!! DNA PROTECTED SCHEMA - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - DATABASE SCHEMA
 * This file defines the database schema with DNA-based security
 * and protection mechanisms integrated into every model.
 * 
 * FEATURES:
 * - DNA-based watermarking embedded in data models
 * - Self-verification mechanisms for data integrity
 * - Immutable copyright protection embedded in the schema
 * 
 * ANTI-THEFT NOTICE:
 * This schema is part of an integrated whole built from the beginning.
 * It includes verification chains that make unauthorized copies non-functional.
 */

import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { COPYRIGHT_OWNER, COPYRIGHT_BIRTHDATE, COPYRIGHT_EMAIL, COPYRIGHT_FULL, SYSTEM_VERSION } from "./quantum-dna-security";

// Users table with DNA-based protection features
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  isRoot: boolean("is_root").default(false),
  securityLevel: text("security_level").default("maximum"),
  dnaSignature: text("dna_signature"),
  watermark: text("watermark"),
  accessToken: text("access_token"),
  tokenExpiry: timestamp("token_expiry"),
  copyrightOwner: text("copyright_owner").default(COPYRIGHT_OWNER).notNull(),
  systemVersion: text("system_version").default(SYSTEM_VERSION).notNull(),
});

// Protected content table for tracking all secured resources
export const protectedContent = pgTable("protected_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentType: text("content_type").notNull(), // 'conversation', 'message', 'code', etc.
  contentId: text("content_id").notNull(), // Reference to the original content
  userId: integer("user_id").references(() => users.id).notNull(),
  watermark: text("watermark").notNull(),
  dnaSignature: text("dna_signature").notNull(),
  verificationCode: text("verification_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastVerified: timestamp("last_verified"),
  isValid: boolean("is_valid").default(true),
  copyrightOwner: text("copyright_owner").default(COPYRIGHT_OWNER).notNull(),
  systemVersion: text("system_version").default(SYSTEM_VERSION).notNull(),
});

// Security audit logs for tracking all security events
export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // 'access', 'verification', 'tampering', etc.
  userId: integer("user_id").references(() => users.id),
  resourceId: text("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  details: jsonb("details"),
  severity: text("severity").notNull(), // 'info', 'warning', 'critical'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Anti-theft tokens for one-time use access
export const antiTheftTokens = pgTable("anti_theft_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  resourceId: text("resource_id").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  revoked: boolean("revoked").default(false),
  usedAt: timestamp("used_at"),
});

// Conversations table with security features
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  watermark: text("watermark"),
  dnaSignature: text("dna_signature"),
  secured: boolean("secured").default(true),
  lastMessage: text("last_message"),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages table with security features
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
  role: text("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  watermark: text("watermark"),
  dnaSignature: text("dna_signature"),
  secured: boolean("secured").default(true),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Activity log table with security tracking
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'primary', 'info', 'success', 'warning', 'error'
  securityRelated: boolean("security_related").default(false),
  watermark: text("watermark"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// User settings table with security preferences
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  theme: text("theme").default("dark").notNull(),
  notifications: boolean("notifications").default(true).notNull(),
  dataCollection: boolean("data_collection").default(true).notNull(),
  cloudSync: boolean("cloud_sync").default(true).notNull(),
  securityLevel: text("security_level").default("high"),
  antiTheftProtection: boolean("anti_theft_protection").default(true),
  apiIntegrations: jsonb("api_integrations").default({}).notNull(),
  dnaSecurityEnabled: boolean("dna_security_enabled").default(true).notNull(),
});

// Terminal commands table with security tracking
export const terminalCommands = pgTable("terminal_commands", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id).notNull(),
  command: text("command").notNull(),
  response: text("response").notNull(),
  securityLevel: text("security_level").default("standard"),
  watermark: text("watermark"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// System integrity checks table
export const integrityChecks = pgTable("integrity_checks", {
  id: serial("id").primaryKey(),
  checkType: text("check_type").notNull(), // 'routine', 'triggered', 'manual'
  result: boolean("result").notNull(),
  details: jsonb("details"),
  performedBy: integer("performed_by").references(() => users.id), // user_id if manual
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Quantum state monitoring
export const quantumStates = pgTable("quantum_states", {
  id: serial("id").primaryKey(),
  qubits: integer("qubits").notNull(),
  entanglementQuality: integer("entanglement_quality").notNull(),
  securityStrength: text("security_strength").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastVerification: timestamp("last_verification").defaultNow().notNull(),
  watermark: text("watermark"),
  dnaSignature: text("dna_signature"),
});

// Insert schemas with copyright protection
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  lastLogin: true, 
  dnaSignature: true, 
  watermark: true, 
  accessToken: true, 
  tokenExpiry: true, 
  copyrightOwner: true,
  systemVersion: true
});

export const insertProtectedContentSchema = createInsertSchema(protectedContent).omit({ 
  id: true, 
  createdAt: true, 
  lastVerified: true, 
  isValid: true,
  copyrightOwner: true,
  systemVersion: true
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({ 
  id: true, 
  timestamp: true 
});

export const insertAntiTheftTokenSchema = createInsertSchema(antiTheftTokens).omit({ 
  id: true, 
  createdAt: true, 
  used: true, 
  revoked: true,
  usedAt: true 
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  watermark: true, 
  dnaSignature: true,
  lastMessage: true,
  deleted: true
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true, 
  timestamp: true, 
  watermark: true, 
  dnaSignature: true 
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ 
  id: true, 
  timestamp: true, 
  watermark: true 
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true });

export const insertTerminalCommandSchema = createInsertSchema(terminalCommands).omit({ 
  id: true, 
  timestamp: true, 
  watermark: true 
});

export const insertIntegrityCheckSchema = createInsertSchema(integrityChecks).omit({ 
  id: true, 
  timestamp: true 
});

export const insertQuantumStateSchema = createInsertSchema(quantumStates).omit({
  id: true,
  createdAt: true,
  lastVerification: true,
  watermark: true,
  dnaSignature: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProtectedContent = z.infer<typeof insertProtectedContentSchema>;
export type ProtectedContent = typeof protectedContent.$inferSelect;

export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type SecurityLog = typeof securityLogs.$inferSelect;

export type InsertAntiTheftToken = z.infer<typeof insertAntiTheftTokenSchema>;
export type AntiTheftToken = typeof antiTheftTokens.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

export type InsertTerminalCommand = z.infer<typeof insertTerminalCommandSchema>;
export type TerminalCommand = typeof terminalCommands.$inferSelect;

export type InsertIntegrityCheck = z.infer<typeof insertIntegrityCheckSchema>;
export type IntegrityCheck = typeof integrityChecks.$inferSelect;

export type InsertQuantumState = z.infer<typeof insertQuantumStateSchema>;
export type QuantumState = typeof quantumStates.$inferSelect;