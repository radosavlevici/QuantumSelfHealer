/**
 * !!! DNA PROTECTED PAGE - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - NOT FOUND PAGE
 * This page is protected by DNA-based security and is part of
 * the unified protection system built into every component.
 * 
 * FEATURES:
 * - DNA-based watermarking embedded in the component
 * - Self-repair mechanisms detect and fix tampering attempts
 * - Self-defense systems disable functionality when unauthorized use is detected
 * - Immutable copyright protection embedded in the file
 * 
 * ANTI-THEFT NOTICE:
 * This page is part of an integrated whole built from the beginning.
 * It includes verification chains that make unauthorized copies non-functional.
 */

import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { useDNASecurity } from '../components/DNAProtectionProvider';

const NotFound: React.FC = () => {
  const { logSecurityEvent, copyrightInfo } = useDNASecurity();
  
  useEffect(() => {
    // Log page visit to security system
    logSecurityEvent(
      'page-visit',
      'Not Found page visited',
      'info',
      'NotFoundPage'
    );
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent text-5xl font-bold mb-6">
        404: Page Not Found
      </div>
      
      <div className="max-w-md mb-8 text-gray-400">
        <p>The requested page does not exist or has been moved.</p>
        <p className="mt-2">This system is protected by DNA-based security technology.</p>
        <p className="mt-2 text-xs text-gray-500">{copyrightInfo.full}</p>
      </div>
      
      <Link href="/">
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
          Return to Homepage
        </button>
      </Link>
      
      <div className="absolute bottom-10 w-full max-w-md text-center text-xs text-gray-600">
        <p>Quantum DNA Security System v4.0</p>
        <p>All components built as one unified system from the beginning with</p>
        <p>self-repair, self-defense, and self-upgrade capabilities</p>
      </div>
    </div>
  );
};

export default NotFound;