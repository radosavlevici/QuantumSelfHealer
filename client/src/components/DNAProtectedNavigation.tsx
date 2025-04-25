/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Navigation Component
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This component has integrated DNA-based verification and security
 * mechanisms that connect to the application security system.
 * All parts share the same DNA verification chain, creating one
 * unified security system built from the beginning.
 * 
 * ANTI-THEFT NOTICE:
 * Any attempt to copy this component or modify its security features
 * will trigger protective measures that prevent unauthorized use.
 * All components are linked by verification chains that make 
 * separate components unusable on their own.
 */

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Terminal,
  Shield,
  Settings,
  User,
  Server,
  AlertTriangle,
  ChevronUp
} from "lucide-react";

// DNA verification constants - must match other components
const SYSTEM_VERSION_ID = "QV2-DNAFull-20250425";
const COMPONENT_SIGNATURE = "dna-protected-navigation-v2-" + SYSTEM_VERSION_ID;

const DNAProtectedNavigation: React.FC<{ currentPath: string }> = ({ currentPath }) => {
  const [verificationStatus, setVerificationStatus] = useState<{
    verified: boolean;
    checking: boolean;
  }>({
    verified: false,
    checking: true
  });
  
  // Perform DNA verification check on load
  useEffect(() => {
    const verifyComponentIntegrity = async () => {
      try {
        setVerificationStatus(prev => ({ ...prev, checking: true }));
        
        // Request system integrity status
        const response = await fetch('/api/security/integrity');
        const data = await response.json();
        
        // Request copyright verification
        const copyrightResponse = await fetch('/api/copyright');
        const copyrightData = await copyrightResponse.json();
        
        // Only mark as verified if both checks pass
        setVerificationStatus({
          verified: data.intact && copyrightData.dnaVerified,
          checking: false
        });
      } catch (error) {
        console.error("Navigation component verification failed:", error);
        setVerificationStatus({
          verified: false,
          checking: false
        });
      }
    };
    
    verifyComponentIntegrity();
    
    // Check periodically
    const interval = setInterval(verifyComponentIntegrity, 120000); // Every 2 minutes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-2"
      data-component-id={COMPONENT_SIGNATURE}
      data-copyright="© Ervin Remus Radosavlevici (01/09/1987)"
      data-system-version={SYSTEM_VERSION_ID}
    >
      {/* Security warning banner - only shown if verification fails */}
      {!verificationStatus.verified && !verificationStatus.checking && (
        <div className="bg-red-900/80 text-white text-xs p-2 mb-2 rounded flex items-center gap-2">
          <AlertTriangle size={12} />
          <span>Security verification failed - Some features may be disabled</span>
        </div>
      )}
      
      <div className="max-w-screen-lg mx-auto flex justify-between items-center">
        <div className="flex space-x-3">
          <Link to="/">
            <div className={`flex flex-col items-center p-2 rounded ${currentPath === '/' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
              <Home size={20} className={currentPath === '/' ? 'text-blue-400' : 'text-gray-400'} />
              <span className="text-xs mt-1">Home</span>
            </div>
          </Link>
          
          <Link to="/terminal">
            <div className={`flex flex-col items-center p-2 rounded ${currentPath === '/terminal' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
              <Terminal size={20} className={currentPath === '/terminal' ? 'text-blue-400' : 'text-gray-400'} />
              <span className="text-xs mt-1">Terminal</span>
            </div>
          </Link>
          
          <Link to="/quantum-terminal">
            <div className={`flex flex-col items-center p-2 rounded ${currentPath === '/quantum-terminal' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
              <Server size={20} className={currentPath === '/quantum-terminal' ? 'text-blue-400' : 'text-gray-400'} />
              <span className="text-xs mt-1">Quantum</span>
            </div>
          </Link>
        </div>
        
        <div className="flex space-x-3">
          <Link to="/assistant">
            <div className={`flex flex-col items-center p-2 rounded ${currentPath === '/assistant' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
              <User size={20} className={currentPath === '/assistant' ? 'text-blue-400' : 'text-gray-400'} />
              <span className="text-xs mt-1">Assistant</span>
            </div>
          </Link>
          
          <Link to="/settings">
            <div className={`flex flex-col items-center p-2 rounded ${currentPath === '/settings' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
              <Settings size={20} className={currentPath === '/settings' ? 'text-blue-400' : 'text-gray-400'} />
              <span className="text-xs mt-1">Settings</span>
            </div>
          </Link>
          
          {/* Security indicator */}
          <div className="flex flex-col items-center p-2">
            {verificationStatus.checking ? (
              <div className="animate-pulse">
                <Shield size={20} className="text-yellow-400" />
              </div>
            ) : verificationStatus.verified ? (
              <Shield size={20} className="text-green-400" />
            ) : (
              <AlertTriangle size={20} className="text-red-400" />
            )}
            <span className="text-xs mt-1 whitespace-nowrap">
              {verificationStatus.checking 
                ? "Verifying..." 
                : verificationStatus.verified 
                  ? "Protected" 
                  : "Warning"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Hidden security elements */}
      <div className="hidden">
        <span data-dna-verification={COMPONENT_SIGNATURE}></span>
        <span data-system-version={SYSTEM_VERSION_ID}></span>
      </div>
      
      {/* Version identifier - visible but minimal */}
      <div className="text-center text-[0.6rem] text-gray-600 mt-1">
        DNA-Protected System • {SYSTEM_VERSION_ID.substring(0, 8)}
      </div>
    </nav>
  );
};

export default DNAProtectedNavigation;