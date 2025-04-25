/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Terminal Component - Unified Security Build
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This component is part of the integrated DNA-based security system
 * built from the beginning as a unified component, not as a separate piece.
 * 
 * It provides a secure terminal interface with DNA-verification to
 * detect tampering or unauthorized use.
 */

import { useState, useEffect, useRef } from "react";
import { useDNAVerification } from "@/components/DNAVerificationProvider";
import { COPYRIGHT_OWNER, COPYRIGHT_BIRTHDATE, SYSTEM_VERSION_ID } from "@/lib/dna-security-core";

// DNA verification constants
const DNA_SIGNATURE = `dna-protected-terminal-v2-${SYSTEM_VERSION_ID}`;
const VERIFY_TOKEN = `${COPYRIGHT_OWNER}-${COPYRIGHT_BIRTHDATE}-${SYSTEM_VERSION_ID}`;

// Terminal types
interface TerminalProps {
  initialText?: string;
  title?: string;
  className?: string;
  onCommand?: (command: string) => void;
}

type TerminalLine = {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error' | 'info';
};

export function DNAProtectedTerminal({ 
  initialText = "Welcome to the DNA-Protected Quantum Terminal",
  title = "quantum-terminal",
  className = "",
  onCommand
}: TerminalProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { 
      id: crypto.randomUUID(), 
      content: initialText, 
      type: 'info' 
    },
    { 
      id: crypto.randomUUID(), 
      content: `Copyright © ${COPYRIGHT_OWNER} (${COPYRIGHT_BIRTHDATE})`, 
      type: 'info' 
    },
    { 
      id: crypto.randomUUID(), 
      content: "Type 'help' for available commands.", 
      type: 'info' 
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isVerified } = useDNAVerification();
  
  // DNA verification on mount
  useEffect(() => {
    if (!isVerified) {
      addLine('DNA verification failed. Terminal security compromised.', 'error');
    } else {
      addLine('DNA verification successful. Terminal secure.', 'info');
    }
  }, [isVerified]);
  
  // Scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  
  // Add a line to the terminal
  const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
    setHistory(prev => [...prev, { 
      id: crypto.randomUUID(), 
      content, 
      type 
    }]);
  };
  
  // Handle command submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add command to history
    addLine(`$ ${inputValue}`, 'input');
    
    // Add to command history
    setCommandHistory(prev => [...prev, inputValue]);
    setHistoryIndex(-1);
    
    // Process command
    processCommand(inputValue);
    
    // Clear input
    setInputValue('');
  };
  
  // Process commands
  const processCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    
    // Forward command to parent if handler provided
    if (onCommand) {
      onCommand(command);
    }
    
    // Local command processing
    if (cmd === 'clear') {
      setHistory([]);
    } else if (cmd === 'help') {
      addLine('Available commands:', 'info');
      addLine('help       - Show this help', 'info');
      addLine('clear      - Clear the terminal', 'info');
      addLine('verify     - Verify DNA security', 'info');
      addLine('copyright  - Show copyright information', 'info');
      addLine('version    - Show system version', 'info');
    } else if (cmd === 'verify') {
      if (isVerified) {
        addLine('DNA verification successful. Terminal is secure.', 'info');
        addLine(`Verification token: ${VERIFY_TOKEN}`, 'info');
      } else {
        addLine('DNA verification failed. Security compromised.', 'error');
        addLine('This system may be an unauthorized copy.', 'error');
      }
    } else if (cmd === 'copyright') {
      addLine(`Copyright © ${COPYRIGHT_OWNER} (${COPYRIGHT_BIRTHDATE})`, 'info');
      addLine(`Email: ${COPYRIGHT_EMAIL}`, 'info');
      addLine('All rights reserved. Protected by DNA-based security.', 'info');
    } else if (cmd === 'version') {
      addLine(`System Version: ${SYSTEM_VERSION_ID}`, 'info');
      addLine(`Terminal Component: ${DNA_SIGNATURE}`, 'info');
      addLine(`Security Level: ${isVerified ? 'Verified' : 'Compromised'}`, isVerified ? 'info' : 'error');
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };
  
  // Handle clicking on the terminal to focus input
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };
  
  return (
    <div 
      className={`bg-gray-900 text-gray-200 rounded-lg overflow-hidden shadow-lg ${className}`}
      onClick={handleTerminalClick}
      data-dna-signature={DNA_SIGNATURE}
      data-verify-token={VERIFY_TOKEN}
      data-copyright={`© ${COPYRIGHT_OWNER} (${COPYRIGHT_BIRTHDATE})`}
    >
      {/* Terminal header */}
      <div className="bg-gray-800 px-3 py-1.5 flex items-center">
        <div className="flex space-x-1.5 mr-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-gray-400">{title}</span>
        
        {/* Security indicator */}
        <div className="ml-auto flex items-center">
          <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs ml-1.5 text-gray-400">
            {isVerified ? 'Secure' : 'Insecure'}
          </span>
        </div>
      </div>
      
      {/* Terminal content */}
      <div className="p-4 font-mono text-sm h-80 overflow-y-auto">
        {history.map((line) => (
          <div 
            key={line.id} 
            className={`mb-1 ${
              line.type === 'error' ? 'text-red-400' : 
              line.type === 'info' ? 'text-cyan-400' : 
              line.type === 'input' ? 'text-green-300' : 
              'text-gray-300'
            }`}
          >
            {line.content}
          </div>
        ))}
        
        {/* Current input */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent border-none outline-none text-green-300"
            autoFocus
          />
        </form>
        
        {/* Auto-scroll anchor */}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
}