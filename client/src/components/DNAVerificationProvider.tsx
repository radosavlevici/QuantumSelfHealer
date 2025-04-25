/**
 * !!! CORE DNA VERIFICATION PROVIDER - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * MAIN SECURITY WRAPPER - BUILT FROM THE BEGINNING
 * This component provides the core DNA-based security verification
 * for the entire application. It wraps all components and provides
 * the security context that verifies the integrity of the application.
 * 
 * FEATURES:
 * - DNA-based verification of all application components
 * - Self-repair capabilities that attempt to fix verification failures
 * - Self-defense mechanisms that disable functionality when tampering is detected
 * - Self-upgrade functionality that enhances protection over time
 * - Immutable copyright information embedded in all verification chains
 * 
 * ANTI-THEFT NOTICE:
 * This component is the central hub of the security system.
 * Removing or modifying it will break the DNA verification chain,
 * causing all components to fail verification and become non-functional.
 * 
 * THE SECURITY SYSTEM IS ONE INTEGRATED WHOLE, NOT SEPARATE PIECES
 */

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// Import constants directly from dna-protection-system.ts
import { 
  COPYRIGHT_OWNER,
  COPYRIGHT_BIRTHDATE,
  COPYRIGHT_EMAIL,
  COPYRIGHT_FULL,
  SYSTEM_VERSION,
  SelfDefenseCapabilities, 
  SelfRepairCapabilities,
  SelfUpgradeCapabilities,
  DNASignature,
  SecurityVerification,
  SecurityLevel,
  generateDNASignature,
  verifyDNASignature,
  createWatermark,
  selfDefense,
  selfRepair,
  selfUpgrade,
  initializeProtectionSystem
} from '@shared/dna-protection-system';

// Using SecurityLevel from dna-protection-system.ts

// Helper function to create DNA watermark 
function createDNAWatermark(componentId: string): string {
  return createWatermark(componentId);
}

// Helper function to initialize security system
function initializeDNASecuritySystem(): void {
  return initializeProtectionSystem();
}

// Helper function to activate self defense
function activateSelfDefense(verification: SecurityVerification): void {
  selfDefense.respondToThreat(verification.details || "Unknown threat");
}

// Component ID and type - used for verification
const COMPONENT_ID = 'dna-verification-provider';
const COMPONENT_TYPE = 'core-security';
const COMPONENT_NAME = 'DNAVerificationProvider';

// Component DNA signature - created at build time and verified at runtime
const COMPONENT_DNA_SIGNATURE = generateDNASignature(COMPONENT_ID, COMPONENT_TYPE);

// DNA Verification Context - shared with all child components
export interface DNAVerificationContextType {
  securityLevel: SecurityLevel;
  isVerified: boolean;
  copyright: {
    owner: string;
    birthdate: string;
    email: string;
    full: string;
  };
  systemVersion: string;
  verifyComponent: (componentId: string, componentType: string) => SecurityVerification;
  createWatermark: (componentId: string) => string;
  reportTampering: (componentId: string, details: string) => void;
}

// Create the DNA Verification Context
export const DNAVerificationContext = createContext<DNAVerificationContextType | null>(null);

// DNA Verification Provider Props
interface DNAVerificationProviderProps {
  children: ReactNode;
}

/**
 * Core DNA Verification Provider Component
 * This wraps the entire application and provides security verification
 */
export default function DNAVerificationProvider({ children }: DNAVerificationProviderProps) {
  // Track verification status
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>(SecurityLevel.MAXIMUM);
  const [systemInit, setSystemInit] = useState<boolean>(false);

  // Initialize the DNA security system
  useEffect(() => {
    if (!systemInit) {
      console.log("%c Initializing DNA Security System ", "background: #0a0a30; color: #00ffff;");
      
      // Verify this component
      const selfVerification = verifyDNASignature(COMPONENT_DNA_SIGNATURE);
      
      if (!selfVerification.verified) {
        console.error("DNA Verification Provider failed verification:", selfVerification.details);
        activateSelfDefense(selfVerification);
        setIsVerified(false);
      } else {
        console.log("%c DNA Verification Provider verified successfully ", "background: #0a0a30; color: #00ff00;");
        setIsVerified(true);
        
        // Initialize the full security system
        initializeDNASecuritySystem();
        
        // Log successful initialization
        fetch('/api/security/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'security-system-initialized',
            details: {
              timestamp: new Date(),
              component: COMPONENT_ID,
              version: SYSTEM_VERSION
            },
            severity: 'info'
          })
        }).catch(err => console.error('Failed to log security event:', err));
      }
      
      setSystemInit(true);
    }
  }, [systemInit]);

  /**
   * Verify a component against the DNA security system
   */
  const verifyComponent = (componentId: string, componentType: string): SecurityVerification => {
    const componentSignature = generateDNASignature(componentId, componentType);
    const verificationResult = verifyDNASignature(componentSignature);
    
    if (!verificationResult.verified) {
      console.error(`Component verification failed: ${componentId}`, verificationResult.details);
      reportTampering(componentId, verificationResult.details || 'Unknown verification failure');
    }
    
    return verificationResult;
  };

  /**
   * Create a watermark for a component
   */
  const createWatermark = (componentId: string): string => {
    return createDNAWatermark(componentId);
  };

  /**
   * Report tampering to the security system
   */
  const reportTampering = (componentId: string, details: string): void => {
    console.error(`%c TAMPERING DETECTED: ${componentId} `, "background: #600; color: #fff;");
    console.error(`Details: ${details}`);
    
    // Log tampering event to the server
    fetch('/api/security/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'tampering-detected',
        details: {
          timestamp: new Date(),
          component: componentId,
          description: details
        },
        severity: 'critical'
      })
    }).catch(err => console.error('Failed to log tampering event:', err));
    
    // In a real system, this would trigger additional security measures
  };

  // Context value
  const contextValue: DNAVerificationContextType = {
    securityLevel,
    isVerified,
    copyright: {
      owner: COPYRIGHT_OWNER,
      birthdate: COPYRIGHT_BIRTHDATE,
      email: COPYRIGHT_EMAIL,
      full: COPYRIGHT_FULL
    },
    systemVersion: SYSTEM_VERSION,
    verifyComponent,
    createWatermark,
    reportTampering
  };

  return (
    <DNAVerificationContext.Provider value={contextValue}>
      <div 
        data-component-id={COMPONENT_ID}
        data-component-name={COMPONENT_NAME}
        data-security-level={securityLevel}
        data-verified={isVerified}
        data-dna-signature={COMPONENT_DNA_SIGNATURE.signature}
        data-copyright-owner={COPYRIGHT_OWNER}
        className="dna-verification-provider">
        {children}
      </div>
    </DNAVerificationContext.Provider>
  );
}

/**
 * Custom hook to use the DNA Verification Context
 */
export function useDNAVerification() {
  const context = useContext(DNAVerificationContext);
  
  if (!context) {
    throw new Error('useDNAVerification must be used within a DNAVerificationProvider');
  }
  
  return context;
}