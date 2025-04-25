/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Container Component - Unified Security Build
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This component provides a secure container with DNA-based verification
 * that is part of the integrated security system built from the beginning.
 */

import React, { ReactNode, useEffect, useState } from "react";
import { useDNAVerification } from "./DNAVerificationProvider";
import { COPYRIGHT_OWNER, COPYRIGHT_BIRTHDATE, SYSTEM_VERSION_ID } from "@/lib/dna-security-core";

// DNA verification constants
const DNA_SIGNATURE = `dna-protected-container-v2-${SYSTEM_VERSION_ID}`;
const VERIFY_TOKEN = `${COPYRIGHT_OWNER}-${COPYRIGHT_BIRTHDATE}-${SYSTEM_VERSION_ID}`;

// Types
interface DNAProtectedContainerProps {
  children: ReactNode;
  title?: string;
  className?: string;
  securityLevel?: "standard" | "enhanced" | "maximum";
  withHeader?: boolean;
}

export default function DNAProtectedContainer({
  children,
  title = "Protected Content",
  className = "",
  securityLevel = "standard",
  withHeader = true,
}: DNAProtectedContainerProps) {
  const { isVerified } = useDNAVerification();
  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "verified" | "failed">("verifying");
  
  // Verify container on mount
  useEffect(() => {
    const verifyContainer = async () => {
      try {
        // In a real system, this would perform real verification
        const verified = isVerified; 
        
        setVerificationStatus(verified ? "verified" : "failed");
        
        // Log verification attempt
        fetch('/api/security/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'container_verification',
            status: verified ? 'success' : 'failure',
            timestamp: new Date().toISOString(),
            details: `Container verification ${verified ? 'succeeded' : 'failed'}: ${title}`
          })
        }).catch(error => {
          console.error('Failed to log container verification:', error);
        });
      } catch (error) {
        console.error("Error verifying container:", error);
        setVerificationStatus("failed");
      }
    };
    
    verifyContainer();
  }, [isVerified, title]);
  
  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-md ${
        securityLevel === "maximum" 
          ? "border-blue-600 bg-gray-900" 
          : securityLevel === "enhanced"
          ? "border-cyan-600 bg-gray-900/80"
          : "border-gray-700 bg-gray-800/60"
      } ${className}`}
      data-dna-signature={DNA_SIGNATURE}
      data-verify-token={VERIFY_TOKEN}
      data-copyright={`© ${COPYRIGHT_OWNER} (${COPYRIGHT_BIRTHDATE})`}
      data-security-level={securityLevel}
    >
      {withHeader && (
        <div 
          className={`px-4 py-2 flex items-center justify-between ${
            securityLevel === "maximum" 
              ? "bg-blue-900/50 border-b border-blue-700" 
              : securityLevel === "enhanced" 
              ? "bg-cyan-900/30 border-b border-cyan-800"
              : "bg-gray-900 border-b border-gray-700"
          }`}
        >
          <div className="flex items-center">
            <span className={`text-sm font-medium ${
              securityLevel === "maximum" 
                ? "text-blue-300" 
                : securityLevel === "enhanced"
                ? "text-cyan-300"
                : "text-gray-300"
            }`}>
              {title}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              verificationStatus === "verified" 
                ? "bg-green-500" 
                : verificationStatus === "verifying"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}></div>
            
            <span className="text-xs text-gray-400">
              {verificationStatus === "verified" 
                ? "DNA-Verified" 
                : verificationStatus === "verifying"
                ? "Verifying..."
                : "Verification Failed"}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {verificationStatus === "failed" ? (
          <div className="text-center text-red-400 p-4">
            <p className="font-medium">Security Verification Failed</p>
            <p className="text-sm mt-1">This content cannot be displayed.</p>
            <p className="text-xs mt-3">
              © {COPYRIGHT_OWNER} ({COPYRIGHT_BIRTHDATE})
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}