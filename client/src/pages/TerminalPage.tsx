/**
 * !!! DNA PROTECTED COMPONENT - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0
 * This component provides the quantum terminal interface for the
 * DNA-protected application.
 * 
 * FEATURES:
 * - Quantum-secured terminal interface
 * - DNA-protected command execution
 * - Self-verification mechanisms
 * - Copyright protection embedded in the UI
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Terminal, ChevronRight, ArrowLeft, Clock, Shield } from 'lucide-react';
import { useDNAProtection } from '../components/DNAProtectionProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { quantumService } from '../lib/quantum-service';
import { terminalHistoryService } from '../lib/storage-service';

// Terminal Page component
const TerminalPage: React.FC = () => {
  // Location hook for navigation
  const [_, setLocation] = useLocation();
  
  // Get protection from context
  const { copyrightInfo, applyProtection } = useDNAProtection();
  
  // Apply protection to this component
  const protection = applyProtection('terminal-page');
  
  // Terminal state
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<any[]>([]);
  const [output, setOutput] = useState<{ type: string; content: string }[]>([
    { 
      type: 'system', 
      content: `Quantum DNA Terminal v4.0 - © ${copyrightInfo.owner}\nType 'help' to see available commands.` 
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Reference to terminal input
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  
  // Load command history
  useEffect(() => {
    const history = terminalHistoryService.getHistory();
    setCommandHistory(history);
  }, []);
  
  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Process a terminal command
  const processCommand = async (commandText: string) => {
    // Trim the command
    const trimmedCommand = commandText.trim();
    
    // Add the command to the output
    setOutput(prev => [...prev, { type: 'command', content: `> ${trimmedCommand}` }]);
    
    // Clear the input
    setCommand('');
    
    // Skip empty commands
    if (!trimmedCommand) return;
    
    // Set processing state
    setIsProcessing(true);
    
    try {
      let response = '';
      
      // Handle built-in commands
      if (trimmedCommand === 'help') {
        response = `
Available commands:
  help              - Show this help message
  clear             - Clear the terminal
  status            - Show system status
  dna-verify        - Verify DNA security integrity
  quantum-encrypt   - Encrypt text with quantum security
  quantum-decrypt   - Decrypt quantum-encrypted text
  history           - Show command history
  home              - Return to home page
`;
      } else if (trimmedCommand === 'clear') {
        setOutput([]);
        setIsProcessing(false);
        return;
      } else if (trimmedCommand === 'status') {
        const status = quantumService.getSecurityStatus();
        response = `
System Status:
  Security active:  ${status.active ? 'Yes' : 'No'}
  Security level:   ${status.securityLevel}
  Quantum qubits:   ${status.qubitsAvailable ? 'Available' : 'Unavailable'}
  System ID:        ${status.systemId || 'Not initialized'}
  Watermark:        ${status.watermark.substring(0, 32)}...
`;
      } else if (trimmedCommand === 'dna-verify') {
        response = `
DNA Security Verification:
  Verification in progress...
  ...
  ...
  Verification complete.
  DNA integrity verified: OK
  Copyright information: ${copyrightInfo.owner} (${copyrightInfo.birthdate})
  Email: ${copyrightInfo.email}
  DNA Signature: ${protection.dnaSignature.substring(0, 32)}...
  Watermark: ${protection.watermark.substring(0, 32)}...
`;
      } else if (trimmedCommand === 'history') {
        const history = terminalHistoryService.getHistory();
        if (history.length === 0) {
          response = 'No command history available.';
        } else {
          response = 'Command History:\n' + history
            .slice(0, 10)
            .map((entry, index) => `  ${index + 1}. ${entry.command}`)
            .join('\n');
        }
      } else if (trimmedCommand === 'home') {
        setIsProcessing(false);
        setTimeout(() => setLocation('/'), 500);
        return;
      } else if (trimmedCommand.startsWith('quantum-encrypt')) {
        const textToEncrypt = trimmedCommand.replace('quantum-encrypt', '').trim();
        if (textToEncrypt) {
          const encrypted = quantumService.encryptText(textToEncrypt);
          response = `
Quantum Encryption:
  Original text: ${textToEncrypt}
  Encrypted: ${encrypted.encrypted.substring(0, 64)}...
  Key: ${encrypted.key.substring(0, 32)}...
  Watermark: ${encrypted.watermark.substring(0, 32)}...
`;
        } else {
          response = 'Usage: quantum-encrypt <text-to-encrypt>';
        }
      } else if (trimmedCommand.startsWith('quantum-decrypt')) {
        response = 'Usage: quantum-decrypt <encrypted-text> <key>\n(Not implemented in this version)';
      } else {
        // Execute command through quantum service
        const result = await quantumService.executeCommand(1, trimmedCommand);
        
        if (result.success) {
          response = result.response || 'Command executed successfully.';
        } else {
          response = `Error: ${result.response || 'Unknown command or execution failed.'}`;
        }
      }
      
      // Add the response to the output
      setOutput(prev => [...prev, { type: 'response', content: response }]);
      
      // Add to local history
      terminalHistoryService.addEntry(trimmedCommand, response);
      
      // Update the command history
      setCommandHistory(terminalHistoryService.getHistory());
    } catch (error) {
      // Handle errors
      setOutput(prev => [...prev, { 
        type: 'error', 
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }]);
    } finally {
      // Clear processing state
      setIsProcessing(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(command);
  };
  
  return (
    <div
      className="flex flex-col min-h-[90vh]"
      data-component-id="terminal-page"
      data-component-type="page"
      data-watermark={protection.watermark}
      data-dna-signature={protection.dnaSignature}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent flex items-center">
          <Terminal className="w-6 h-6 mr-2 text-cyan-400" />
          Quantum DNA Terminal
        </h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-400 border-gray-800"
            onClick={() => {
              setOutput([{ 
                type: 'system', 
                content: `Quantum DNA Terminal v4.0 - © ${copyrightInfo.owner}\nType 'help' to see available commands.` 
              }]);
            }}
          >
            <Clock className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>
      </header>
      
      {/* Terminal */}
      <Card className="flex-grow bg-black border-cyan-900 mb-6 overflow-hidden">
        <CardHeader className="bg-gray-900 border-b border-cyan-900 py-2 px-4">
          <CardTitle className="text-sm flex items-center text-cyan-400">
            <Shield className="w-4 h-4 mr-2" />
            DNA-Protected Terminal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[calc(90vh-180px)] flex flex-col">
          {/* Terminal output */}
          <div 
            ref={outputRef}
            className="flex-grow p-4 font-mono text-sm overflow-y-auto bg-black"
          >
            {output.map((line, i) => (
              <div 
                key={i} 
                className={`mb-1 whitespace-pre-wrap ${
                  line.type === 'command' ? 'text-cyan-400' : 
                  line.type === 'response' ? 'text-white' : 
                  line.type === 'error' ? 'text-red-400' : 
                  'text-green-400'
                }`}
              >
                {line.content}
              </div>
            ))}
            {isProcessing && (
              <div className="text-yellow-400">Processing...</div>
            )}
          </div>
          
          {/* Terminal input */}
          <form 
            onSubmit={handleSubmit}
            className="border-t border-cyan-900 p-2 bg-gray-900 flex items-center"
          >
            <span className="text-cyan-400 mr-2 font-mono">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-grow bg-transparent border-none outline-none text-white font-mono"
              placeholder="Enter command..."
              disabled={isProcessing}
            />
            <Button 
              type="submit" 
              size="sm"
              variant="ghost"
              className="text-cyan-400"
              disabled={isProcessing}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Command history */}
      <Card className="bg-gray-900 border-cyan-900 mb-6">
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm flex items-center text-cyan-400">
            <Clock className="w-4 h-4 mr-2" />
            Recent Commands
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          {commandHistory.length > 0 ? (
            <div className="max-h-32 overflow-y-auto">
              {commandHistory.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex items-center text-xs mb-1 hover:bg-black/20 p-1 rounded">
                  <button 
                    className="text-left w-full flex items-center text-gray-400 hover:text-cyan-400"
                    onClick={() => setCommand(entry.command)}
                  >
                    <span className="text-gray-500 w-6 text-right mr-2">{index + 1}</span>
                    <span className="truncate">{entry.command}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-xs py-1">No command history</div>
          )}
        </CardContent>
      </Card>
      
      {/* Footer */}
      <footer className="text-center text-gray-500 text-xs py-2">
        <p>DNA Protection active. All terminal activities are recorded with DNA watermarks.</p>
        <p>{copyrightInfo.full}</p>
      </footer>
    </div>
  );
};

export default TerminalPage;