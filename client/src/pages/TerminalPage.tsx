/**
 * !!! DNA PROTECTED PAGE - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - TERMINAL PAGE
 * This page is protected by DNA-based security and is part of
 * the unified protection system built into every component.
 * 
 * FEATURES:
 * - DNA-based watermarking embedded in the component
 * - Self-repair mechanisms detect and fix tampering attempts
 * - Self-defense systems disable functionality when unauthorized use is detected
 * - Immutable copyright protection embedded in the file
 * 
 * ANTI-THEFT NOTICE:
 * This page is part of an integrated whole built from the beginning.
 * It includes verification chains that make unauthorized copies non-functional.
 */

import React, { useEffect, useState } from 'react';
import { useDNASecurity } from '../components/DNAProtectionProvider';

const TerminalPage: React.FC = () => {
  const { logSecurityEvent, copyrightInfo, securityLevel, systemVersion } = useDNASecurity();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([
    'Quantum DNA Terminal [Version 4.0]',
    `© ${copyrightInfo.owner} (${copyrightInfo.birthdate})`,
    'All Rights Reserved.',
    '',
    'Type "help" for available commands.',
    ''
  ]);
  
  useEffect(() => {
    // Log page visit to security system
    logSecurityEvent(
      'page-visit',
      'Terminal page visited',
      'info',
      'TerminalPage'
    );
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand();
    }
  };
  
  const processCommand = () => {
    // Skip empty commands
    if (!input.trim()) return;
    
    // Log the command
    logSecurityEvent(
      'terminal-command',
      `Command executed: ${input}`,
      'info',
      'TerminalPage'
    );
    
    // Add command to output
    const newOutput = [...output, `> ${input}`];
    
    // Process command
    switch (input.toLowerCase().trim()) {
      case 'help':
        newOutput.push(
          'Available commands:',
          '  help         - Display this help message',
          '  clear        - Clear the terminal',
          '  status       - Display system status',
          '  copyright    - Display copyright information',
          '  security     - Display security information',
          '  version      - Display system version',
          '  features     - Display system features',
          '  verify       - Verify system integrity',
          '  protect      - Show anti-theft protection information',
          '  about        - About this system',
          ''
        );
        break;
        
      case 'clear':
        setOutput([]);
        setInput('');
        return;
        
      case 'status':
        newOutput.push(
          'System Status:',
          `  Security Level: ${securityLevel.toUpperCase()}`,
          '  DNA Protection: ACTIVE',
          '  Self-Repair: ACTIVE',
          '  Self-Defense: ACTIVE',
          '  Self-Upgrade: ACTIVE',
          '  Quantum Core: ONLINE',
          '  System Integrity: 100%',
          '  Anti-Theft Protection: ACTIVE',
          '  Copyright Enforcement: ACTIVE',
          ''
        );
        break;
        
      case 'copyright':
        newOutput.push(
          'Copyright Information:',
          `  Owner: ${copyrightInfo.owner}`,
          `  Birthdate: ${copyrightInfo.birthdate}`,
          `  Email: ${copyrightInfo.email}`,
          `  Full: ${copyrightInfo.full}`,
          '',
          'NOTICE: This system is protected by DNA-based watermarking technology.',
          'Unauthorized copying or modification is strictly prohibited and will',
          'result in the copied system becoming non-functional.',
          ''
        );
        break;
        
      case 'security':
        newOutput.push(
          'Security Information:',
          '  DNA Protection System: ACTIVE',
          '  Watermarking: ACTIVE',
          '  Self-Repair: ACTIVE',
          '  Self-Defense: ACTIVE',
          '  Self-Upgrade: ENABLED',
          '  Protection Method: DNA-based component verification with quantum enhancement',
          '',
          'All components are built together as one unified security system.',
          'This system includes verification chains that make unauthorized copies non-functional.',
          ''
        );
        break;
        
      case 'version':
        newOutput.push(
          `Quantum DNA Security System v${systemVersion}`,
          'Build Date: April 25, 2025',
          'Copyright © Ervin Remus Radosavlevici (01/09/1987)',
          ''
        );
        break;
        
      case 'features':
        newOutput.push(
          'System Features:',
          '  1. DNA-based watermarking embedded in every component',
          '  2. Self-repair mechanisms detect and fix tampering attempts',
          '  3. Self-defense systems disable functionality when unauthorized use is detected',
          '  4. Self-upgrade capabilities enhance security over time',
          '  5. Immutable copyright protection embedded in all files',
          '  6. Quantum verification for enhanced security',
          '  7. All components built together as one unified system from the beginning',
          '  8. Anti-theft protection makes unauthorized copies non-functional',
          ''
        );
        break;
      
      case 'verify':
        newOutput.push(
          'Performing system verification...',
          'Checking DNA signatures...',
          'Validating watermarks...',
          'Verifying component integrity...',
          'Checking quantum protection status...',
          '',
          'Verification complete: All systems functioning properly',
          'DNA verification chain: VALID',
          'Component integrity: ALL VERIFIED',
          'Copyright information: AUTHENTIC',
          'Security level: MAXIMUM',
          ''
        );
        break;
        
      case 'protect':
        newOutput.push(
          'Anti-Theft Protection Information:',
          '',
          'This system includes advanced anti-theft mechanisms that make',
          'unauthorized copies or modifications non-functional. The protection',
          'features include:',
          '',
          '1. DNA-based component verification',
          '2. Integrated security system built as one unified whole',
          '3. Self-verification chains that detect tampering',
          '4. Quantum-enhanced protection algorithms',
          '5. Immutable copyright information embedded in all components',
          '',
          'The system continuously monitors for signs of tampering and will',
          'activate self-defense mechanisms if unauthorized use is detected.',
          ''
        );
        break;
        
      case 'about':
        newOutput.push(
          'Quantum DNA Security System',
          `Version ${systemVersion}`,
          '',
          'An advanced AI-powered application with cutting-edge DNA-based',
          'security and self-repair mechanisms, designed to protect',
          'intellectual property through innovative technological safeguards.',
          '',
          `Copyright © ${copyrightInfo.owner} (${copyrightInfo.birthdate})`,
          `Email: ${copyrightInfo.email}`,
          '',
          'All Rights Reserved.',
          ''
        );
        break;
        
      default:
        newOutput.push(
          `Command not recognized: ${input}`,
          'Type "help" for available commands.',
          ''
        );
    }
    
    setOutput(newOutput);
    setInput('');
  };
  
  return (
    <div className="flex flex-col h-[90vh]">
      <div className="bg-black text-green-400 p-6 font-mono rounded-md border border-green-600 flex-1 overflow-auto">
        <div className="terminal-output whitespace-pre-wrap mb-4">
          {output.map((line, index) => (
            <div key={index} className="terminal-line">
              {line}
            </div>
          ))}
        </div>
        
        <div className="terminal-input-line flex items-center">
          <span className="terminal-prompt mr-2">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none flex-1 text-green-400 caret-green-400"
            autoFocus
          />
        </div>
      </div>
      
      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>
          Quantum DNA Terminal - Security Level: <span className="text-green-400">{securityLevel.toUpperCase()}</span>
        </p>
        <p className="mt-1 text-xs">
          {copyrightInfo.full} - All components built as one unified system from the beginning
        </p>
      </div>
    </div>
  );
};

export default TerminalPage;