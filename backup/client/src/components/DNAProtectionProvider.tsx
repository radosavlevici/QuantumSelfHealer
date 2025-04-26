/**
 * !!! DNA PROTECTED COMPONENT - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - PROTECTION PROVIDER
 * This component provides DNA-based security context to the application.
 * 
 * FEATURES:
 * - DNA-based watermarking for all components
 * - Security monitoring and defense mechanisms
 * - Copyright protection via context
 * - Self-repair integrity verification
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  IMMUTABLE_COPYRIGHT_OWNER, 
  IMMUTABLE_COPYRIGHT_BIRTHDATE, 
  IMMUTABLE_COPYRIGHT_EMAIL, 
  IMMUTABLE_COPYRIGHT_FULL,
  IMMUTABLE_SYSTEM_VERSION
} from '@shared/quantum-dna-security';
import { applyComponentProtection, verifyClientSecurity, reportSecurityViolation } from '../lib/dna-security-core';

// Define the context type
interface DNAProtectionContextType {
  copyrightInfo: {
    owner: string;
    birthdate: string;
    email: string;
    full: string;
    version: string;
  };
  applyProtection: (componentId: string, componentType?: string) => {
    dnaSignature: string;
    watermark: string;
  };
  verifyProtection: (componentId: string, componentType: string, dnaSignature: string, watermark: string) => boolean;
  reportViolation: (componentId: string, violationType: string, details?: object) => void;
}

// Create the context
const DNAProtectionContext = createContext<DNAProtectionContextType | null>(null);

// DNA Protection Provider component
export const DNAProtectionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Generate DNA protection for this component
  const providerProtection = applyComponentProtection('dna-protection-provider', 'context-provider');
  
  // Provider state for tracking security status
  const [securityStatus, setSecurityStatus] = useState<{
    valid: boolean;
    lastCheck: Date;
    issues: string[];
  }>({
    valid: true,
    lastCheck: new Date(),
    issues: []
  });
  
  // Verify security system on mount
  useEffect(() => {
    const status = verifyClientSecurity();
    setSecurityStatus({
      valid: status.valid,
      lastCheck: new Date(),
      issues: status.issues
    });
    
    // Set up periodic verification
    const interval = setInterval(() => {
      const status = verifyClientSecurity();
      setSecurityStatus({
        valid: status.valid,
        lastCheck: new Date(),
        issues: status.issues
      });
      
      // Report issues if any
      if (!status.valid) {
        reportSecurityViolation('security-system', 'integrity-check-failed', { issues: status.issues });
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Apply protection to a component
  const applyProtection = (componentId: string, componentType: string = 'component') => {
    return applyComponentProtection(componentId, componentType);
  };
  
  // Verify a component's protection
  const verifyProtection = (
    componentId: string, 
    componentType: string, 
    dnaSignature: string, 
    watermark: string
  ) => {
    // If security system itself is compromised, nothing is valid
    if (!securityStatus.valid) {
      reportSecurityViolation(componentId, 'security-system-compromised');
      return false;
    }
    
    try {
      // Generate expected protection (in a real system, we'd verify the passed values)
      const expected = applyComponentProtection(componentId, componentType);
      
      // In a real system, we would do more verification here
      // For now we'll do a simplified check for demo purposes
      if (!dnaSignature || dnaSignature.length < 10) {
        reportSecurityViolation(componentId, 'invalid-dna-signature');
        return false;
      }
      
      if (!watermark || watermark.length < 10) {
        reportSecurityViolation(componentId, 'invalid-watermark');
        return false;
      }
      
      // Check if owner info is in the DNA signature
      if (!dnaSignature.includes(IMMUTABLE_COPYRIGHT_OWNER.substring(0, 5))) {
        reportSecurityViolation(componentId, 'missing-copyright-info-in-signature');
        return false;
      }
      
      return true;
    } catch (error) {
      reportSecurityViolation(componentId, 'protection-verification-error', { error });
      return false;
    }
  };
  
  // Report a security violation
  const reportViolation = (componentId: string, violationType: string, details: object = {}) => {
    reportSecurityViolation(componentId, violationType, details);
  };
  
  // Create the context value
  const contextValue: DNAProtectionContextType = {
    copyrightInfo: {
      owner: IMMUTABLE_COPYRIGHT_OWNER,
      birthdate: IMMUTABLE_COPYRIGHT_BIRTHDATE,
      email: IMMUTABLE_COPYRIGHT_EMAIL,
      full: IMMUTABLE_COPYRIGHT_FULL,
      version: IMMUTABLE_SYSTEM_VERSION
    },
    applyProtection,
    verifyProtection,
    reportViolation
  };
  
  return (
    <DNAProtectionContext.Provider 
      value={contextValue}
      data-component-id="dna-protection-provider"
      data-component-type="context-provider"
      data-watermark={providerProtection.watermark}
      data-dna-signature={providerProtection.dnaSignature}
    >
      {/* Only render children if security system is valid */}
      {securityStatus.valid ? (
        children
      ) : (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Security System Compromised</h1>
            <p className="text-gray-300 mb-3">
              The DNA-based security system has detected tampering or unauthorized modification.
              This application has been secured to protect the intellectual property of its owner.
            </p>
            <div className="text-sm text-gray-400 mb-4">
              <p>{IMMUTABLE_COPYRIGHT_FULL}</p>
              <p>System Version: {IMMUTABLE_SYSTEM_VERSION}</p>
            </div>
            {securityStatus.issues.length > 0 && (
              <div className="text-sm bg-black/50 p-3 rounded border border-red-900">
                <p className="font-semibold text-red-400 mb-1">Security Issues:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  {securityStatus.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </DNAProtectionContext.Provider>
  );
};

// Custom hook to use the DNA Protection context
export const useDNAProtection = () => {
  const context = useContext(DNAProtectionContext);
  if (!context) {
    throw new Error('useDNAProtection must be used within a DNAProtectionProvider');
  }
  return context;
};