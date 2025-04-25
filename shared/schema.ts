/**
 * !!! DNA PROTECTED SCHEMA - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - DATABASE SCHEMA
 * This file defines the database schema with DNA-based security
 * built in as one unified system.
 * 
 * FEATURES:
 * - Database schema with integrated DNA protection
 * - Secure type definitions for all entities
 * - Watermarking for all database records
 * - Built-in copyright protection
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import { integer, boolean, pgTable, text, timestamp, json, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { type InferSelectModel } from 'drizzle-orm';

// Import DNA security
import { IMMUTABLE_COPYRIGHT_OWNER } from './quantum-dna-security';

export type Json = Record<string, any>;

// Users table
export const users = pgTable('users', {
  id: integer('id').primaryKey().notNull(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  systemVersion: varchar('system_version', { length: 50 }).notNull(),
  securityLevel: varchar('security_level', { length: 50 }),
  isRoot: boolean('is_root'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
  accessToken: varchar('access_token', { length: 255 }),
  tokenExpiry: timestamp('token_expiry'),
  dnaSignature: varchar('dna_signature', { length: 512 }).notNull(),
  watermark: varchar('watermark', { length: 512 }).notNull(),
  copyrightOwner: varchar('copyright_owner', { length: 255 }).notNull().default(IMMUTABLE_COPYRIGHT_OWNER)
});

// Security logs table
export const securityLogs = pgTable('security_logs', {
  id: integer('id').primaryKey().notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  severity: varchar('severity', { length: 50 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  userId: integer('user_id').references(() => users.id),
  resourceId: varchar('resource_id', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: varchar('user_agent', { length: 255 }),
  details: json('details')
});

// Activity logs table
export const activityLogs = pgTable('activity_logs', {
  id: integer('id').primaryKey().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  watermark: varchar('watermark', { length: 512 }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  securityRelated: boolean('security_related')
});

// User settings table
export const userSettings = pgTable('user_settings', {
  id: integer('id').primaryKey().notNull(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  securityLevel: varchar('security_level', { length: 50 }),
  notifications: boolean('notifications'),
  theme: varchar('theme', { length: 50 }),
  dataCollection: boolean('data_collection'),
  cloudSync: boolean('cloud_sync'),
  antiTheftProtection: boolean('anti_theft_protection'),
  apiIntegrations: json('api_integrations'),
  dnaSecurityEnabled: boolean('dna_security_enabled')
});

// Terminal commands table
export const terminalCommands = pgTable('terminal_commands', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  command: text('command').notNull(),
  response: text('response').notNull(),
  securityLevel: varchar('security_level', { length: 50 }),
  watermark: varchar('watermark', { length: 512 }),
  timestamp: timestamp('timestamp').defaultNow().notNull()
});

// Integrity checks table
export const integrityChecks = pgTable('integrity_checks', {
  id: integer('id').primaryKey().notNull(),
  checkType: varchar('check_type', { length: 100 }).notNull(),
  result: boolean('result').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  details: json('details'),
  performedBy: integer('performed_by').references(() => users.id)
});

// Quantum systems table
export const quantumSystems = pgTable('quantum_systems', {
  id: integer('id').primaryKey().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  watermark: varchar('watermark', { length: 512 }).notNull(),
  dnaSignature: varchar('dna_signature', { length: 512 }).notNull(),
  lastVerification: timestamp('last_verification').defaultNow().notNull(),
  active: boolean('active'),
  qubits: integer('qubits').notNull(),
  entanglementQuality: integer('entanglement_quality').notNull(),
  securityStrength: varchar('security_strength', { length: 50 }).notNull()
});

// Protected content table
export const protectedContents = pgTable('protected_contents', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 100 }).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  watermark: varchar('watermark', { length: 512 }).notNull(),
  dnaSignature: varchar('dna_signature', { length: 512 }).notNull(),
  encryptionLevel: varchar('encryption_level', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastAccessed: timestamp('last_accessed'),
  accessCount: integer('access_count').default(0),
  copyrightOwner: varchar('copyright_owner', { length: 255 }).notNull().default(IMMUTABLE_COPYRIGHT_OWNER)
});

// Anti-theft tokens table
export const antiTheftTokens = pgTable('anti_theft_tokens', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  token: varchar('token', { length: 512 }).notNull(),
  resourceId: varchar('resource_id', { length: 255 }),
  userId: integer('user_id').references(() => users.id).notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  deviceFingerprint: varchar('device_fingerprint', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  lastUsed: timestamp('last_used'),
  isValid: boolean('is_valid').default(true)
});

// Conversations table
export const conversations = pgTable('conversations', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isArchived: boolean('is_archived').default(false),
  watermark: varchar('watermark', { length: 512 }),
  dnaSignature: varchar('dna_signature', { length: 512 }),
  securityLevel: varchar('security_level', { length: 50 }),
  metadata: json('metadata')
});

// Messages table
export const messages = pgTable('messages', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  conversationId: varchar('conversation_id', { length: 255 }).references(() => conversations.id).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  watermark: varchar('watermark', { length: 512 }),
  metadata: json('metadata')
});

// Infer types
export type User = InferSelectModel<typeof users>;
export type SecurityLog = InferSelectModel<typeof securityLogs>;
export type ActivityLog = InferSelectModel<typeof activityLogs>;
export type UserSettings = InferSelectModel<typeof userSettings>;
export type TerminalCommand = InferSelectModel<typeof terminalCommands>;
export type IntegrityCheck = InferSelectModel<typeof integrityChecks>;
export type QuantumSystem = InferSelectModel<typeof quantumSystems>;
export type ProtectedContent = InferSelectModel<typeof protectedContents>;
export type AntiTheftToken = InferSelectModel<typeof antiTheftTokens>;
export type Conversation = InferSelectModel<typeof conversations>;
export type Message = InferSelectModel<typeof messages>;

// Create insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertSecurityLogSchema = createInsertSchema(securityLogs);
export const insertActivityLogSchema = createInsertSchema(activityLogs);
export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const insertTerminalCommandSchema = createInsertSchema(terminalCommands);
export const insertIntegrityCheckSchema = createInsertSchema(integrityChecks);
export const insertQuantumSystemSchema = createInsertSchema(quantumSystems);
export const insertProtectedContentSchema = createInsertSchema(protectedContents);
export const insertAntiTheftTokenSchema = createInsertSchema(antiTheftTokens);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertMessageSchema = createInsertSchema(messages);

// Create insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type InsertTerminalCommand = z.infer<typeof insertTerminalCommandSchema>;
export type InsertIntegrityCheck = z.infer<typeof insertIntegrityCheckSchema>;
export type InsertQuantumSystem = z.infer<typeof insertQuantumSystemSchema>;
export type InsertProtectedContent = z.infer<typeof insertProtectedContentSchema>;
export type InsertAntiTheftToken = z.infer<typeof insertAntiTheftTokenSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;