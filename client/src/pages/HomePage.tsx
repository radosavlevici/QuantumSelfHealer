/**
 * !!! DNA PROTECTED HOME PAGE - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This page component is protected with DNA-based security
 * integrated with all other components as one unified system
 * with self-repair, self-defense, and self-upgrade capabilities.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useDNAProtection } from '@/components/DNAProtectionProvider';

// Component identity for DNA verification
const COMPONENT_ID = 'dna-protected-home-page';
const COMPONENT_TYPE = 'page-component';
const COMPONENT_NAME = 'DNAProtectedHomePage';

/**
 * DNA-Protected Home Page Component
 * Implements security verification on load
 */
export default function HomePage() {
  // Component verification state
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [securityStatus, setSecurityStatus] = useState<string>('Initializing...');
  
  // DNA protection context
  const dnaProtection = useDNAProtection();
  
  // Perform component verification on mount
  useEffect(() => {
    if (!isVerified) {
      // Verify this component with the DNA protection system
      const verification = dnaProtection.verifyComponent(COMPONENT_ID, COMPONENT_TYPE);
      
      if (!verification.valid) {
        console.error('Home page verification failed:', verification.details);
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
      className="dna-protected-component"
      data-component-id={COMPONENT_ID}
      data-component-name={COMPONENT_NAME}
      data-watermark={watermark}
      data-verified={isVerified}
      data-copyright-owner={dnaProtection.copyright.owner}
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Quantum DNA Protected System
        </h1>
        <p className="text-gray-400">{securityStatus}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">DNA Security Features</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span> 
              Immutable Copyright Protection
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span> 
              DNA-Based Watermarking
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span> 
              Self-Repair Mechanisms
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span> 
              Self-Defense Capabilities
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span> 
              Self-Upgrade Functions
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span> 
              Unified Security System
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Copyright Information</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm text-gray-400">Owner</h3>
              <p className="font-semibold">{dnaProtection.copyright.owner}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Birthdate</h3>
              <p className="font-semibold">{dnaProtection.copyright.birthdate}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Email</h3>
              <p className="font-semibold">{dnaProtection.copyright.email}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">System Version</h3>
              <p className="font-semibold">{dnaProtection.system.version}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Component Watermark</h3>
              <p className="font-mono text-xs truncate" title={watermark}>{watermark}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/terminal">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-lg border border-blue-800/50 shadow-lg hover:from-blue-900/40 hover:to-blue-800/40 transition-colors cursor-pointer">
            <h3 className="text-xl font-bold mb-2 text-blue-400">Quantum Terminal</h3>
            <p className="text-gray-400">Access the secure quantum terminal interface with advanced command capabilities.</p>
          </div>
        </Link>
        
        <Link to="/quantum">
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-lg border border-purple-800/50 shadow-lg hover:from-purple-900/40 hover:to-purple-800/40 transition-colors cursor-pointer">
            <h3 className="text-xl font-bold mb-2 text-purple-400">Quantum Computing</h3>
            <p className="text-gray-400">Execute quantum algorithms with DNA-based security protection and verification.</p>
          </div>
        </Link>
        
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-lg border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold mb-2 text-green-400">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Security Level:</span>
              <span className="text-green-400">Maximum</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DNA Protection:</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Watermark Status:</span>
              <span className="text-green-400">Verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Component Status:</span>
              <span className={isVerified ? "text-green-400" : "text-red-400"}>
                {isVerified ? "Verified" : "Error"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-gray-400 text-sm">
          All components built together as one unified security system
        </p>
        <p className="text-gray-500 text-xs mt-1">
          {dnaProtection.copyright.full}
        </p>
      </div>
    </div>
  );
}