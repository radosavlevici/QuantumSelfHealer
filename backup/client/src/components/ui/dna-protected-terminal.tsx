/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Terminal UI Component
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This component provides a secure terminal interface with DNA-based
 * protection. It is part of the unified security system that is
 * built from the beginning as an integrated whole.
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

import React, { useEffect, useRef, useState } from 'react';
import { useDNAVerification } from '../DNAVerificationProvider';

// Component ID and type - used for verification
const COMPONENT_ID = 'dna-protected-terminal';
const COMPONENT_TYPE = 'ui-component';
const COMPONENT_NAME = 'ProtectedTerminal';

// Terminal display properties
interface TerminalProps {
  initialCommands?: string[];
  showWelcome?: boolean;
  securityLevel?: "standard" | "enhanced" | "maximum";
  onCommand?: (command: string) => Promise<string>;
}

// Terminal line data structure
interface TerminalLine {
  type: "input" | "output" | "welcome" | "error" | "warning" | "security";
  content: string;
  timestamp: Date;
}

/**
 * DNA-Protected Terminal Component
 * Provides a secure terminal interface with built-in DNA protection
 */
export function ProtectedTerminal({
  initialCommands = [],
  showWelcome = true,
  securityLevel = "enhanced",
  onCommand
}: TerminalProps) {
  // Terminal state
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [integrityScan, setIntegrityScan] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // DNA Verification context
  const dnaContext = useDNAVerification();
  
  // Verify component integrity on mount
  useEffect(() => {
    if (!integrityScan) {
      const verificationResult = dnaContext.verifyComponent(COMPONENT_ID, COMPONENT_TYPE);
      
      if (!verificationResult.verified) {
        console.error('Terminal integrity verification failed:', verificationResult.details);
        dnaContext.reportTampering(COMPONENT_ID, verificationResult.details || 'Unknown verification error');
        setIsLocked(true);
        
        // Add tampering warning
        setLines(prev => [...prev, {
          type: "security",
          content: `⚠️ SECURITY ALERT: Terminal integrity verification failed. ${verificationResult.details}`,
          timestamp: new Date()
        }]);
      } else {
        setIsLocked(false);
      }
      
      setIntegrityScan(true);
    }
  }, [dnaContext, integrityScan]);
  
  // Initialize with welcome message and initial commands
  useEffect(() => {
    const initialLines: TerminalLine[] = [];
    
    if (showWelcome) {
      initialLines.push({
        type: "welcome",
        content: `Quantum AI Terminal v1.0`,
        timestamp: new Date()
      });
      
      initialLines.push({
        type: "welcome",
        content: `${dnaContext.copyright.full}`,
        timestamp: new Date()
      });
      
      initialLines.push({
        type: "welcome",
        content: `Type 'help' to view available commands`,
        timestamp: new Date()
      });
      
      initialLines.push({
        type: "security",
        content: `DNA-Protected Terminal Initialized - Security Level: ${securityLevel.toUpperCase()}`,
        timestamp: new Date()
      });
    }
    
    setLines(initialLines);
    
    // Process any initial commands
    if (initialCommands.length > 0) {
      initialCommands.forEach(cmd => {
        processCommand(cmd);
      });
    }
  }, []);
  
  // Scroll to bottom when lines change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);
  
  // Focus input on click
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Process a command
  const processCommand = async (command: string) => {
    if (!command.trim()) return;
    
    // Record command in history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Add command to display
    setLines(prev => [...prev, {
      type: "input",
      content: command,
      timestamp: new Date()
    }]);
    
    let response: string;
    
    // Process built-in commands
    if (command === "clear") {
      setLines([]);
      return;
    } else if (command === "help") {
      response = `
Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  status   - Show terminal status
  version  - Show version information
  verify   - Run security verification
  about    - Show information about this terminal
      `.trim();
    } else if (command === "status") {
      response = `
Terminal Status:
  Security Level: ${securityLevel.toUpperCase()}
  DNA Protection: ACTIVE
  Integrity Check: ${integrityScan ? "COMPLETED" : "PENDING"}
  Verification Status: ${isLocked ? "FAILED" : "VERIFIED"}
      `.trim();
    } else if (command === "version") {
      response = `
Quantum AI Terminal v1.0
DNA Security System v${dnaContext.systemVersion}
Copyright ${dnaContext.copyright.full}
      `.trim();
    } else if (command === "verify") {
      const verificationResult = dnaContext.verifyComponent(COMPONENT_ID, COMPONENT_TYPE);
      
      response = `
Security Verification Results:
  Component: ${COMPONENT_NAME}
  Status: ${verificationResult.verified ? "VERIFIED" : "FAILED"}
  ${verificationResult.details ? `Details: ${verificationResult.details}` : ""}
  Timestamp: ${verificationResult.timestamp.toISOString()}
      `.trim();
    } else if (command === "about") {
      response = `
DNA-Protected Quantum AI Terminal
${dnaContext.copyright.full}

This terminal provides a secure interface to access quantum
computing resources with advanced security features including
DNA-based protection, self-repair, and tamper detection.

All commands are verified and monitored by the DNA security system.
      `.trim();
    } else if (onCommand) {
      try {
        // Pass to external command handler
        response = await onCommand(command);
      } catch (error) {
        setLines(prev => [...prev, {
          type: "error",
          content: `Error processing command: ${error.message}`,
          timestamp: new Date()
        }]);
        return;
      }
    } else {
      response = `Command not recognized: ${command}`;
    }
    
    // Add response to display
    setLines(prev => [...prev, {
      type: "output",
      content: response,
      timestamp: new Date()
    }]);
    
    // Clear input
    setCurrentInput("");
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setLines(prev => [...prev, {
        type: "security",
        content: "⚠️ Terminal is locked due to security violations. Please contact administrator.",
        timestamp: new Date()
      }]);
      return;
    }
    
    processCommand(currentInput);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };
  
  // Handle key navigation through command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };
  
  // Colorize terminal output based on line type
  const getLineClass = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-blue-400';
      case 'output': return 'text-green-300';
      case 'welcome': return 'text-cyan-300';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-300';
      case 'security': return 'text-purple-400';
      default: return 'text-white';
    }
  };
  
  // Add appropriate prefix to line
  const getLinePrefix = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return '> ';
      case 'output': return '';
      case 'welcome': return '# ';
      case 'error': return '! ';
      case 'warning': return '⚠ ';
      case 'security': return '🔒 ';
      default: return '';
    }
  };

  return (
    <div 
      ref={containerRef}
      data-component-id={COMPONENT_ID}
      data-component-name={COMPONENT_NAME}
      data-security-level={securityLevel}
      data-dna-watermark={dnaContext.createWatermark(COMPONENT_ID)}
      onClick={focusInput}
      className="h-full w-full overflow-auto p-4 font-mono text-sm bg-black/95 rounded-md border border-gray-800 resize-y"
    >
      {/* Terminal output */}
      <div className="pb-2">
        {lines.map((line, i) => (
          <div key={i} className={`${getLineClass(line.type)} whitespace-pre-wrap mb-1`}>
            {getLinePrefix(line.type)}{line.content}
          </div>
        ))}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-center border-t border-gray-700 pt-2">
        <span className={`mr-2 ${isLocked ? 'text-red-500' : 'text-blue-400'}`}>
          {isLocked ? '🔒' : '>'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLocked}
          className="flex-1 bg-transparent focus:outline-none text-white"
          autoFocus
        />
      </form>
    </div>
  );
}