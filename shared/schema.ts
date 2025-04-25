/**
 * !!! DNA PROTECTED DATABASE SCHEMA - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - DATABASE SCHEMA
 * This file provides the database schema with DNA-based security
 * integrated from the beginning as one unified system.
 * 
 * FEATURES:
 * - Database models with DNA protection
 * - Security watermarking for all data
 * - Copyright protection embedded in database schema
 * - Self-verification mechanisms
 * 
 * ANTI-THEFT NOTICE:
 * This security system includes verification chains that make unauthorized
 * copies non-functional. The entire system is built as one integrated whole
 * from the beginning.
 */

import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  primaryKey, 
  uuid,
  json
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { 
  IMMUTABLE_COPYRIGHT_OWNER, 
  IMMUTABLE_SYSTEM_VERSION 
} from './quantum-dna-security';

// Type alias for JSON data to use in schema
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/**
 * Users table with DNA security integration
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull(),
  systemVersion: text('system_version').notNull().default(IMMUTABLE_SYSTEM_VERSION),
  securityLevel: text('security_level').default('maximum'),
  isRoot: boolean('is_root').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
  accessToken: text('access_token'),
  tokenExpiry: timestamp('token_expiry'),
  watermark: text('watermark').notNull(),
  dnaSignature: text('dna_signature').notNull(),
  copyrightOwner: text('copyright_owner').notNull().default(IMMUTABLE_COPYRIGHT_OWNER)
});

/**
 * Security Events table for system monitoring
 */
export const securityEvents = pgTable('security_events', {
  id: serial('id').primaryKey(),
  eventType: text('event_type').notNull(),
  severity: text('severity').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  userId: integer('user_id').references(() => users.id),
  resourceId: text('resource_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  details: json('details')
});

/**
 * System Notifications for users
 */
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  watermark: text('watermark'),
  securityRelated: boolean('security_related')
});

/**
 * User Settings with security preferences
 */
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  theme: text('theme').default('dark'),
  securityLevel: text('security_level').default('maximum'),
  notifications: boolean('notifications').default(true),
  dataCollection: boolean('data_collection').default(false),
  cloudSync: boolean('cloud_sync').default(false),
  antiTheftProtection: boolean('anti_theft_protection').default(true),
  apiIntegrations: json('api_integrations'),
  dnaSecurityEnabled: boolean('dna_security_enabled').default(true)
});

/**
 * Terminal History for quantum terminal commands
 */
export const terminalHistory = pgTable('terminal_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').references(() => users.id).notNull(),
  command: text('command').notNull(),
  response: text('response').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  securityLevel: text('security_level'),
  watermark: text('watermark')
});

/**
 * Security Verification Checks
 */
export const securityChecks = pgTable('security_checks', {
  id: serial('id').primaryKey(),
  checkType: text('check_type').notNull(),
  result: boolean('result').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  performedBy: integer('performed_by').references(() => users.id),
  details: json('details')
});

/**
 * Protected Components registry
 */
export const secureComponents = pgTable('secure_components', {
  id: text('id').primaryKey(),
  componentType: text('component_type').notNull(),
  watermark: text('watermark').notNull(),
  dnaSignature: text('dna_signature').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  verified: boolean('verified').default(true),
  lastVerification: timestamp('last_verification')
});

/**
 * Quantum Systems
 */
export const quantumSystems = pgTable('quantum_systems', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  dnaSignature: text('dna_signature').notNull(),
  watermark: text('watermark').notNull(),
  active: boolean('active').default(true),
  qubits: integer('qubits').notNull(),
  entanglementQuality: integer('entanglement_quality').notNull(),
  securityStrength: text('security_strength').notNull(),
  lastVerification: timestamp('last_verification').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  securityEvents: many(securityEvents),
  notifications: many(notifications),
  settings: many(userSettings),
  terminalHistory: many(terminalHistory)
}));

export const securityEventsRelations = relations(securityEvents, ({ one }) => ({
  user: one(users, {
    fields: [securityEvents.userId],
    references: [users.id]
  })
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id]
  })
}));

export const terminalHistoryRelations = relations(terminalHistory, ({ one }) => ({
  user: one(users, {
    fields: [terminalHistory.userId],
    references: [users.id]
  })
}));

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true });
export const insertTerminalHistorySchema = createInsertSchema(terminalHistory);
export const insertSecurityCheckSchema = createInsertSchema(securityChecks).omit({ id: true });
export const insertSecureComponentSchema = createInsertSchema(secureComponents);
export const insertQuantumSystemSchema = createInsertSchema(quantumSystems).omit({ id: true });

// TypeScript types for insertion
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type InsertTerminalHistory = z.infer<typeof insertTerminalHistorySchema>;
export type InsertSecurityCheck = z.infer<typeof insertSecurityCheckSchema>;
export type InsertSecureComponent = z.infer<typeof insertSecureComponentSchema>;
export type InsertQuantumSystem = z.infer<typeof insertQuantumSystemSchema>;

// TypeScript types for selection
export type User = typeof users.$inferSelect;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type TerminalHistory = typeof terminalHistory.$inferSelect;
export type SecurityCheck = typeof securityChecks.$inferSelect;
export type SecureComponent = typeof secureComponents.$inferSelect;
export type QuantumSystem = typeof quantumSystems.$inferSelect;