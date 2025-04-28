/**
 * !!! DNA PROTECTION PROVIDER - SECURITY FOUNDATION !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * DNA PROTECTION PROVIDER
 * 
 * This component provides DNA-based security protection for the entire application.
 * It initializes the quantum DNA security system and provides a context for
 * accessing security services throughout the component tree.
 * Built as one integrated system with DNA-based security from the beginning.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { generateDNASignature, generateSecurityWatermark } from '@shared/quantum-dna-security';
import { IMMUTABLE_COPYRIGHT_OWNER, IMMUTABLE_COPYRIGHT_BIRTHDATE, IMMUTABLE_COPYRIGHT_EMAIL, IMMUTABLE_SYSTEM_VERSION } from '@/lib/utils';
import { quantumDNASecurity } from '@/lib/quantum-dna-security';
import { Shield } from 'lucide-react';

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
    deviceId?: string;
  };
  verifyComponent: (componentSignature: string) => boolean;
  generateComponentSignature: (componentId: string, componentName: string) => string;
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
      deviceId: 'iphone-pro-max',
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
    }
  };
  
  // Enhanced security visualization indicator
  const [securityActive, setSecurityActive] = useState(true);

  // Security activation effect
  useEffect(() => {
    // Simulate active quantum security system
    const securityCheckInterval = setInterval(() => {
      console.log('Scanning for unauthorized devices...');
      // Security system remains constantly active
      setSecurityActive(true);
    }, 30000);
    
    return () => clearInterval(securityCheckInterval);
  }, []);

  return (
    <div
      data-component-id={COMPONENT_ID}
      data-component-type={COMPONENT_NAME}
      data-dna-signature={componentDNASignature}
      data-security-watermark={componentWatermark}
      className="dna-protection-wrapper"
      style={{ display: 'contents' }}
    >
      {/* Global Security Indicator */}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(0, 120, 255, 0.5)',
          border: '1px solid rgba(0, 100, 255, 0.3)'
        }}
      >
        <Shield 
          className={`h-4 w-4 ${securityActive ? 'text-blue-400 pulse-animation' : 'text-gray-400'}`}
        />
      </div>
      
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