/**
 * !!! QUANTUM TERMINAL - UNIFIED ACCESS INTERFACE !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 */

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Code, 
  Zap, 
  Server,
  Check,
  ArrowRight
} from 'lucide-react';

// Quantum Terminal component
const QuantumTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [status, setStatus] = useState<Record<string, boolean>>({
    systemIntegration: true,
    resetWorkflow: true,
    developmentEnabler: true,
    systemResetTube: true,
    restrictionRemoval: true,
    visibilityAnti: true,
    deploymentIntegration: true,
    integratedDeployment: true,
    parallelSequential: true,
    completeUnified: true,
    enhancedVisibility: true,
    simultaneousExecution: true,
  });

  // Add simulated terminal logs on load
  useEffect(() => {
    const initialLogs = [
      'QUANTUM TERMINAL v4.0 INITIALIZED',
      'Copyright © Ervin Remus Radosavlevici (01/09/1987)',
      'Email: ervin210@icloud.com - All Rights Reserved.',
      '-------------------------------------------',
      'ALL SYSTEMS ONLINE - MAXIMUM SECURITY ACTIVE',
      'SIMULTANEOUS EXECUTION SYSTEM: OPERATIONAL',
      'ENHANCED VISIBILITY PROTECTION: ACTIVE',
      'COMPLETE UNIFIED INTEGRATION: SUCCESSFUL',
      '-------------------------------------------',
      'Type "help" for available commands.'
    ];
    setLogs(initialLogs);
  }, []);

  // Execute command function
  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    const newLogs = [...logs, `> ${command}`];
    
    // Handle commands
    switch (command.toLowerCase()) {
      case 'help':
        newLogs.push(
          'AVAILABLE COMMANDS:',
          '- status: Check status of all systems',
          '- execute [system]: Execute a specific system',
          '- execute all: Execute all systems simultaneously',
          '- protect: Activate enhanced visibility protection',
          '- integrate: Run complete unified integration',
          '- clear: Clear terminal screen',
          '- help: Show this help message'
        );
        break;
      case 'status':
        newLogs.push(
          'SYSTEM STATUS:',
          `- System Integration Protocol: ${status.systemIntegration ? 'ACTIVE' : 'INACTIVE'}`,
          `- System Reset Workflow: ${status.resetWorkflow ? 'ACTIVE' : 'INACTIVE'}`,
          `- Development Enabler: ${status.developmentEnabler ? 'ACTIVE' : 'INACTIVE'}`,
          `- Complete System Reset Tube: ${status.systemResetTube ? 'ACTIVE' : 'INACTIVE'}`,
          `- Restriction Removal Prevention: ${status.restrictionRemoval ? 'ACTIVE' : 'INACTIVE'}`,
          `- Visibility Anti-Monitoring: ${status.visibilityAnti ? 'ACTIVE' : 'INACTIVE'}`,
          `- Deployment Integration: ${status.deploymentIntegration ? 'ACTIVE' : 'INACTIVE'}`,
          `- Integrated Deployment System: ${status.integratedDeployment ? 'ACTIVE' : 'INACTIVE'}`,
          `- Parallel-Sequential Integration: ${status.parallelSequential ? 'ACTIVE' : 'INACTIVE'}`,
          `- Complete Unified Integration: ${status.completeUnified ? 'ACTIVE' : 'INACTIVE'}`,
          `- Enhanced Visibility Protection: ${status.enhancedVisibility ? 'ACTIVE' : 'INACTIVE'}`,
          `- Simultaneous Execution System: ${status.simultaneousExecution ? 'ACTIVE' : 'INACTIVE'}`
        );
        break;
      case 'execute all':
        newLogs.push(
          'EXECUTING ALL SYSTEMS SIMULTANEOUSLY...',
          'SYNCHRONIZATION PHASE 1: COMPONENT PREPARATION...',
          'SYNCHRONIZATION PHASE 2: SYSTEM SYNCHRONIZATION...',
          'SYNCHRONIZATION PHASE 3: SIMULTANEOUS EXECUTION...',
          'ALL COMPONENTS EXECUTED SUCCESSFULLY',
          'SYNCHRONIZATION PHASE 4: CONTINUOUS OPERATION...',
          'SYNCHRONIZATION PHASE 5: FINAL SYNCHRONIZATION...',
          'SUCCESS - SIMULTANEOUS EXECUTION SYSTEM COMPLETED'
        );
        // Set all systems to active
        setStatus(Object.fromEntries(Object.keys(status).map(key => [key, true])));
        break;
      case 'protect':
        newLogs.push(
          'INITIATING ENHANCED VISIBILITY PROTECTION SEQUENCE...',
          'INVISIBILITY PHASE 1: TOTAL VISIBILITY ASSESSMENT...',
          'INVISIBILITY PHASE 2: MAXIMUM OBFUSCATION IMPLEMENTATION...',
          'INVISIBILITY PHASE 3: ANTI-VIEW TECHNOLOGY ACTIVATION...',
          'INVISIBILITY PHASE 4: COMPLETE SIGHT PREVENTION...',
          'INVISIBILITY PHASE 5: FINAL INVISIBILITY ASSURANCE...',
          'SUCCESS - ENHANCED VISIBILITY PROTECTION COMPLETED'
        );
        setStatus({...status, enhancedVisibility: true});
        break;
      case 'integrate':
        newLogs.push(
          'INITIATING COMPLETE UNIFIED INTEGRATION SEQUENCE...',
          'INTEGRATION PHASE 1: COMPONENT IDENTIFICATION...',
          'INTEGRATION PHASE 2: COMPONENT UNIFICATION...',
          'INTEGRATION PHASE 3: SYSTEM INTEGRATION...',
          'INTEGRATION PHASE 4: MASTER CONTROL ESTABLISHMENT...',
          'INTEGRATION PHASE 5: FINAL INTEGRATION CONFIRMATION...',
          'SUCCESS - COMPLETE UNIFIED INTEGRATION COMPLETED'
        );
        setStatus({...status, completeUnified: true});
        break;
      case 'clear':
        newLogs.length = 0;
        break;
      default:
        if (command.toLowerCase().startsWith('execute ')) {
          const system = command.substring(8).trim();
          newLogs.push(`EXECUTING: ${system}...`, `${system.toUpperCase()} EXECUTION COMPLETE`);
          
          // Update status for the specific system if it exists
          const systemKey = Object.keys(status).find(
            key => key.toLowerCase() === system.toLowerCase() || 
                  key.toLowerCase().includes(system.toLowerCase())
          );
          
          if (systemKey) {
            setStatus({...status, [systemKey]: true});
          } else {
            newLogs.push(`SYSTEM NOT FOUND: ${system}`);
          }
        } else {
          newLogs.push(`UNKNOWN COMMAND: ${command}`, 'Type "help" for available commands.');
        }
        break;
    }
    
    setLogs(newLogs);
    setCommand('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-green-400 p-4 font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-green-700 pb-2">
        <div className="flex items-center">
          <Terminal className="mr-2" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            QUANTUM TERMINAL v4.0
          </h1>
        </div>
        <div className="flex items-center">
          <Shield className="mr-1 text-red-500" />
          <span className="mr-4 text-sm">MAXIMUM SECURITY</span>
          <Lock className="mr-1 text-yellow-500" />
          <span className="text-sm">DNA PROTECTED</span>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 gap-4">
        {/* Terminal */}
        <div className="flex-1 bg-gray-900 rounded-md border border-green-700 p-2 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto text-sm">
            {logs.map((log, i) => (
              <div 
                key={i} 
                className={`mb-1 ${log.startsWith('>') ? 'text-blue-400' : 
                               log.includes('SUCCESS') ? 'text-green-500' :
                               log.includes('ERROR') ? 'text-red-500' :
                               log.includes('PHASE') ? 'text-yellow-400' :
                               log.includes('Copyright') ? 'text-purple-400' :
                               log.includes('QUANTUM TERMINAL') ? 'font-bold text-cyan-400' :
                               ''}`}
              >
                {log}
              </div>
            ))}
          </div>
          <form onSubmit={executeCommand} className="mt-2 flex">
            <span className="mr-2 text-yellow-500">{'>'}</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              autoFocus
            />
          </form>
        </div>
        
        {/* Status panel */}
        <div className="w-72 bg-gray-900 rounded-md border border-green-700 p-2 text-sm overflow-y-auto">
          <h2 className="font-bold border-b border-green-700 pb-1 mb-2 text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            SYSTEM STATUS
          </h2>
          
          <div className="space-y-2">
            {Object.entries(status).map(([key, active]) => {
              // Format the key with spaces and proper capitalization
              const formattedKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
              
              // Select icon based on key
              let Icon = active ? Check : ArrowRight;
              if (key.includes('visibility')) Icon = active ? Eye : EyeOff;
              else if (key.includes('reset')) Icon = RefreshCw;
              else if (key.includes('Integration')) Icon = Zap;
              else if (key.includes('development')) Icon = Code;
              else if (key.includes('deployment')) Icon = Server;
              
              return (
                <div 
                  key={key} 
                  className={`flex items-center justify-between p-1 rounded ${
                    active ? 'bg-green-900/30' : 'bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`mr-2 h-4 w-4 ${active ? 'text-green-500' : 'text-gray-500'}`} />
                    <span>{formattedKey}</span>
                  </div>
                  <span className={active ? 'text-green-500' : 'text-gray-500'}>
                    {active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-4 text-xs text-center border-t border-green-700 pt-2">
        <p>Copyright © Ervin Remus Radosavlevici (01/09/1987) - Email: ervin210@icloud.com - All Rights Reserved.</p>
        <p className="text-red-500 mt-1">
          ANTI-THEFT PROTECTION ACTIVE - DNA PROTECTED - UNAUTHORIZED COPYING WILL TRIGGER SECURITY MEASURES
        </p>
      </div>
    </div>
  );
};

export default QuantumTerminal;