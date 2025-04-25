/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Copyright Watermark - Unified Security Build
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This component is part of the integrated DNA-based security system
 * built from the beginning as a unified component, not as a separate piece.
 * 
 * This watermark component is displayed throughout the application to
 * ensure copyright information is visible and protected. It is integrated
 * with the DNA verification system to detect tampering attempts.
 */

import { useEffect, useState } from "react";
import { COPYRIGHT_OWNER, COPYRIGHT_BIRTHDATE, COPYRIGHT_EMAIL, SYSTEM_VERSION_ID } from "@/lib/dna-security-core";

// DNA signature generation
const DNA_SIGNATURE = `dna-protected-watermark-v2-${SYSTEM_VERSION_ID}`;
const VERIFY_TOKEN = `${COPYRIGHT_OWNER}-${COPYRIGHT_BIRTHDATE}-${SYSTEM_VERSION_ID}`;

export function DNACopyrightWatermark() {
  const [isVerified, setIsVerified] = useState(false);
  
  // Verify watermark integrity on mount
  useEffect(() => {
    const verifyWatermark = async () => {
      try {
        // In a real system, this would perform an actual verification
        // with the server to confirm the watermark hasn't been tampered with
        const response = await fetch('/api/copyright');
        const data = await response.json();
        
        const verified = 
          data.owner === COPYRIGHT_OWNER &&
          data.birthDate === COPYRIGHT_BIRTHDATE &&
          data.email === COPYRIGHT_EMAIL;
          
        setIsVerified(verified);
        
        // Log verification attempt
        fetch('/api/security/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'watermark_verification',
            status: verified ? 'success' : 'failure',
            timestamp: new Date().toISOString(),
            details: `Watermark verification ${verified ? 'succeeded' : 'failed'}`
          })
        }).catch(error => {
          console.error('Failed to log watermark verification:', error);
        });
        
      } catch (error) {
        console.error('Error verifying watermark:', error);
        setIsVerified(false);
      }
    };
    
    verifyWatermark();
  }, []);
  
  return (
    <div
      className="fixed bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 z-50 pointer-events-none select-none"
      data-dna-signature={DNA_SIGNATURE}
      data-verify-token={VERIFY_TOKEN}
      data-protection="immutable"
    >
      © {COPYRIGHT_OWNER} ({COPYRIGHT_BIRTHDATE})
      {isVerified && (
        <span
          className="ml-1 text-emerald-400 text-[8px] uppercase tracking-wide"
          data-verified="true"
        >
          ★ DNA Protected ★
        </span>
      )}
    </div>
  );
}