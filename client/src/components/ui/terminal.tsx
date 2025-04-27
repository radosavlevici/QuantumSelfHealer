/**
 * !!! TERMINAL COMPONENT - DNA PROTECTED COMPONENT !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987), David Cornelius Marshall, and Serena Elizabeth Thorne
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * TERMINAL COMPONENT
 * 
 * A reusable terminal component for displaying console-like output
 * Built as one integrated system with DNA-based security from the beginning.
 */

import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useDNAProtection } from "@/components/DNAProtectionProvider";

// Component identity constants
const COMPONENT_ID = 'ui-terminal';
const COMPONENT_NAME = 'Terminal';

export interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  lines?: { content: string; type?: 'input' | 'output' | 'error' | 'system' }[];
}

/**
 * Terminal component
 * A console-like interface for displaying command line interactions
 */
const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  ({ className, lines = [], ...props }, ref) => {
    // Use DNA Protection context
    const dnaProtection = useDNAProtection();
    
    // Generate secure identifiers for the component
    const componentDNASignature = dnaProtection.generateComponentSignature(COMPONENT_ID, COMPONENT_NAME);
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md border border-gray-800 bg-black p-4 font-mono text-sm text-white overflow-auto",
          className
        )}
        data-component-id={COMPONENT_ID}
        data-component-name={COMPONENT_NAME}
        data-dna-signature={componentDNASignature}
        {...props}
      >
        {lines.map((line, index) => {
          const lineType = line.type || 'output';
          
          return (
            <div
              key={index}
              className={cn(
                "mb-1 whitespace-pre-wrap break-all",
                lineType === 'input' && "text-green-400",
                lineType === 'output' && "text-white",
                lineType === 'error' && "text-red-400",
                lineType === 'system' && "text-blue-400"
              )}
            >
              {lineType === 'input' && <span className="mr-1">{'>'}</span>}
              {lineType === 'error' && <span className="mr-1">{'!'}</span>}
              {line.content}
            </div>
          );
        })}
      </div>
    );
  }
);

Terminal.displayName = "Terminal";

export { Terminal };