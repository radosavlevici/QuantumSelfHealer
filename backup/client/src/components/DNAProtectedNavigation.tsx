/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Navigation Component
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This component provides a secure navigation interface with DNA-based
 * protection. It is part of the unified security system that is
 * built from the beginning as an integrated whole.
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

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Terminal, Bot, Settings, ShieldAlert } from "lucide-react";
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
const COMPONENT_NAME = "dna-protected-navigation";
const COMPONENT_DNA_SIGNATURE = generateDNASignature(COMPONENT_NAME);

// Navigation items with DNA protection
const navigationItems = [
  {
    id: "home",
    label: "Home",
    path: "/",
    icon: Home,
    dnaSignature: generateDNASignature("nav-item-home")
  },
  {
    id: "terminal",
    label: "Terminal",
    path: "/terminal",
    icon: Terminal,
    dnaSignature: generateDNASignature("nav-item-terminal")
  },
  {
    id: "quantum-terminal",
    label: "Quantum",
    path: "/quantum-terminal",
    icon: Bot,
    dnaSignature: generateDNASignature("nav-item-quantum")
  },
  {
    id: "assistant",
    label: "Assistant",
    path: "/assistant",
    icon: Bot,
    dnaSignature: generateDNASignature("nav-item-assistant")
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
    dnaSignature: generateDNASignature("nav-item-settings")
  }
];

interface DNAProtectedNavigationProps {
  currentPath: string;
}

export default function DNAProtectedNavigation({ currentPath }: DNAProtectedNavigationProps) {
  const [integrityVerified, setIntegrityVerified] = useState<boolean | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securityAlert, setSecurityAlert] = useState<boolean>(false);
  
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
          setSecurityError("Tampering detected in navigation component");
          selfDefense.respondToThreat("navigation-component-tampering");
          setSecurityAlert(true);
        } else if (!signatureValid) {
          setIntegrityVerified(false);
          setSecurityError("Invalid DNA signature");
          setSecurityAlert(true);
          
          // Attempt self-repair
          const repaired = selfRepair.repairComponent(COMPONENT_NAME);
          if (repaired) {
            console.log(`%c DNA Security: Component ${COMPONENT_NAME} self-repaired successfully`, "background: #0a0a30; color: #00ffff;");
            setIntegrityVerified(true);
            setSecurityError(null);
          }
        } else {
          setIntegrityVerified(true);
          setSecurityError(null);
        }
        
        // Verify each navigation item's signature
        const navItemsVerified = navigationItems.every(item => 
          verifyDNASignature(item.dnaSignature)
        );
        
        if (!navItemsVerified) {
          console.error("Navigation items verification failed");
          setSecurityAlert(true);
        }
        
        // Log security event to server
        await fetch('/api/security/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            component: COMPONENT_NAME,
            action: 'integrity-verification',
            result: signatureValid ? 'success' : 'failure',
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error("Navigation integrity verification error:", error);
        setIntegrityVerified(false);
        setSecurityError((error as Error).message);
      }
    };
    
    verifyComponentIntegrity();
  }, []);
  
  // If integrity verification failed, show a warning navigation
  if (integrityVerified === false || securityError) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-red-900/90 border-t border-red-800 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-200">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-sm font-medium">Security Warning</span>
          </div>
          <div className="text-xs text-red-300">
            © {COPYRIGHT_OWNER} ({COPYRIGHT_BIRTHDATE})
          </div>
        </div>
        {securityError && (
          <div className="mt-1 text-xs text-red-300">{securityError}</div>
        )}
      </nav>
    );
  }
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 p-2"
      data-component-name={COMPONENT_NAME}
      data-dna-signature={COMPONENT_DNA_SIGNATURE.signature}
      data-copyright-owner={COPYRIGHT_OWNER}
    >
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-around">
          {navigationItems.map(item => (
            <Link key={item.id} href={item.path}>
              <a 
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPath === item.path 
                    ? 'text-blue-400 bg-blue-900/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                data-nav-item-id={item.id}
                data-nav-item-signature={item.dnaSignature.signature}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
                
                {/* Show security alert indicator if needed */}
                {securityAlert && item.id === "settings" && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </a>
            </Link>
          ))}
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
    </nav>
  );
}