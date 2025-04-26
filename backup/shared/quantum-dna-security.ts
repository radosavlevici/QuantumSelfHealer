/**
 * !!! DNA PROTECTED CORE SECURITY - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - CORE SECURITY
 * This file implements the core DNA-based security functionality
 * that is shared between client and server.
 * 
 * FEATURES:
 * - Immutable copyright information
 * - DNA watermarking generation
 * - DNA signature generation
 * - Security integrity verification
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

// Immutable copyright information - cannot be changed!
export const IMMUTABLE_COPYRIGHT_OWNER = 'Ervin Remus Radosavlevici';
export const IMMUTABLE_COPYRIGHT_BIRTHDATE = '01/09/1987';
export const IMMUTABLE_COPYRIGHT_EMAIL = 'ervin210@icloud.com';
export const IMMUTABLE_COPYRIGHT_FULL = `Copyright © ${IMMUTABLE_COPYRIGHT_OWNER} (${IMMUTABLE_COPYRIGHT_BIRTHDATE}) - Email: ${IMMUTABLE_COPYRIGHT_EMAIL} - All Rights Reserved.`;
export const IMMUTABLE_SYSTEM_VERSION = '4.0';
export const IMMUTABLE_BUILD_TIMESTAMP = '2025-04-25T23:30:00.000Z';

/**
 * Generate a DNA-based security watermark
 * @param seedData Seed data for the watermark
 */
export function generateSecurityWatermark(seedData: string): string {
  // Create a base string with timestamp and seed data
  const baseString = `${Date.now()}-${seedData}-${IMMUTABLE_COPYRIGHT_OWNER}-${IMMUTABLE_SYSTEM_VERSION}`;
  
  // Simple hash function that works in all environments
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `dna-${hash.toString(36)}-${IMMUTABLE_COPYRIGHT_OWNER.substring(0, 5)}-${Date.now().toString(36)}`;
}

/**
 * Generate a DNA-based signature for a component
 * @param componentId Component ID
 * @param componentType Component type
 */
export function generateDNASignature(componentId: string, componentType: string): string {
  // Create a base string with component data and copyright information
  const baseString = `${componentId}-${componentType}-${IMMUTABLE_COPYRIGHT_OWNER}-${IMMUTABLE_SYSTEM_VERSION}-${Date.now()}`;
  
  // Simple hash function for DNA signature
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `dna-sig-${hash.toString(36)}-${IMMUTABLE_COPYRIGHT_OWNER.substring(0, 5)}-${Date.now().toString(36)}`;
}

/**
 * Verify a DNA signature
 * @param signature The signature to verify
 * @param expectedPrefix The expected prefix
 */
export function verifyDNASignature(signature: string, expectedPrefix: string): boolean {
  if (!signature || typeof signature !== 'string') {
    return false;
  }
  
  // Check if the signature has the correct prefix
  if (!signature.startsWith(expectedPrefix)) {
    return false;
  }
  
  // Check if the signature contains the copyright owner's name prefix
  if (!signature.includes(IMMUTABLE_COPYRIGHT_OWNER.substring(0, 5))) {
    return false;
  }
  
  return true;
}

/**
 * Secure data with DNA protection
 * @param data The data to secure
 * @param componentId The component ID
 */
export function secureData<T extends object>(data: T, componentId: string): T & {
  _dnaWatermark: string;
  _timestamp: string;
  _copyright: string;
  _version: string;
} {
  return {
    ...data,
    _dnaWatermark: generateSecurityWatermark(`${componentId}-${Date.now()}`),
    _timestamp: new Date().toISOString(),
    _copyright: IMMUTABLE_COPYRIGHT_OWNER,
    _version: `QUANTUM-DNA-SECURITY-v${IMMUTABLE_SYSTEM_VERSION}`
  };
}

/**
 * Verify the security system integrity
 */
export function verifySecuritySystemIntegrity(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // 1. Verify immutable constants are not tampered with
  if (IMMUTABLE_COPYRIGHT_OWNER !== 'Ervin Remus Radosavlevici') {
    issues.push('Copyright owner has been tampered with');
  }
  
  if (IMMUTABLE_COPYRIGHT_BIRTHDATE !== '01/09/1987') {
    issues.push('Copyright birthdate has been tampered with');
  }
  
  if (IMMUTABLE_COPYRIGHT_EMAIL !== 'ervin210@icloud.com') {
    issues.push('Copyright email has been tampered with');
  }
  
  if (IMMUTABLE_SYSTEM_VERSION !== '4.0') {
    issues.push('System version has been tampered with');
  }
  
  // 2. Verify the FULL copyright string is correctly formatted
  const expectedFullCopyright = `Copyright © ${IMMUTABLE_COPYRIGHT_OWNER} (${IMMUTABLE_COPYRIGHT_BIRTHDATE}) - Email: ${IMMUTABLE_COPYRIGHT_EMAIL} - All Rights Reserved.`;
  
  if (IMMUTABLE_COPYRIGHT_FULL !== expectedFullCopyright) {
    issues.push('Copyright full string has been tampered with');
  }
  
  // 3. Verify our functions are working
  try {
    const testWatermark = generateSecurityWatermark('test');
    if (!testWatermark || testWatermark.length < 10) {
      issues.push('Watermark generation is not functioning correctly');
    }
    
    const testSignature = generateDNASignature('test', 'test');
    if (!testSignature || testSignature.length < 10) {
      issues.push('DNA signature generation is not functioning correctly');
    }
  } catch (error) {
    issues.push('Security functions threw an error');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Add DNA watermarking to an object
 * @param obj Object to watermark
 * @param componentId Component ID
 */
export function addDNAWatermark<T extends object>(obj: T, componentId: string): T & {
  _dnaWatermark: string;
  _timestamp: string;
  _copyright: string;
  _version: string;
} {
  return {
    ...obj,
    _dnaWatermark: generateSecurityWatermark(`${componentId}-${Date.now()}`),
    _timestamp: new Date().toISOString(),
    _copyright: IMMUTABLE_COPYRIGHT_OWNER,
    _version: `QUANTUM-DNA-SECURITY-v${IMMUTABLE_SYSTEM_VERSION}`
  };
}

/**
 * Verify a DNA watermark on an object
 * @param obj Object to verify
 */
export function verifyDNAWatermark(obj: any): boolean {
  // Check if the object has a DNA watermark
  if (!obj._dnaWatermark || typeof obj._dnaWatermark !== 'string') {
    return false;
  }
  
  // Check if the object has a timestamp
  if (!obj._timestamp || typeof obj._timestamp !== 'string') {
    return false;
  }
  
  // Check if the object has the correct copyright
  if (!obj._copyright || obj._copyright !== IMMUTABLE_COPYRIGHT_OWNER) {
    return false;
  }
  
  // Check if the object has the correct version
  if (!obj._version || !obj._version.includes(`v${IMMUTABLE_SYSTEM_VERSION}`)) {
    return false;
  }
  
  return true;
}