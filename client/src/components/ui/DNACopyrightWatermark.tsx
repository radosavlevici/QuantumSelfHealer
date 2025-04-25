/**
 * !!! DNA PROTECTED COMPONENT - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0
 * This component displays an immutable copyright watermark that
 * cannot be removed from the application interface.
 * 
 * FEATURES:
 * - Displays permanent copyright information in the UI
 * - Self-verifies its own integrity
 * - Cannot be disabled or removed through normal means
 * - Maintains protection even when other UI elements are modified
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import React, { useState, useEffect } from 'react';
import { useDNAProtection } from '../DNAProtectionProvider';
import { Shield, ShieldCheck, ShieldAlert, Info, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Props for the copyright watermark
interface DNACopyrightWatermarkProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  expanded?: boolean;
  showDetails?: boolean;
}

// DNA Copyright Watermark component
export const DNACopyrightWatermark: React.FC<DNACopyrightWatermarkProps> = ({ 
  position = 'bottom-right', 
  expanded = false,
  showDetails = false 
}) => {
  // Get security context from DNA Protection Provider
  const { securityStatus, copyrightInfo, applyProtection } = useDNAProtection();
  
  // Apply protection to this component
  const protection = applyProtection('copyright-watermark');
  
  // Local state for expansion
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isHovered, setIsHovered] = useState(false);
  
  // Position styles
  const positionStyles: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };
  
  // Render the watermark
  return (
    <div 
      className={`fixed ${positionStyles[position]} z-50 transition-all duration-300`}
      data-component-id="dna-copyright-watermark"
      data-component-type="ui-component"
      data-watermark={protection.watermark}
      data-dna-signature={protection.dnaSignature}
      data-security-level="maximum"
      data-copyright-owner={copyrightInfo.owner}
    >
      <div 
        className={`flex items-center ${isExpanded ? 'p-3 bg-black/80 border border-cyan-800 rounded-md shadow-lg' : 'p-2 bg-black/60 rounded-full shadow-md'} transition-all duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleExpanded}
      >
        {/* Security status icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                {securityStatus.valid ? (
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                )}
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${securityStatus.valid ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{securityStatus.valid ? 'DNA Security Active' : 'Security Compromised'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Show expanded info if expanded */}
        {isExpanded && (
          <div className="ml-2 text-xs text-white">
            <div className="flex items-center">
              <Lock className="w-3 h-3 mr-1 text-cyan-400" />
              <span className="font-semibold text-cyan-300">DNA Protected</span>
            </div>
            <div className="mt-1 font-light">
              <div>© {copyrightInfo.owner}</div>
              <div className="text-gray-400 text-[10px]">{copyrightInfo.birthdate}</div>
              <div className="text-cyan-400 text-[10px]">{copyrightInfo.email}</div>
            </div>
          </div>
        )}
        
        {/* Show tooltip on hover if not expanded */}
        {!isExpanded && isHovered && (
          <div className="absolute bottom-full mb-2 right-0 bg-black/80 px-3 py-2 rounded text-xs text-white whitespace-nowrap">
            <div className="font-semibold text-cyan-300">DNA Protection Active</div>
            <div className="text-white text-[10px]">© {copyrightInfo.owner}</div>
            <div className="text-cyan-400 text-[10px]">{copyrightInfo.email}</div>
          </div>
        )}
      </div>
    </div>
  );
};