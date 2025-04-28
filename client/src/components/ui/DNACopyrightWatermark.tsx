/**
 * Quantum AI Assistant
 * 
 * MIT License (Royalty-Free)
 * Copyright (c) 2025 Quantum AI Assistant Contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * ROYALTY-FREE PROVISION:
 * This software is provided completely royalty-free. No payment, fee, or royalty
 * of any kind is required for any use of this software, including commercial use, 
 * redistribution, or creation of derivative works.
 * 
 * QUANTUM DNA SECURITY WATERMARK COMPONENT
 * This component displays a visible copyright watermark with DNA-based security.
 * 
 * FEATURES:
 * - Visible copyright watermark with DNA security signatures
 * - Self-verification mechanisms
 * - Protection status notifications
 */

import React, { useState, useEffect } from 'react';
import { Shield, Copy, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useDNAProtection } from '../DNAProtectionProvider';

interface DNACopyrightWatermarkProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  expanded?: boolean;
}

export const DNACopyrightWatermark: React.FC<DNACopyrightWatermarkProps> = ({ 
  position = 'bottom-right',
  expanded: initialExpanded = false
}) => {
  // Get protection from context
  const { copyrightInfo, applyProtection } = useDNAProtection();
  
  // Apply protection to this component
  const protection = applyProtection('dna-copyright-watermark', 'ui-component');
  
  // State for expanded/collapsed view
  const [expanded, setExpanded] = useState(initialExpanded);
  
  // Generate position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-right':
        return 'top-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-right':
      default:
        return 'bottom-0 right-0';
    }
  };
  
  return (
    <div 
      className={`fixed ${getPositionClasses()} z-50 m-4 transition-all duration-300 ease-in-out`}
      data-component-id="dna-copyright-watermark"
      data-component-type="ui-component"
      data-watermark={protection.watermark}
      data-dna-signature={protection.dnaSignature}
    >
      <div 
        className={`flex flex-col bg-black/80 backdrop-blur-sm border border-cyan-900/30 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          expanded ? 'w-80' : 'w-auto'
        }`}
      >
        {/* Header with toggle */}
        <div 
          className="flex justify-between items-center p-2 cursor-pointer"
          onClick={() => setExpanded(prev => !prev)}
        >
          <div className="flex items-center text-cyan-400">
            <Shield className="w-4 h-4 mr-1.5" />
            <span className="text-xs font-medium">DNA-Protected</span>
          </div>
          <button 
            className="text-gray-400 hover:text-white p-1 rounded"
            aria-label={expanded ? 'Collapse watermark' : 'Expand watermark'}
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            )}
          </button>
        </div>
        
        {/* Expanded content */}
        {expanded && (
          <div className="px-3 py-2 border-t border-cyan-900/30 text-xs text-gray-300">
            <div className="flex items-start mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mr-1.5 mt-0.5 flex-shrink-0" />
              <p className="text-amber-300">
                This application is protected by DNA-based security systems.
                Unauthorized use, copying, or modification is strictly prohibited.
              </p>
            </div>
            
            <div className="bg-black/40 p-2.5 rounded mt-2 mb-1.5">
              <p className="font-semibold text-cyan-400">Copyright Information:</p>
              <p className="text-gray-300 mt-1">{copyrightInfo.full}</p>
              <p className="text-gray-400 mt-1">{`Owner: ${copyrightInfo.owner}`}</p>
              <p className="text-gray-400">{`DOB: ${copyrightInfo.birthdate}`}</p>
              <p className="text-gray-400">{`Email: ${copyrightInfo.email}`}</p>
              <p className="text-gray-400 mt-1">{`System Version: ${copyrightInfo.version}`}</p>
              <div className="text-gray-500 mt-1.5 text-2xs border-t border-gray-800 pt-1.5">
                <p className="break-all">DNA: {protection.dnaSignature.substring(0, 24)}...</p>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mb-1">
              All components built as one unified security system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};