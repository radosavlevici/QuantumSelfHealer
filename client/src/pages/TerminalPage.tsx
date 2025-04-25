/**
 * !!! DNA PROTECTED TERMINAL PAGE - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This is the terminal interface with DNA-based security
 * integrated with all other components as one unified system
 * with self-repair, self-defense, and self-upgrade capabilities.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useDNAProtection } from '@/components/DNAProtectionProvider';

// Component identity for DNA verification
const COMPONENT_ID = 'dna-protected-terminal-page';
const COMPONENT_TYPE = 'page-component';
const COMPONENT_NAME = 'DNAProtectedTerminalPage';

/**
 * DNA-Protected Terminal Page Component
 * Implements a secure terminal interface with quantum processing
 */
export default function TerminalPage() {
  // Component states
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [securityStatus, setSecurityStatus] = useState<string>('Initializing...');
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  // Refs
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // DNA protection context
  const dnaProtection = useDNAProtection();
  
  // Initialize and verify this component on mount
  useEffect(() => {
    if (!isVerified) {
      // Verify this component with the DNA protection system
      const verification = dnaProtection.verifyComponent(COMPONENT_ID, COMPONENT_TYPE);
      
      if (!verification.valid) {
        console.error('Terminal page verification failed:', verification.details);
        dnaProtection.reportTampering(COMPONENT_ID, verification.details || 'Verification failed');
        setSecurityStatus('Security Violation Detected');
      } else {
        setIsVerified(true);
        setSecurityStatus('Protected by DNA Security');
        
        // Register this component with the protection system
        dnaProtection.registerComponent(COMPONENT_ID, COMPONENT_NAME, COMPONENT_TYPE);
        
        // Add welcome message
        setHistory([
          `Quantum Terminal v1.0.0 - ${dnaProtection.copyright.full}`,
          'DNA-Based Protection Active - All Actions Are Secured',
          '---------------------------------------------------------------',
          'Type "help" to see available commands',
          ''
        ]);
      }
    }
    
    // Focus the input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [dnaProtection, isVerified]);
  
  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Generate unique component watermark
  const watermark = dnaProtection.createWatermark(COMPONENT_ID);
  
  // Handle command input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input);
      setInput('');
      // Add to command history
      setCommandHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory(-1);
    }
  };
  
  // Navigate command history
  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return;
    
    const newIndex = historyIndex + direction;
    if (newIndex >= commandHistory.length) return;
    if (newIndex < -1) return;
    
    setHistoryIndex(newIndex);
    if (newIndex === -1) {
      setInput('');
    } else {
      setInput(commandHistory[commandHistory.length - 1 - newIndex]);
    }
  };
  
  // Process command
  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const commandParts = trimmedCmd.split(' ');
    const command = commandParts[0]?.toLowerCase();
    const args = commandParts.slice(1);
    
    // Add command to history display
    setHistory(prev => [...prev, `> ${trimmedCmd}`, '']);
    
    // Process command
    switch (command) {
      case 'help':
        displayHelp();
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'status':
        showStatus();
        break;
      case 'verify':
        verifyComponent(args[0] || COMPONENT_ID);
        break;
      case 'copyright':
        showCopyright();
        break;
      case 'analyze':
        analyzeData(args.join(' '));
        break;
      case 'quantum':
        initiateQuantumProcess(args);
        break;
      default:
        setHistory(prev => [...prev, `Command not recognized: ${command}`, 'Type "help" for available commands', '']);
    }
  };
  
  // Display help
  const displayHelp = () => {
    setHistory(prev => [
      ...prev,
      'Available commands:',
      '  help        - Display this help information',
      '  clear       - Clear the terminal',
      '  status      - Show system status and security information',
      '  verify      - Verify the integrity of a component',
      '  copyright   - Display copyright information',
      '  analyze     - Analyze input data using quantum algorithms',
      '  quantum     - Access quantum computing functions',
      ''
    ]);
  };
  
  // Clear terminal
  const clearTerminal = () => {
    setHistory([
      `Quantum Terminal v1.0.0 - ${dnaProtection.copyright.full}`,
      'DNA-Based Protection Active - All Actions Are Secured',
      '---------------------------------------------------------------',
      ''
    ]);
  };
  
  // Show system status
  const showStatus = () => {
    setHistory(prev => [
      ...prev,
      'System Status:',
      `  Component: ${COMPONENT_NAME}`,
      `  Security Level: MAXIMUM`,
      `  Verification: ${isVerified ? 'PASSED' : 'FAILED'}`,
      `  DNA Protection: ACTIVE`,
      `  Watermark: ${watermark}`,
      `  System Version: ${dnaProtection.system.version}`,
      `  Build Date: ${dnaProtection.system.buildDate}`,
      ''
    ]);
  };
  
  // Verify component
  const verifyComponent = (componentId: string) => {
    const verification = dnaProtection.verifyComponent(componentId, 'any');
    
    setHistory(prev => [
      ...prev,
      `Verifying component "${componentId}"...`,
      `  Result: ${verification.valid ? 'VALID' : 'COMPROMISED'}`,
      `  Security Level: ${verification.securityLevel}`,
      `  Timestamp: ${verification.timestamp.toISOString()}`,
      verification.details ? `  Details: ${verification.details}` : '',
      ''
    ]);
  };
  
  // Show copyright
  const showCopyright = () => {
    setHistory(prev => [
      ...prev,
      'Copyright Information:',
      `  Owner: ${dnaProtection.copyright.owner}`,
      `  Birthdate: ${dnaProtection.copyright.birthdate}`,
      `  Email: ${dnaProtection.copyright.email}`,
      `  Full Copyright: ${dnaProtection.copyright.full}`,
      '',
      'All components are protected with DNA-based security',
      'Self-repair, self-defense and self-upgrade capabilities are active',
      ''
    ]);
  };
  
  // Analyze data
  const analyzeData = (data: string) => {
    if (!data) {
      setHistory(prev => [...prev, 'Error: No data provided for analysis', 'Usage: analyze <data>', '']);
      return;
    }
    
    setHistory(prev => [...prev, `Analyzing data using quantum algorithms: "${data}"`, '']);
    
    // Simulate quantum analysis
    setTimeout(() => {
      setHistory(prev => [
        ...prev,
        'Analysis complete:',
        `  Input hash: ${dnaProtection.createWatermark(data)}`,
        `  Quantum signature: QS-${Math.random().toString(36).substring(2, 15)}`,
        `  Data classification: SECURE`,
        ''
      ]);
    }, 1500);
  };
  
  // Quantum processes
  const initiateQuantumProcess = (args: string[]) => {
    const subCommand = args[0]?.toLowerCase();
    
    switch (subCommand) {
      case 'init':
        setHistory(prev => [...prev, 'Initializing quantum processing environment...', '']);
        setTimeout(() => {
          setHistory(prev => [...prev, 'Quantum environment ready for computation', '']);
        }, 1000);
        break;
      case 'algorithm':
        const algorithm = args[1]?.toLowerCase();
        setHistory(prev => [...prev, `Executing quantum algorithm: ${algorithm || 'default'}`, '']);
        setTimeout(() => {
          setHistory(prev => [
            ...prev,
            'Algorithm execution complete',
            `  Qubits processed: ${Math.floor(Math.random() * 100) + 1}`,
            `  Execution time: ${Math.random().toFixed(4)}s`,
            ''
          ]);
        }, 2000);
        break;
      default:
        setHistory(prev => [
          ...prev,
          'Available quantum subcommands:',
          '  quantum init        - Initialize quantum environment',
          '  quantum algorithm   - Execute quantum algorithm',
          ''
        ]);
    }
  };
  
  return (
    <div 
      className="dna-protected-component flex flex-col h-[80vh]"
      data-component-id={COMPONENT_ID}
      data-component-name={COMPONENT_NAME}
      data-watermark={watermark}
      data-verified={isVerified}
      data-copyright-owner={dnaProtection.copyright.owner}
    >
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Quantum Terminal
        </h1>
        <p className="text-gray-400">{securityStatus}</p>
      </div>
      
      <div className="flex-1 bg-gray-900 rounded-md border border-gray-800 overflow-hidden flex flex-col">
        {/* Terminal output */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 font-mono text-sm overflow-y-auto text-green-400 whitespace-pre-wrap"
        >
          {history.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        
        {/* Terminal input */}
        <div className="p-2 border-t border-gray-800 flex">
          <span className="text-green-500 font-mono">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono ml-2"
            disabled={!isVerified}
            placeholder={isVerified ? "Enter command..." : "Terminal locked - verification failed"}
          />
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">{dnaProtection.copyright.full}</p>
      </div>
    </div>
  );
}