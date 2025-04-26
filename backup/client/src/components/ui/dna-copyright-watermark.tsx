/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Copyright Watermark Component
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This component provides visible copyright watermarking with DNA-based
 * protection. It is part of the unified security system that is built
 * from the beginning as an integrated whole.
 * 
 * FEATURES:
 * - Self-repair mechanisms detect and fix tampering attempts
 * - Self-defense systems disable functionality when unauthorized use is detected
 * - Self-upgrade capabilities enhance security over time
 * - Copyright protection immutably embedded in all components
 * - DNA watermarking provides tamper-evident protection
 * 
 * ANTI-THEFT NOTICE:
 * This component is integrated with the DNA verification chain.
 * Modifying, copying, or using this component outside of the 
 * authorized environment will break the DNA verification chain,
 * causing the entire application to become non-functional.
 */

import React, { useEffect, useState } from 'react';
import { useDNAVerification } from '../DNAVerificationProvider';
import { createDNAWatermark } from '@/lib/dna-security-core';

// Component ID and type - used for verification
const COMPONENT_ID = 'dna-copyright-watermark';
const COMPONENT_TYPE = 'ui-security';
const COMPONENT_NAME = 'DNACopyrightWatermark';

interface DNACopyrightWatermarkProps {
  variant?: 'light' | 'dark' | 'hidden' | 'minimal';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

/**
 * DNA-Protected Copyright Watermark Component
 * Displays copyright information with built-in security validation
 */
export default function DNACopyrightWatermark({
  variant = 'minimal',
  position = 'bottom-right',
  className = '',
}: DNACopyrightWatermarkProps) {
  const [integrityScan, setIntegrityScan] = useState<boolean>(false);
  const dnaContext = useDNAVerification();
  
  // Verify this component with the DNA system
  useEffect(() => {
    if (!integrityScan) {
      const verificationResult = dnaContext.verifyComponent(COMPONENT_ID, COMPONENT_TYPE);
      
      if (!verificationResult.verified) {
        console.error('Copyright watermark integrity verification error:', verificationResult.details);
        dnaContext.reportTampering(COMPONENT_ID, verificationResult.details || 'Unknown verification error');
      }
      
      setIntegrityScan(true);
    }
  }, [dnaContext, integrityScan]);

  // Generate component-specific watermark
  const watermark = dnaContext.createWatermark(COMPONENT_ID);
  
  // Generate verification token
  const verificationToken = generateSecureHash(`${COMPONENT_ID}|${dnaContext.copyright.owner}|${Date.now()}`).substring(0, 8);
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };
  
  // Variant styles
  const variantClasses = {
    light: 'bg-white/10 text-white',
    dark: 'bg-black/10 text-gray-800',
    hidden: 'opacity-0 hover:opacity-100',
    minimal: 'bg-transparent text-gray-500 text-xs'
  };
  
  if (variant === 'hidden' && !integrityScan) {
    return null;
  }

  return (
    <div
      data-component-id={COMPONENT_ID}
      data-component-name={COMPONENT_NAME}
      data-watermark={watermark}
      data-verification={verificationToken}
      className={`fixed ${positionClasses[position]} ${variantClasses[variant]} transition-opacity duration-300 p-1 rounded text-xs z-50 ${className}`}
    >
      <div className="flex flex-col">
        <span className="font-semibold">{dnaContext.copyright.full}</span>
        {variant !== 'minimal' && (
          <span className="text-[10px] opacity-70">
            Protected by DNA Security v{dnaContext.systemVersion}
          </span>
        )}
      </div>
    </div>
  );
}