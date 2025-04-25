/**
 * !!! DNA PROTECTED NOT FOUND PAGE - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This is the 404 page with DNA-based security
 * integrated with all other components as one unified system
 * with self-repair, self-defense, and self-upgrade capabilities.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useDNAProtection } from '@/components/DNAProtectionProvider';

// Component identity for DNA verification
const COMPONENT_ID = 'dna-protected-notfound-page';
const COMPONENT_TYPE = 'page-component';
const COMPONENT_NAME = 'DNAProtectedNotFoundPage';

/**
 * DNA-Protected Not Found Page Component
 * Implements a 404 page with security verification
 */
export default function NotFoundPage() {
  // Component verification state
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [securityStatus, setSecurityStatus] = useState<string>('Initializing...');
  
  // DNA protection context
  const dnaProtection = useDNAProtection();
  
  // Verify this component on mount
  useEffect(() => {
    if (!isVerified) {
      // Verify this component with the DNA protection system
      const verification = dnaProtection.verifyComponent(COMPONENT_ID, COMPONENT_TYPE);
      
      if (!verification.valid) {
        console.error('Not found page verification failed:', verification.details);
        dnaProtection.reportTampering(COMPONENT_ID, verification.details || 'Verification failed');
        setSecurityStatus('Security Violation Detected');
      } else {
        setIsVerified(true);
        setSecurityStatus('Protected by DNA Security');
        
        // Register this component with the protection system
        dnaProtection.registerComponent(COMPONENT_ID, COMPONENT_NAME, COMPONENT_TYPE);
      }
    }
  }, [dnaProtection, isVerified]);
  
  // Generate unique component watermark
  const watermark = dnaProtection.createWatermark(COMPONENT_ID);
  
  return (
    <div 
      className="dna-protected-component min-h-[70vh] flex flex-col items-center justify-center text-center"
      data-component-id={COMPONENT_ID}
      data-component-name={COMPONENT_NAME}
      data-watermark={watermark}
      data-verified={isVerified}
      data-copyright-owner={dnaProtection.copyright.owner}
    >
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-red-500 mb-2">404</h1>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-500 to-purple-600 text-transparent bg-clip-text">
          Page Not Found
        </h2>
        <p className="text-gray-400 mt-2">{securityStatus}</p>
      </div>
      
      <div className="max-w-md bg-gray-900 p-6 rounded-lg border border-gray-800">
        <p className="text-gray-300 mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Return to Home
            </button>
          </Link>
          
          <Link to="/terminal">
            <button className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
              Go to Terminal
            </button>
          </Link>
          
          <Link to="/quantum">
            <button className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors">
              Access Quantum Interface
            </button>
          </Link>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="text-gray-500 text-xs">
          {dnaProtection.copyright.full}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Protected by DNA-based security system
        </p>
      </div>
    </div>
  );
}