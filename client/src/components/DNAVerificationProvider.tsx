/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA Verification Provider - Unified Security Build
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This component is the central hub of the DNA-based security system.
 * It wraps the entire application and provides DNA verification,
 * tamper detection, and self-repair capabilities.
 * 
 * ANTI-THEFT NOTICE:
 * This component contains critical security mechanisms and is part of
 * a unified system built together from the beginning - not as separate
 * components added later. All security features work together as one
 * system that will disable unauthorized copies.
 */

import { useState, useEffect, createContext, ReactNode, useContext } from "react";
import { securitySystem, SecurityVerification } from "@/lib/dna-security-core";
import { useToast } from "@/hooks/use-toast";

// DNA verification context
interface DNAVerificationContextType {
  isVerified: boolean;
  securityLevel: string;
  lastChecked: Date | null;
  performVerification: () => Promise<void>;
}

// Create the context
const DNAVerificationContext = createContext<DNAVerificationContextType>({
  isVerified: false,
  securityLevel: "Initializing...",
  lastChecked: null,
  performVerification: async () => {}
});

// Provider props
interface DNAVerificationProviderProps {
  children: ReactNode;
}

// The provider component
export default function DNAVerificationProvider({ children }: DNAVerificationProviderProps) {
  const [verificationState, setVerificationState] = useState<{
    isVerified: boolean;
    securityLevel: string;
    lastChecked: Date | null;
  }>({
    isVerified: false,
    securityLevel: "Initializing...",
    lastChecked: null
  });
  
  const { toast } = useToast();
  
  // Perform verification on mount and periodically
  useEffect(() => {
    // Initial verification
    performVerification();
    
    // Set up periodic verification
    const interval = setInterval(performVerification, 300000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  // Perform a verification check
  const performVerification = async () => {
    try {
      const result = await securitySystem.performVerification();
      
      setVerificationState({
        isVerified: result.verified,
        securityLevel: result.securityLevel,
        lastChecked: result.lastChecked
      });
      
      if (!result.verified) {
        toast({
          title: "Security Warning",
          description: "DNA verification failed. Security system attempting self-repair.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("DNA verification error:", error);
      
      setVerificationState({
        isVerified: false,
        securityLevel: "Error",
        lastChecked: new Date()
      });
      
      toast({
        title: "Security Error",
        description: "DNA verification system encountered an error.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DNAVerificationContext.Provider 
      value={{
        ...verificationState,
        performVerification
      }}
    >
      <div
        data-dna-verified={verificationState.isVerified ? "true" : "false"}
        data-security-level={verificationState.securityLevel}
        data-last-checked={verificationState.lastChecked?.toISOString() || ""}
        data-copyright="© Ervin Remus Radosavlevici (01/09/1987)"
        className="min-h-screen"
      >
        {children}
      </div>
    </DNAVerificationContext.Provider>
  );
}

// Hook to use the DNA verification context
export function useDNAVerification() {
  const context = useContext(DNAVerificationContext);
  
  if (context === undefined) {
    throw new Error("useDNAVerification must be used within a DNAVerificationProvider");
  }
  
  return context;
}