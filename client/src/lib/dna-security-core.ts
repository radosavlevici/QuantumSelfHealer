/**
 * Quantum AI Assistant
 * 
 * MIT License (Royalty-Free)
 * Copyright (c) 2025 Quantum AI Assistant Contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * ROYALTY-FREE PROVISION:
 * This software is provided completely royalty-free. No payment, fee, or royalty
 * of any kind is required for any use of this software, including commercial use, 
 * redistribution, or creation of derivative works.
 * 
 * CLIENT SECURITY CORE
 * This file implements client-side security functionality.
 * 
 * FEATURES:
 * - Client-side component protection
 * - Security monitoring and reporting
 * - Self-verification mechanisms
 * - License verification
 */

import {
  IMMUTABLE_COPYRIGHT_OWNER,
  IMMUTABLE_COPYRIGHT_BIRTHDATE,
  IMMUTABLE_COPYRIGHT_EMAIL,
  IMMUTABLE_COPYRIGHT_FULL,
  IMMUTABLE_SYSTEM_VERSION,
  generateSecurityWatermark,
  generateDNASignature,
  verifySecuritySystemIntegrity,
  validateDNASignature
} from '@shared/quantum-dna-security';

import {
  protectComponent,
  verifyComponentProtection,
  verifyProtectionSystemIntegrity
} from '@shared/quantum-dna-protection';

/**
 * Generate security data for a client component
 * @param componentId The component ID
 * @param componentType The component type
 */
export function generateComponentSecurity(componentId: string, componentType: string = 'component'): {
  dnaSignature: string;
  watermark: string;
} {
  return protectComponent(componentId, componentType);
}

/**
 * Verify a client component's security
 * @param componentId The component ID
 * @param componentType The component type 
 * @param dnaSignature The DNA signature to verify
 * @param watermark The watermark to verify
 */
export function verifyComponentSecurity(
  componentId: string,
  componentType: string,
  dnaSignature: string,
  watermark: string
): boolean {
  return verifyComponentProtection(componentId, componentType, dnaSignature, watermark);
}

/**
 * Apply protection to a client component
 * @param componentId The component ID
 * @param componentType The component type
 */
export function applyComponentProtection(componentId: string, componentType: string = 'component'): {
  dnaSignature: string;
  watermark: string;
} {
  return generateComponentSecurity(componentId, componentType);
}

/**
 * Verify client-side security system integrity
 */
export function verifyClientSecurity(): { valid: boolean; issues: string[] } {
  // First, verify the core security system
  const coreStatus = verifySecuritySystemIntegrity();
  
  // If core security is compromised, return that status
  if (!coreStatus.valid) {
    return coreStatus;
  }
  
  // Verify the protection system
  const protectionStatus = verifyProtectionSystemIntegrity();
  
  // If protection system is compromised, return that status
  if (!protectionStatus.valid) {
    return protectionStatus;
  }
  
  // Verify client-specific security
  const issues: string[] = [];
  
  try {
    // Test component security
    const testSecurity = generateComponentSecurity('test-client-component', 'test');
    
    if (!testSecurity.dnaSignature || testSecurity.dnaSignature.length < 10) {
      issues.push('Client component DNA signature generation is not functioning correctly');
    }
    
    if (!testSecurity.watermark || testSecurity.watermark.length < 10) {
      issues.push('Client component watermark generation is not functioning correctly');
    }
    
    // Test security verification
    const verified = verifyComponentSecurity(
      'test-client-component',
      'test',
      testSecurity.dnaSignature,
      testSecurity.watermark
    );
    
    if (!verified) {
      issues.push('Client component security verification is not functioning correctly');
    }
  } catch (error) {
    issues.push(`Client security system threw an error: ${error}`);
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Report a security violation
 * @param componentId The component ID
 * @param violationType The violation type
 * @param details Additional details
 */
export function reportSecurityViolation(
  componentId: string,
  violationType: string,
  details: object = {}
): void {
  // Log client-side security violation
  console.error(`[SECURITY VIOLATION] Component ${componentId}: ${violationType}`, details);
  
  // TODO: Send to server for logging when API endpoints are available
  // This would be implemented later in the app lifecycle
}

/**
 * Re-export the validateDNASignature function from the shared library
 * for components that import from this file
 */
export { validateDNASignature };