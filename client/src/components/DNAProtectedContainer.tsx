/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Container Component
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This component provides a secure container with DNA-based
 * protection for all content. It is part of the unified security
 * system that is built from the beginning as an integrated whole.
 * 
 * FEATURES:
 * - Self-repair mechanisms detect and fix tampering attempts
 * - Self-defense systems disable functionality when unauthorized use is detected
 * - Self-upgrade capabilities to enhance security over time
 * - Copyright protection immutably embedded in all components
 * - DNA watermarking provides tamper-evident protection
 * 
 * ANTI-THEFT NOTICE:
 * This component is integrated with the DNA verification chain.
 * Modifying, copying, or using this component outside of the 
 * authorized environment will break the DNA verification chain,
 * causing the entire application to become non-functional.
 */

import React, { useEffect, useState, ReactNode } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { 
  COPYRIGHT_OWNER, 
  COPYRIGHT_BIRTHDATE, 
  COPYRIGHT_EMAIL,
  SYSTEM_VERSION,
  generateDNASignature,
  verifyDNASignature,
  selfDefense,
  selfRepair
} from "@shared/dna-protection-system";

// Component-specific security constants
const COMPONENT_NAME = "dna-protected-container";
const COMPONENT_DNA_SIGNATURE = generateDNASignature(COMPONENT_NAME);

interface DNAProtectedContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  securityLevel?: "standard" | "enhanced" | "maximum";
  className?: string;
}

export default function DNAProtectedContainer({
  children,
  title,
  description,
  securityLevel = "enhanced",
  className = ""
}: DNAProtectedContainerProps) {
  const [integrityVerified, setIntegrityVerified] = useState<boolean | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  
  // Verify component integrity on mount
  useEffect(() => {
    const verifyComponentIntegrity = async () => {
      try {
        // Verify this component's signature
        const signatureValid = verifyDNASignature(COMPONENT_DNA_SIGNATURE);
        
        // Check for tampering
        const tamperingDetected = selfDefense.detectTampering();
        
        if (tamperingDetected) {
          setIntegrityVerified(false);
          setSecurityError("Tampering detected in container component");
          selfDefense.respondToThreat("container-component-tampering");
          setSecurityNotice("This component may have been compromised. Security measures activated.");
        } else if (!signatureValid) {
          setIntegrityVerified(false);
          setSecurityError("Invalid DNA signature");
          
          // Attempt self-repair
          const repaired = selfRepair.repairComponent(COMPONENT_NAME);
          if (repaired) {
            console.log(`%c DNA Security: Component ${COMPONENT_NAME} self-repaired successfully`, "background: #0a0a30; color: #00ffff;");
            setIntegrityVerified(true);
            setSecurityError(null);
            setSecurityNotice("Component self-repaired successfully");
          } else {
            setSecurityNotice("Self-repair failed - some functionality may be limited");
          }
        } else {
          setIntegrityVerified(true);
          setSecurityError(null);
        }
        
        // Log security event to server
        await fetch('/api/security/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            component: COMPONENT_NAME,
            action: 'integrity-verification',
            result: signatureValid ? 'success' : 'failure',
            securityLevel,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error("Container integrity verification error:", error);
        setIntegrityVerified(false);
        setSecurityError((error as Error).message);
      }
    };
    
    verifyComponentIntegrity();
  }, [securityLevel]);
  
  // If integrity verification failed, show a warning container
  if (integrityVerified === false) {
    return (
      <div className="border border-red-500 rounded-lg p-4 bg-red-950/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="text-red-300 font-medium">Security Warning</h3>
        </div>
        {securityError && (
          <p className="text-red-400 text-sm mb-2">{securityError}</p>
        )}
        <div className="text-xs text-red-300 mt-2">
          © {COPYRIGHT_OWNER} ({COPYRIGHT_BIRTHDATE})
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`rounded-lg border border-gray-800 bg-black/40 backdrop-blur-sm p-4 ${className}`}
      data-component-name={COMPONENT_NAME}
      data-dna-signature={COMPONENT_DNA_SIGNATURE.signature}
      data-security-level={securityLevel}
      data-copyright-owner={COPYRIGHT_OWNER}
    >
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <h3 className="font-semibold text-white">{title}</h3>
          </div>
          <div className="text-xs text-gray-500">
            {securityLevel.toUpperCase()}
          </div>
        </div>
      )}
      
      {description && (
        <p className="text-sm text-gray-400 mb-4">{description}</p>
      )}
      
      {securityNotice && (
        <div className="mb-3 p-2 bg-yellow-900/20 border border-yellow-800 rounded text-xs text-yellow-300">
          {securityNotice}
        </div>
      )}
      
      <div>{children}</div>
      
      <div className="mt-4 pt-2 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500">
        <div>
          DNA-Protected Component
        </div>
        <div>
          © {COPYRIGHT_OWNER}
        </div>
      </div>
      
      {/* Hidden DNA verification data */}
      <div className="hidden">
        <span data-dna-verification={COMPONENT_DNA_SIGNATURE.signature}></span>
        <span data-dna-owner={COPYRIGHT_OWNER}></span>
        <span data-dna-owner-birthdate={COPYRIGHT_BIRTHDATE}></span>
        <span data-dna-owner-email={COPYRIGHT_EMAIL}></span>
        <span data-dna-system-version={SYSTEM_VERSION}></span>
      </div>
    </div>
  );
}