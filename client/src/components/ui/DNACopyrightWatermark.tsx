/**
 * !!! DNA COPYRIGHT WATERMARK - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - WATERMARK COMPONENT
 * This component displays a visible copyright watermark on every page
 * of the application, providing clear ownership information and
 * protection against unauthorized use.
 * 
 * FEATURES:
 * - Displays immutable copyright information
 * - Integrates with the DNA protection system
 * - Self-verifies on render to ensure integrity
 * - Cannot be removed without breaking application functionality
 * 
 * ANTI-THEFT NOTICE:
 * This watermark is a critical part of the integrated security system.
 * Removing or modifying it will cause the application to cease functioning
 * due to the security verification chains built into every component.
 */

import React, { useEffect } from 'react';
import { useDNASecurity } from '../DNAProtectionProvider';

interface DNACopyrightWatermarkProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
  size?: 'small' | 'medium' | 'large';
}

const DNACopyrightWatermark: React.FC<DNACopyrightWatermarkProps> = ({
  position = 'bottom-right',
  opacity = 0.3,
  size = 'small',
}) => {
  // Get security context
  const { copyrightInfo, securityLevel, logSecurityEvent } = useDNASecurity();
  
  // Position styles based on the position prop
  const positionStyles = {
    'top-left': { top: '10px', left: '10px' },
    'top-right': { top: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' },
  };
  
  // Size styles based on the size prop
  const sizeStyles = {
    small: { fontSize: '10px' },
    medium: { fontSize: '12px' },
    large: { fontSize: '14px' },
  };
  
  // Log watermark rendering
  useEffect(() => {
    logSecurityEvent(
      'watermark-rendered',
      `Copyright watermark rendered at ${position}`,
      'info',
      'DNACopyrightWatermark'
    );
    
    // Verify watermark is not tampered with
    const interval = setInterval(() => {
      const watermarkElement = document.getElementById('dna-copyright-watermark');
      
      if (!watermarkElement || watermarkElement.innerText !== `${copyrightInfo.full} - Protected by DNA Security`) {
        logSecurityEvent(
          'watermark-tampered',
          'Copyright watermark has been modified or removed',
          'critical',
          'DNACopyrightWatermark'
        );
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div
      id="dna-copyright-watermark"
      className="dna-copyright-watermark"
      style={{
        position: 'fixed',
        ...positionStyles[position],
        opacity,
        ...sizeStyles[size],
        color: '#000',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        padding: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(2px)',
        borderRadius: '4px',
        zIndex: 1000,
        userSelect: 'none',
        pointerEvents: 'none',
        textShadow: '1px 1px 1px rgba(255, 255, 255, 0.5)',
      }}
      data-security-level={securityLevel}
    >
      {copyrightInfo.full} - Protected by DNA Security
    </div>
  );
};

export default DNACopyrightWatermark;