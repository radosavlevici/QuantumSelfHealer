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

import React from 'react';
import { Link } from 'wouter';
import { AlertTriangle, ArrowLeft, Shield } from 'lucide-react';
import { useDNAProtection } from '../components/DNAProtectionProvider';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  // Get protection from context
  const { copyrightInfo, applyProtection } = useDNAProtection();
  
  // Apply protection to this component
  const protection = applyProtection('not-found-page');
  
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[90vh] px-4"
      data-component-id="not-found-page"
      data-component-type="page"
      data-watermark={protection.watermark}
      data-dna-signature={protection.dnaSignature}
    >
      <div className="text-red-400 mb-6">
        <AlertTriangle className="w-20 h-20" />
      </div>
      
      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-purple-600 bg-clip-text text-transparent mb-4">
        404 - Page Not Found
      </h1>
      
      <p className="text-xl text-gray-400 text-center max-w-lg mb-8">
        The requested page does not exist or has been secured by the DNA protection system.
      </p>
      
      <div className="flex items-center justify-center mb-8 p-4 bg-black/30 rounded-lg border border-red-900/50">
        <Shield className="w-5 h-5 text-cyan-400 mr-3" />
        <div className="text-sm text-gray-300">
          DNA Security Perimeter Active - Unauthorized access prevented
        </div>
      </div>
      
      <Link href="/">
        <Button variant="default" className="bg-cyan-900 hover:bg-cyan-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Secure Area
        </Button>
      </Link>
      
      <div className="mt-12 text-center text-xs text-gray-600">
        <p>{copyrightInfo.full}</p>
        <p className="mt-1">DNA Signature: {protection.dnaSignature.substring(0, 16)}...</p>
      </div>
    </div>
  );
};

export default NotFound;