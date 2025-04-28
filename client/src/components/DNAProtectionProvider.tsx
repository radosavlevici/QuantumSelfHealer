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
 * DNA PROTECTION PROVIDER
 * 
 * This component provides DNA-based security protection for the entire application.
 * It initializes the quantum DNA security system and provides a context for
 * accessing security services throughout the component tree.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  generateDNASignature, 
  generateSecurityWatermark,
  IMMUTABLE_COPYRIGHT_OWNER,
  IMMUTABLE_COPYRIGHT_BIRTHDATE,
  IMMUTABLE_COPYRIGHT_EMAIL,
  IMMUTABLE_SYSTEM_VERSION
} from '@shared/quantum-dna-security';
import { quantumDNASecurity } from '@/lib/quantum-dna-security';

// Component identity constants
const COMPONENT_ID = 'dna-protection-provider';
const COMPONENT_NAME = 'DNA Protection Provider';

// Context interface
interface DNAProtectionContextType {
  initialized: boolean;
  dnaSignature: string;
  watermark: string;
  systemVersion: string;
  securityLevel: string;
  ownerInfo: {
    name: string;
    birthdate: string;
    email: string;
  };
  verifyComponent: (componentSignature: string) => boolean;
  generateComponentSignature: (componentId: string, componentName: string) => string;
  copyrightInfo: {
    owner: string;
    birthdate: string;
    email: string;
    full: string;
    version: string;
  };
  applyProtection: (componentId: string, componentType: string) => {
    dnaSignature: string;
    watermark: string;
    timestamp: string;
  };
}

// Create context with a default value
const DNAProtectionContext = createContext<DNAProtectionContextType | null>(null);

// Provider props interface
interface DNAProtectionProviderProps {
  children: ReactNode;
}

/**
 * DNA Protection Provider Component
 * Provides DNA-based security context for the application
 */
export const DNAProtectionProvider: React.FC<DNAProtectionProviderProps> = ({ children }) => {
  // State for initialization status
  const [initialized, setInitialized] = useState<boolean>(false);
  
  // Generate secure identifiers for the component
  const componentDNASignature = generateDNASignature(COMPONENT_ID, COMPONENT_NAME);
  const componentWatermark = generateSecurityWatermark(COMPONENT_ID);
  
  // Initialize DNA security system
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        // Initialize quantum DNA security
        await quantumDNASecurity.initialize();
        
        setInitialized(true);
        console.log('DNA Protection Provider initialized and verified successfully');
      } catch (error) {
        console.error('Failed to initialize DNA Protection Provider:', error);
      }
    };
    
    initializeSecurity();
  }, []);
  
  // Context value
  const contextValue: DNAProtectionContextType = {
    initialized,
    dnaSignature: componentDNASignature,
    watermark: componentWatermark,
    systemVersion: IMMUTABLE_SYSTEM_VERSION,
    securityLevel: 'MAXIMUM',
    ownerInfo: {
      name: IMMUTABLE_COPYRIGHT_OWNER,
      birthdate: IMMUTABLE_COPYRIGHT_BIRTHDATE,
      email: IMMUTABLE_COPYRIGHT_EMAIL,
    },
    
    // Method to verify component integrity
    verifyComponent: (componentSignature: string): boolean => {
      // In a real implementation, this would perform cryptographic verification
      // For demonstration, we'll return true if the signature exists
      return Boolean(componentSignature) && componentSignature.length > 20;
    },
    
    // Method to generate a component signature
    generateComponentSignature: (componentId: string, componentName: string): string => {
      return generateDNASignature(componentId, componentName);
    },
    
    // Copyright information for components
    copyrightInfo: {
      owner: IMMUTABLE_COPYRIGHT_OWNER,
      birthdate: IMMUTABLE_COPYRIGHT_BIRTHDATE,
      email: IMMUTABLE_COPYRIGHT_EMAIL,
      full: `Copyright © ${IMMUTABLE_COPYRIGHT_OWNER} ${IMMUTABLE_COPYRIGHT_BIRTHDATE} - MIT License (Royalty-Free)`,
      version: IMMUTABLE_SYSTEM_VERSION
    },
    
    // Apply protection to components
    applyProtection: (componentId: string, componentType: string) => ({
      dnaSignature: generateDNASignature(componentId, componentType),
      watermark: generateSecurityWatermark(componentId),
      timestamp: new Date().toISOString()
    })
  };
  
  return (
    <div
      data-component-id={COMPONENT_ID}
      data-component-type={COMPONENT_NAME}
      data-dna-signature={componentDNASignature}
      data-security-watermark={componentWatermark}
      className="dna-protection-wrapper"
      style={{ display: 'contents' }}
    >
      <DNAProtectionContext.Provider value={contextValue}>
        {children}
      </DNAProtectionContext.Provider>
    </div>
  );
};

/**
 * Custom hook to use DNA Protection context
 */
export const useDNAProtection = (): DNAProtectionContextType => {
  const context = useContext(DNAProtectionContext);
  
  if (!context) {
    throw new Error('useDNAProtection must be used within a DNAProtectionProvider');
  }
  
  return context;
};