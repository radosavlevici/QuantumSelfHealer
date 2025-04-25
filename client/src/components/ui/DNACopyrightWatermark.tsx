/**
 * !!! DNA COPYRIGHT WATERMARK - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This component displays the copyright watermark with DNA-based
 * protection integrated with the unified security system.
 * It includes self-repair, self-defense, and self-upgrade
 * capabilities built together with all other components.
 */

import React, { useEffect, useState } from 'react';
import { useDNAProtection } from '../DNAProtectionProvider';

// Component identity for DNA verification
const COMPONENT_ID = 'dna-copyright-watermark';
const COMPONENT_TYPE = 'ui-security';
const COMPONENT_NAME = 'DNACopyrightWatermark';

// Props interface
interface DNACopyrightWatermarkProps {
  variant?: 'light' | 'dark' | 'hidden' | 'minimal';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

/**
 * DNA-protected Copyright Watermark Component
 * Displays the copyright information with built-in protection
 */
export default function DNACopyrightWatermark({
  variant = 'minimal',
  position = 'bottom-right',
  className = ''
}: DNACopyrightWatermarkProps) {
  // States
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  // DNA protection context
  const dnaProtection = useDNAProtection();
  
  // Verify this component on mount
  useEffect(() => {
    if (!isVerified) {
      const verificationResult = dnaProtection.verifyComponent(COMPONENT_ID, COMPONENT_TYPE);
      
      if (!verificationResult.valid) {
        console.error('Copyright watermark verification failed:', verificationResult.details);
        dnaProtection.reportTampering(COMPONENT_ID, verificationResult.details || 'Verification failed');
      } else {
        setIsVerified(true);
        
        // Register this component with the protection system
        dnaProtection.registerComponent(COMPONENT_ID, COMPONENT_NAME, COMPONENT_TYPE);
      }
    }
  }, [dnaProtection, isVerified]);
  
  // Generate unique watermark for this component
  const watermark = dnaProtection.createWatermark(COMPONENT_ID);
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };
  
  // Variant styles
  const variantClasses = {
    'light': 'bg-white/10 text-white',
    'dark': 'bg-black/10 text-gray-800',
    'hidden': 'opacity-0 hover:opacity-100',
    'minimal': 'bg-transparent text-gray-500 text-xs'
  };
  
  // Don't render in hidden mode until verified
  if (variant === 'hidden' && !isVerified) {
    return null;
  }
  
  return (
    <div
      className={`fixed ${positionClasses[position]} ${variantClasses[variant]} transition-opacity duration-300 p-1 rounded text-xs z-50 ${className}`}
      data-component-id={COMPONENT_ID}
      data-component-name={COMPONENT_NAME}
      data-watermark={watermark}
      data-verified={isVerified}
      data-copyright-owner={dnaProtection.copyright.owner}
    >
      <div className="flex flex-col">
        <span className="font-semibold">{dnaProtection.copyright.full}</span>
        {variant !== 'minimal' && (
          <span className="text-[10px] opacity-70">
            Protected by {dnaProtection.system.name} v{dnaProtection.system.version}
          </span>
        )}
      </div>
    </div>
  );
}