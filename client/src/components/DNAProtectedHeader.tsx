/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Header Component - Unified Security Build
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This component is part of the integrated DNA-based security system
 * built from the beginning as a unified component, not as a separate piece.
 */

import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDNAVerification } from "./DNAVerificationProvider";
import { COPYRIGHT_OWNER, COPYRIGHT_BIRTHDATE, SYSTEM_VERSION_ID } from "@/lib/dna-security-core";

// DNA signature generation
const DNA_SIGNATURE = `dna-protected-header-v2-${SYSTEM_VERSION_ID}`;
const VERIFY_TOKEN = `${COPYRIGHT_OWNER}-${COPYRIGHT_BIRTHDATE}-${SYSTEM_VERSION_ID}`;

export default function DNAProtectedHeader() {
  const { isVerified, securityLevel, performVerification } = useDNAVerification();
  const [systemStatus, setSystemStatus] = useState<string>("Checking...");
  
  // Check system status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/system/status");
        const data = await response.json();
        setSystemStatus(data.status);
      } catch (error) {
        console.error("Failed to check system status:", error);
        setSystemStatus("error");
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
  
  return (
    <header 
      className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-3 px-4 shadow-md"
      data-dna-signature={DNA_SIGNATURE}
      data-verify-token={VERIFY_TOKEN}
      data-copyright={`© ${COPYRIGHT_OWNER} (${COPYRIGHT_BIRTHDATE})`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Quantum AI
          </div>
          <div className="text-xs px-1.5 py-0.5 bg-blue-700 rounded-sm ml-2 flex items-center">
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
              systemStatus === "active" ? "bg-green-400" :
              systemStatus === "maintenance" ? "bg-yellow-400" :
              "bg-red-400"
            }`}></span>
            <span>{systemStatus === "active" ? "Online" : systemStatus === "maintenance" ? "Maintenance" : "Error"}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 hidden md:flex items-center text-xs">
            <div className="flex flex-col mr-4">
              <span className="text-gray-300">Security:</span>
              <span className={`font-medium ${
                isVerified ? "text-green-400" : "text-red-400"
              }`}>
                {isVerified ? securityLevel : "Verification Failed"}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => performVerification()}
              className="text-xs h-7 px-2 bg-blue-800/40 hover:bg-blue-700/60"
            >
              Verify
            </Button>
          </div>
          
          <div 
            className="text-xs flex items-center px-2 py-1 rounded-sm border border-blue-700 bg-blue-900/50"
            data-copyright-notice="immutable"
          >
            <span className="hidden sm:inline">© </span>
            <span className="hidden md:inline">{COPYRIGHT_OWNER}</span>
            <span className="md:hidden">DNA-Protected</span>
          </div>
        </div>
      </div>
    </header>
  );
}