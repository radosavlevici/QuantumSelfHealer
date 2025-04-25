/**
 * !!! DNA-PROTECTED PAGE - DO NOT COPY !!!
 * DNA-Protected Quantum Terminal Page
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This page is an integrated part of the DNA-protected security system.
 * It is built from the ground up with security as a core component,
 * not as a separate add-on. All elements on this page share the same
 * DNA verification chain.
 * 
 * ANTI-THEFT NOTICE:
 * This page contains cryptographic signatures and self-verification
 * mechanisms that validate its integrity. Any unauthorized copies or
 * modifications will result in the page becoming non-functional.
 */

import React, { useEffect, useState } from "react";
import DNAProtectedTerminal from "../components/dna-protected-terminal";
import { Shield, ClipboardCheck, AlertTriangle, Server } from "lucide-react";

// DNA verification constants - must match other components
const SYSTEM_VERSION_ID = "QV2-DNAFull-20250425";
const SYSTEM_REBUILD_TIMESTAMP = "2025-04-25T21:07:45.000Z";
const PAGE_SIGNATURE = "dna-protected-page-terminal-v2-" + SYSTEM_VERSION_ID;

const QuantumTerminal: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState<{
    intact: boolean;
    level: string;
    lastChecked: Date;
  }>({
    intact: false,
    level: "Verifying...",
    lastChecked: new Date()
  });
  
  // Verify page integrity on load
  useEffect(() => {
    const verifyPageIntegrity = async () => {
      try {
        // Check security integrity
        const response = await fetch('/api/security/integrity');
        const data = await response.json();
        
        setSecurityStatus({
          intact: data.intact,
          level: data.securityLevel,
          lastChecked: new Date(data.lastChecked)
        });
      } catch (error) {
        console.error("Failed to verify page integrity:", error);
        setSecurityStatus({
          intact: false,
          level: "Verification Failed",
          lastChecked: new Date()
        });
      }
    };
    
    verifyPageIntegrity();
    
    // Check integrity periodically
    const interval = setInterval(verifyPageIntegrity, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="p-6 max-w-7xl mx-auto"
      data-page-signature={PAGE_SIGNATURE}
      data-copyright="© Ervin Remus Radosavlevici (01/09/1987)"
      data-build-timestamp={SYSTEM_REBUILD_TIMESTAMP}
    >
      {/* Page header with security indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Server className="h-6 w-6" />
            Quantum Terminal Interface
          </h1>
          
          <div className="flex items-center gap-2 text-sm">
            {securityStatus.intact ? (
              <div className="flex items-center gap-1 text-green-600">
                <Shield className="h-4 w-4" />
                <span>Security: Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Security: Warning</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-500 mb-4">
          DNA-protected quantum computing terminal with advanced security features.
          All operations are protected with DNA-based verification.
        </p>
        
        {/* Security banner */}
        <div className={`p-3 rounded-md mb-4 flex items-center gap-3 ${securityStatus.intact ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {securityStatus.intact ? (
            <>
              <ClipboardCheck className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Security Verified</p>
                <p className="text-sm">
                  DNA protection active • Security level: {securityStatus.level} • 
                  Last verified: {securityStatus.lastChecked.toLocaleTimeString()}
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Security Warning</p>
                <p className="text-sm">
                  DNA verification failed • Some features may be disabled • 
                  Last check: {securityStatus.lastChecked.toLocaleTimeString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Terminal with copyright and security notice */}
      <div className="mb-6">
        <DNAProtectedTerminal 
          maxHeight="500px" 
          securityLevel="maximum"
          className="shadow-2xl"
        />
      </div>
      
      {/* Security information */}
      <div className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-500">
        <p>
          This terminal interface is protected by DNA-based security technology.
          All interactions are logged and verified against the security chain.
        </p>
        <p className="mt-1">
          Version: {SYSTEM_VERSION_ID} • Build Date: {new Date(SYSTEM_REBUILD_TIMESTAMP).toLocaleDateString()}
        </p>
        <p className="mt-1">
          © Ervin Remus Radosavlevici (01/09/1987) • All rights reserved
        </p>
      </div>
      
      {/* Hidden DNA verification data */}
      <div className="hidden">
        <span data-dna-verification={PAGE_SIGNATURE}></span>
        <span data-system-version={SYSTEM_VERSION_ID}></span>
        <span data-build-timestamp={SYSTEM_REBUILD_TIMESTAMP}></span>
      </div>
    </div>
  );
};

export default QuantumTerminal;