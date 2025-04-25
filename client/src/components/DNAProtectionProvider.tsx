/**
 * !!! DNA PROTECTION PROVIDER - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This is the core DNA protection provider that wraps the entire
 * application in a unified security system. All components
 * are protected through this provider which verifies integrity.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  SecurityLevel, 
  DNASignature, 
  DNAComponentMetadata,
  SecurityVerification,
  COPYRIGHT_OWNER,
  COPYRIGHT_BIRTHDATE,
  COPYRIGHT_EMAIL,
  COPYRIGHT_FULL,
  SYSTEM_VERSION,
  SYSTEM_BUILD_DATE,
  createDNAWatermark,
  generateDNASignature,
  verifyDNASignature,
  registerSecurityComponent,
  attemptSelfRepair,
  activateSelfDefense
} from '@/shared/quantum-dna-protection';

// Component identity for DNA verification
const COMPONENT_ID = 'dna-protection-provider';
const COMPONENT_TYPE = 'security-core';
const COMPONENT_NAME = 'DNAProtectionProvider';

// Protection context interface
interface DNAProtectionContextType {
  // Copyright information (immutable)
  copyright: {
    owner: string;
    birthdate: string;
    email: string;
    full: string;
  };
  
  // System information
  system: {
    version: string;
    buildDate: string;
    name: string;
  };
  
  // Component verification
  verifyComponent: (componentId: string, componentType: string) => SecurityVerification;
  registerComponent: (componentId: string, componentName: string, componentType: string) => void;
  
  // Watermarking
  createWatermark: (componentId: string) => string;
  
  // Security monitoring
  reportTampering: (componentId: string, details: string) => void;
  
  // Self-repair and defense
  selfRepair: {
    attemptRepair: (component: DNAComponentMetadata) => boolean;
    verifyDependencies: (component: DNAComponentMetadata) => boolean;
  };
  
  selfDefense: {
    respondToThreat: (details: string) => void;
    disableFunctionality: (component: string) => void;
  };
}

// Create the context with a default value
const DNAProtectionContext = createContext<DNAProtectionContextType | null>(null);

// Hook for components to use the DNA protection system
export const useDNAProtection = () => {
  const context = useContext(DNAProtectionContext);
  
  if (!context) {
    throw new Error('useDNAProtection must be used within a DNAProtectionProvider');
  }
  
  return context;
};

// Provider component
interface DNAProtectionProviderProps {
  children: ReactNode;
}

export default function DNAProtectionProvider({ children }: DNAProtectionProviderProps) {
  // Registered components
  const [components, setComponents] = useState<Record<string, DNAComponentMetadata>>({});
  
  // Initialize the provider
  useEffect(() => {
    console.log("%c DNA PROTECTION SYSTEM INITIALIZING ", "background: #001a33; color: #00ccff; font-weight: bold;");
    
    // Register this provider as a component
    const providerMetadata = registerSecurityComponent(
      COMPONENT_ID,
      COMPONENT_NAME,
      COMPONENT_TYPE,
      [],
      SecurityLevel.MAXIMUM
    );
    
    setComponents(prev => ({
      ...prev,
      [COMPONENT_ID]: providerMetadata
    }));
    
    // Add metadata to document
    document.documentElement.setAttribute('data-dna-protected', 'true');
    document.documentElement.setAttribute('data-copyright-owner', COPYRIGHT_OWNER);
    document.documentElement.setAttribute('data-copyright-birthdate', COPYRIGHT_BIRTHDATE);
    document.documentElement.setAttribute('data-security-version', SYSTEM_VERSION);
  }, []);
  
  // Verify a component
  const verifyComponent = (componentId: string, componentType: string): SecurityVerification => {
    const signature = generateDNASignature(componentId, componentType);
    return verifyDNASignature(signature);
  };
  
  // Register a component
  const registerComponent = (componentId: string, componentName: string, componentType: string) => {
    const metadata = registerSecurityComponent(
      componentId,
      componentName,
      componentType,
      [COMPONENT_ID], // Depend on this provider
      SecurityLevel.ENHANCED
    );
    
    setComponents(prev => ({
      ...prev,
      [componentId]: metadata
    }));
  };
  
  // Report tampering attempt
  const reportTampering = (componentId: string, details: string) => {
    console.error(`%c TAMPERING DETECTED: ${componentId} `, "background: #330000; color: #ff0000; font-weight: bold;");
    console.error(details);
    
    // Get the component if registered
    const component = components[componentId];
    
    if (component) {
      // Attempt self-repair
      const repaired = attemptSelfRepair(component);
      
      if (!repaired) {
        // Activate self-defense
        activateSelfDefense({
          valid: false,
          component: componentId,
          securityLevel: component.securityLevel,
          timestamp: new Date(),
          details
        });
      }
    } else {
      // Unknown component, treat as severe threat
      selfDefense.respondToThreat(`Unknown component reported tampering: ${componentId}`);
    }
  };
  
  // Self-repair mechanisms
  const selfRepair = {
    attemptRepair: (component: DNAComponentMetadata) => {
      console.log(`Attempting to repair component: ${component.id}`);
      return attemptSelfRepair(component);
    },
    
    verifyDependencies: (component: DNAComponentMetadata) => {
      // Check all dependencies are registered and valid
      for (const depId of component.dependencies) {
        if (!components[depId]) {
          console.error(`Dependency not found: ${depId}`);
          return false;
        }
      }
      
      return true;
    }
  };
  
  // Self-defense mechanisms
  const selfDefense = {
    respondToThreat: (details: string) => {
      console.error(`SECURITY THREAT: ${details}`);
      
      // In a real implementation, this would take more drastic measures
      document.documentElement.classList.add('security-compromised');
    },
    
    disableFunctionality: (component: string) => {
      console.error(`Disabling functionality for component: ${component}`);
      
      // In a real implementation, this would selectively disable features
      // For now, we'll just mark the component
      const elements = document.querySelectorAll(`[data-component-id="${component}"]`);
      elements.forEach(el => {
        el.setAttribute('data-security-disabled', 'true');
        (el as HTMLElement).style.opacity = '0.5';
      });
    }
  };
  
  // Context value
  const value: DNAProtectionContextType = {
    copyright: {
      owner: COPYRIGHT_OWNER,
      birthdate: COPYRIGHT_BIRTHDATE,
      email: COPYRIGHT_EMAIL,
      full: COPYRIGHT_FULL
    },
    
    system: {
      version: SYSTEM_VERSION,
      buildDate: SYSTEM_BUILD_DATE,
      name: "Quantum DNA Security"
    },
    
    verifyComponent,
    registerComponent,
    createWatermark,
    reportTampering,
    selfRepair,
    selfDefense
  };
  
  return (
    <DNAProtectionContext.Provider value={value}>
      {children}
    </DNAProtectionContext.Provider>
  );
}