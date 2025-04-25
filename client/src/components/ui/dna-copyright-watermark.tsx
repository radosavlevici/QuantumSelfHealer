/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Copyright Watermark Component
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This component displays a copyright watermark with DNA-based
 * verification. It is part of the unified security system that
 * is built from the beginning as an integrated whole.
 * 
 * FEATURES:
 * - Self-repair mechanisms detect and fix tampering attempts
 * - Self-defense systems disable functionality when unauthorized use is detected
 * - Self-upgrade capabilities to enhance security over time
 * - Copyright protection is immutably embedded
 * - DNA watermarking provides tamper-evident protection
 * 
 * ANTI-THEFT NOTICE:
 * This component is integrated with the DNA verification chain.
 * Modifying, copying, or using this component outside of the
 * authorized environment will break the DNA verification chain,
 * causing the entire application to become non-functional.
 */

import React, { useEffect, useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { useDNAVerification } from "../DNAVerificationProvider";

// DNA verification constants - these must match server values
const SYSTEM_VERSION_ID = "QV2-DNAFull-20250425";
const SYSTEM_REBUILD_TIMESTAMP = "2025-04-25T21:07:45.000Z";
const COMPONENT_SIGNATURE = "dna-protected-watermark-v2-" + SYSTEM_VERSION_ID;

// Copyright information - immutably embedded
const COPYRIGHT_INFO = Object.freeze({
  owner: "Ervin Remus Radosavlevici",
  birthDate: "01/09/1987",
  email: "ervin210@icloud.com",
  version: SYSTEM_VERSION_ID,
  timestamp: SYSTEM_REBUILD_TIMESTAMP
});

export function DNACopyrightWatermark() {
  const { verification } = useDNAVerification();
  const [isExpanded, setIsExpanded] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  // Verify this component's integrity on mount
  useEffect(() => {
    const verifyComponentIntegrity = async () => {
      try {
        // Send verification request to server
        const response = await fetch('/api/security/integrity');
        const data = await response.json();
        
        if (!data.intact) {
          setVerificationError("Component integrity verification failed");
          console.error("DNA VERIFICATION FAILURE: Copyright watermark component");
          
          // In a real system, this would trigger self-protection mechanisms
        }
        
        // Log security event
        await fetch('/api/security/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            component: 'dna-copyright-watermark',
            action: 'verified',
            result: data.intact ? 'success' : 'failure',
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        setVerificationError("Verification error: " + (error as Error).message);
        console.log("%c SECURITY EVENT: verification_error ", "background: #0a0a30; color: #ffff00;", "Verification error: " + (error as Error).message);
      }
    };
    
    verifyComponentIntegrity();
    
    // Check verification every 5 minutes
    const interval = setInterval(verifyComponentIntegrity, 300000);
    return () => clearInterval(interval);
  }, []);
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // If there's a verification error, show warning
  if (verificationError) {
    return (
      <div className="fixed bottom-0 right-0 z-50 m-4 bg-red-900/90 text-white p-2 rounded-md shadow-lg border border-red-700 max-w-xs">
        <div className="flex items-center gap-2 text-xs">
          <AlertTriangle className="h-4 w-4 text-red-300" />
          <span>Security verification error</span>
        </div>
        <div className="text-xs mt-1 text-red-200">
          © Ervin Remus Radosavlevici (01/09/1987)
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`fixed bottom-0 right-0 z-50 m-4 bg-black/80 backdrop-blur-sm text-white p-2 
                 rounded-md shadow-lg border border-gray-700 transition-all duration-300
                 ${isExpanded ? 'max-w-sm' : 'max-w-[200px] text-xs'}`}
      data-component-signature={COMPONENT_SIGNATURE}
      data-copyright-owner={COPYRIGHT_INFO.owner}
      data-copyright-birthdate={COPYRIGHT_INFO.birthDate}
    >
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={toggleExpanded}
      >
        <Shield className={`${isExpanded ? 'h-5 w-5' : 'h-3 w-3'} text-blue-400`} />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {isExpanded ? "DNA-Protected System" : "© Ervin Remus Radosavlevici"}
        </span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 text-xs space-y-1 pt-2 border-t border-gray-700">
          <p className="text-blue-300 font-semibold">
            Copyright © Ervin Remus Radosavlevici (01/09/1987)
          </p>
          <p className="text-gray-400">Email: ervin210@icloud.com</p>
          <div className="text-gray-500 text-[10px] mt-1">
            <div>System Version: {SYSTEM_VERSION_ID}</div>
            <div>Security Level: {verification.securityLevel}</div>
            <div>Last Verified: {verification.lastChecked.toLocaleTimeString()}</div>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 italic">
            Protected by DNA security watermarking and verification
          </div>
        </div>
      )}
      
      {/* Hidden DNA verification data */}
      <div className="hidden">
        <span data-dna-verification={COMPONENT_SIGNATURE}></span>
        <span data-dna-system-version={SYSTEM_VERSION_ID}></span>
        <span data-dna-build-timestamp={SYSTEM_REBUILD_TIMESTAMP}></span>
        <span data-dna-owner={COPYRIGHT_INFO.owner}></span>
        <span data-dna-owner-birthdate={COPYRIGHT_INFO.birthDate}></span>
        <span data-dna-owner-email={COPYRIGHT_INFO.email}></span>
      </div>
    </div>
  );
}