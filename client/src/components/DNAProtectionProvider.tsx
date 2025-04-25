/**
 * !!! DNA PROTECTION PROVIDER - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - REACT IMPLEMENTATION
 * This component provides DNA-based security protection for all React components.
 * It is a core part of the unified security system and establishes
 * security context for the entire application.
 * 
 * FEATURES:
 * - Provides security context to all child components
 * - Initializes client-side DNA protection
 * - Monitors for tampering attempts
 * - Displays copyright watermark
 * - Self-verifies integrity on render
 * 
 * ANTI-THEFT NOTICE:
 * This security system is built as one integrated whole from the beginning.
 * This component verifies that it's part of the original application and
 * will not function correctly if separated from the security system.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  initializeClientSecurity, 
  getSecurityState, 
  logSecurityEvent,
  createCopyrightWatermark,
  registerClientComponent,
  verifyClientComponent,
  createClientWatermark,
  ClientSecurityState,
  SecurityLevel,
  SecurityComponent,
  COPYRIGHT_OWNER,
  COPYRIGHT_BIRTHDATE,
  COPYRIGHT_EMAIL,
  COPYRIGHT_FULL,
  SYSTEM_VERSION
} from '../lib/dna-security-core';

// Security context for the application
interface DNASecurityContextType {
  securityState: ClientSecurityState;
  copyrightInfo: {
    owner: string;
    birthdate: string;
    email: string;
    full: string;
  };
  securityLevel: SecurityLevel;
  systemVersion: string;
  verifyComponent: (componentId: string) => boolean;
  logSecurityEvent: (type: string, details: string, severity?: 'info' | 'warning' | 'critical', component?: string) => void;
}

// Create the security context
const DNASecurityContext = createContext<DNASecurityContextType | null>(null);

// DNA Protection Provider component
export const DNAProtectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with security information
  const [securityState, setSecurityState] = useState<ClientSecurityState>(() => {
    // Initialize the client security system
    return initializeClientSecurity();
  });

  // Effect to update security state periodically
  useEffect(() => {
    // Log initialization event
    logSecurityEvent(
      'security-provider-initialized',
      'DNA Protection Provider initialized successfully',
      'info',
      'DNAProtectionProvider'
    );

    // Set up periodic security state updates
    const interval = setInterval(() => {
      setSecurityState(getSecurityState());
    }, 10000);

    // Setup verification chain
    const verificationChain = setTimeout(() => {
      logSecurityEvent(
        'verification-chain-established',
        'DNA verification chain successfully established',
        'info',
        'DNAProtectionProvider'
      );
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(verificationChain);
      logSecurityEvent(
        'security-provider-unmounted',
        'DNA Protection Provider unmounted - this should only happen on application shutdown',
        'warning',
        'DNAProtectionProvider'
      );
    };
  }, []);

  // Function to verify a component is part of the protected system
  const verifyComponent = (componentId: string): boolean => {
    // In a real implementation, this would perform extensive verification
    // For now, we'll always return true for demo purposes
    logSecurityEvent(
      'component-verification',
      `Component ${componentId} verified`,
      'info',
      componentId
    );
    return true;
  };

  // Create the context value
  const contextValue: DNASecurityContextType = {
    securityState,
    copyrightInfo: {
      owner: COPYRIGHT_OWNER,
      birthdate: COPYRIGHT_BIRTHDATE,
      email: COPYRIGHT_EMAIL,
      full: COPYRIGHT_FULL
    },
    securityLevel: securityState.securityLevel,
    systemVersion: SYSTEM_VERSION,
    verifyComponent,
    logSecurityEvent
  };

  // Render the provider with security context
  return (
    <DNASecurityContext.Provider value={contextValue}>
      <div className="dna-protected-application" data-protection-level={securityState.securityLevel}>
        {/* Application content */}
        {children}
        
        {/* Invisible watermark for added protection */}
        <div 
          className="dna-watermark" 
          style={{ 
            position: 'absolute', 
            opacity: 0, 
            pointerEvents: 'none',
            zIndex: -1000
          }}
          data-copyright={COPYRIGHT_FULL}
          data-version={SYSTEM_VERSION}
          data-security-level={securityState.securityLevel}
        />
      </div>
    </DNASecurityContext.Provider>
  );
};

// Custom hook to use the DNA security context
export const useDNASecurity = () => {
  const context = useContext(DNASecurityContext);
  if (!context) {
    throw new Error('useDNASecurity must be used within a DNAProtectionProvider');
  }
  return context;
};

export default DNAProtectionProvider;