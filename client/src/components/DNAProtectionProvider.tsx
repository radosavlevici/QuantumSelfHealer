/**
 * !!! DNA PROTECTION PROVIDER - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This core security provider wraps the entire application with
 * DNA-based protection with self-repair, self-defense, and
 * self-upgrade capabilities built in from the beginning as one
 * unified system across all components.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  COPYRIGHT, 
  SYSTEM, 
  SecurityLevel, 
  SecurityValidation,
  ComponentMetadata,
  DNASignature,
  generateSignature,
  verifySignature,
  generateWatermark,
  registerComponent,
  selfRepair,
  selfDefense,
  selfUpgrade,
  initializeProtection
} from '@shared/quantum-dna-protection';

// Component identity for DNA verification
const COMPONENT_ID = 'dna-protection-provider';
const COMPONENT_TYPE = 'security-core';
const COMPONENT_NAME = 'DNAProtectionProvider';

// Create component signature at build time
const COMPONENT_SIGNATURE = generateSignature(COMPONENT_ID, COMPONENT_TYPE);

// Core security context interface with all protection functions
export interface DNAProtectionContext {
  isVerified: boolean;
  copyright: {
    owner: string;
    birthdate: string;
    email: string;
    full: string;
  };
  system: {
    name: string;
    version: string;
    buildDate: string;
  };
  securityLevel: SecurityLevel;
  verifyComponent: (id: string, type: string) => SecurityValidation;
  createWatermark: (id: string) => string;
  reportTampering: (id: string, details: string) => void;
  registerComponent: (id: string, name: string, type: string) => ComponentMetadata;
}

// Create the protection context
export const DNAProtectionContext = createContext<DNAProtectionContext | null>(null);

// Provider props
interface DNAProtectionProviderProps {
  children: ReactNode;
}

/**
 * DNA Protection Provider - Core Security Component
 * This wraps the entire application with DNA-based security
 */
export default function DNAProtectionProvider({ children }: DNAProtectionProviderProps) {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>(SecurityLevel.MAXIMUM);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Initialize the DNA protection system and verify this component
  useEffect(() => {
    if (!initialized) {
      console.log("%c Initializing DNA Protection System ", "background: #001a33; color: #00ccff; font-weight: bold;");
      
      // Verify this component's signature
      const verification = verifySignature(COMPONENT_SIGNATURE);
      
      if (!verification.valid) {
        console.error("DNA Protection Provider failed verification:", verification.details);
        selfDefense.protect(COMPONENT_ID, verification.details || "Verification failed");
        setIsVerified(false);
      } else {
        console.log("%c DNA Protection Provider verified successfully ", "background: #001a33; color: #00ff99;");
        setIsVerified(true);
        
        // Initialize the full protection system
        initializeProtection();
      }
      
      setInitialized(true);
    }
  }, [initialized]);

  // Define core security functions
  
  /**
   * Verify a component against the DNA protection system
   */
  const verifyComponent = (id: string, type: string): SecurityValidation => {
    const signature = generateSignature(id, type);
    const result = verifySignature(signature);
    
    if (!result.valid) {
      console.error(`Component verification failed: ${id}`, result.details);
      reportTampering(id, result.details || 'Unknown verification failure');
    }
    
    return result;
  };

  /**
   * Create a watermark for a component
   */
  const createWatermark = (id: string): string => {
    const signature = generateSignature(id, "component");
    return generateWatermark(id, signature.sequence);
  };

  /**
   * Report tampering to the security system
   */
  const reportTampering = (id: string, details: string): void => {
    console.error(`%c TAMPERING DETECTED: ${id} `, "background: #990000; color: #ffffff; font-weight: bold;");
    console.error(`Details: ${details}`);
    
    // Activate self-defense mechanisms
    selfDefense.protect(id, details);
    
    // In a real system, this would report to a security server
  };
  
  /**
   * Register a new component with the protection system
   */
  const registerNewComponent = (id: string, name: string, type: string): ComponentMetadata => {
    return registerComponent(id, name, type, securityLevel);
  };

  // Context value with all security functions
  const contextValue: DNAProtectionContext = {
    isVerified,
    copyright: {
      owner: COPYRIGHT.OWNER,
      birthdate: COPYRIGHT.BIRTHDATE,
      email: COPYRIGHT.EMAIL,
      full: COPYRIGHT.FULL
    },
    system: {
      name: SYSTEM.NAME,
      version: SYSTEM.VERSION,
      buildDate: SYSTEM.BUILD_DATE
    },
    securityLevel,
    verifyComponent,
    createWatermark,
    reportTampering,
    registerComponent: registerNewComponent
  };

  return (
    <DNAProtectionContext.Provider value={contextValue}>
      <div 
        className="dna-protection-provider" 
        data-component-id={COMPONENT_ID}
        data-component-name={COMPONENT_NAME}
        data-security-level={securityLevel}
        data-verified={isVerified}
        data-copyright-owner={COPYRIGHT.OWNER}
        data-signature={COMPONENT_SIGNATURE.sequence}
        data-watermark={COMPONENT_SIGNATURE.watermark}
      >
        {children}
      </div>
    </DNAProtectionContext.Provider>
  );
}

/**
 * Hook to use the DNA Protection Context
 */
export function useDNAProtection() {
  const context = useContext(DNAProtectionContext);
  
  if (!context) {
    throw new Error('useDNAProtection must be used within a DNAProtectionProvider');
  }
  
  return context;
}