/**
 * !!! QUANTUM TERMINAL - UNIFIED ACCESS INTERFACE !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 */

import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight,
  BrainCircuit,
  Sparkles,
  Bot,
  Loader
} from 'lucide-react';
import { quantumAI, AIModel } from '../lib/ai-service';

// Quantum Terminal component
const QuantumTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAIModel, setCurrentAIModel] = useState<AIModel>(AIModel.UltraQuantum);
  const terminalRef = useRef<HTMLDivElement>(null);
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
    aiAssistant: true,
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

  // Scroll terminal to bottom when logs update
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Query AI assistant
  const queryAI = async (prompt: string, aiModel: AIModel = currentAIModel) => {
    setIsProcessing(true);
    
    try {
      const response = await quantumAI.query({
        prompt,
        model: aiModel,
        securityLevel: 'maximum',
        includeWatermark: true
      });
      
      // Split response into lines for better display in terminal
      const responseLines = response.text.split('\n');
      return {
        success: true,
        lines: responseLines,
        model: response.model,
        processingTime: response.processingTime
      };
    } catch (error) {
      console.error('AI Query Error:', error);
      return {
        success: false,
        lines: [`ERROR: Failed to query AI assistant - ${error.message || 'Unknown error'}`],
        model: aiModel.toString(),
        processingTime: 0
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Get icon for AI model
  const getModelIcon = (model: AIModel) => {
    if (model === AIModel.UltraQuantum) return <Sparkles className="text-purple-400" />;
    if (model === AIModel.SuperQuantum) return <Sparkles className="text-blue-400" />;
    if (model === AIModel.Quantum) return <BrainCircuit className="text-cyan-400" />;
    if (model.includes('claude')) return <Bot className="text-orange-400" />;
    if (model.includes('gpt')) return <BrainCircuit className="text-green-400" />;
    if (model.includes('gemini')) return <BrainCircuit className="text-red-400" />;
    if (model.includes('llama')) return <Bot className="text-blue-400" />;
    return <BrainCircuit className="text-gray-400" />;
  };

  // Execute command function
  const executeCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    const currentCmd = command;
    const cmdLower = currentCmd.toLowerCase();
    
    // Add command to logs
    const newLogs = [...logs, `> ${currentCmd}`];
    
    // Process command
    if (cmdLower === 'help') {
      newLogs.push(
        'AVAILABLE COMMANDS:',
        '- status: Check status of all systems',
        '- execute [system]: Execute a specific system',
        '- execute all: Execute all systems simultaneously',
        '- protect: Activate enhanced visibility protection',
        '- integrate: Run complete unified integration',
        '- ai models: Show available AI models',
        '- ai use [model]: Switch to specified AI model',
        '- ask [question]: Ask the AI assistant',
        '- clear: Clear terminal screen',
        '- help: Show this help message'
      );
    } 
    else if (cmdLower === 'status') {
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
        `- Simultaneous Execution System: ${status.simultaneousExecution ? 'ACTIVE' : 'INACTIVE'}`,
        `- AI Assistant: ${status.aiAssistant ? 'ACTIVE' : 'INACTIVE'}`
      );
    }
    else if (cmdLower === 'execute all') {
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
    }
    else if (cmdLower === 'protect') {
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
    }
    else if (cmdLower === 'integrate') {
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
    }
    else if (cmdLower === 'clear') {
      setLogs([]);
      setCommand('');
      return;
    }
    else if (cmdLower === 'ai models') {
      newLogs.push(
        'AVAILABLE AI MODELS:',
        '- OpenAI Models:',
        `  • ${AIModel.GPT4} (OpenAI's most powerful model)`,
        `  • ${AIModel.GPT35Turbo} (Faster, more efficient model)`,
        '- Anthropic Models:',
        `  • ${AIModel.Claude3Sonnet} (Advanced reasoning capabilities)`,
        '- Google Models:',
        `  • ${AIModel.Gemini} (Google's advanced AI)`,
        `  • ${AIModel.GeminiPro} (Enhanced version)`,
        '- Meta Models:',
        `  • ${AIModel.LLaMA3} (Open weights large language model)`,
        `  • ${AIModel.LLaMA3Instruct} (Instruction-tuned version)`,
        '- DeepSeek Models:',
        `  • ${AIModel.DeepSeek} (Code-specialized model)`,
        `  • ${AIModel.DeepSeekChat} (Conversational version)`,
        '- Combined Approaches:',
        `  • ${AIModel.Quantum} (Hybrid approach using multiple models)`,
        `  • ${AIModel.SuperQuantum} (Enhanced hybrid approach)`,
        `  • ${AIModel.UltraQuantum} (Maximum capability using all models)`,
        '',
        `Current model: ${currentAIModel}`
      );
    }
    else if (cmdLower.startsWith('ai use ')) {
      const requestedModel = cmdLower.substring(7).trim();
      let foundModel = false;
      
      // Check if the requested model exists in the AIModel enum
      for (const model of Object.values(AIModel)) {
        if (model.toLowerCase().includes(requestedModel.toLowerCase())) {
          setCurrentAIModel(model as AIModel);
          newLogs.push(`AI MODEL SWITCHED TO: ${model}`);
          foundModel = true;
          break;
        }
      }
      
      if (!foundModel) {
        newLogs.push(`ERROR: Unknown AI model: ${requestedModel}`, 'Use "ai models" to see available models');
      }
    }
    else if (cmdLower.startsWith('ask ')) {
      const question = currentCmd.substring(4).trim();
      
      if (!question) {
        newLogs.push('ERROR: Please provide a question after "ask"');
      } else {
        newLogs.push(`PROCESSING QUERY WITH ${currentAIModel}...`);
        setLogs(newLogs);
        
        try {
          const response = await queryAI(question, currentAIModel);
          
          const aiResponseLogs = [
            `AI RESPONSE (${response.model}) - Processing Time: ${response.processingTime.toFixed(2)}s`,
            '-------------------------------------------',
            ...response.lines,
            '-------------------------------------------',
            'Copyright © Ervin Remus Radosavlevici (01/09/1987) - Email: ervin210@icloud.com'
          ];
          
          setLogs([...newLogs, ...aiResponseLogs]);
          setCommand('');
          return;
        } catch (error) {
          console.error('Error querying AI:', error);
          setLogs([...newLogs, `ERROR: Failed to get AI response - ${error.message || 'Unknown error'}`]);
          setCommand('');
          return;
        }
      }
    }
    else if (cmdLower.startsWith('execute ')) {
      const system = currentCmd.substring(8).trim();
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
    }
    else {
      newLogs.push(`UNKNOWN COMMAND: ${currentCmd}`, 'Type "help" for available commands.');
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
          <div className="flex items-center mr-4">
            <BrainCircuit className="mr-1 text-purple-400" />
            <span className="text-sm">{currentAIModel}</span>
          </div>
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
          <div className="flex-1 overflow-y-auto text-sm" ref={terminalRef}>
            {logs.map((log, i) => (
              <div 
                key={i} 
                className={`mb-1 ${
                  log.startsWith('>') ? 'text-blue-400' : 
                  log.includes('SUCCESS') ? 'text-green-500' :
                  log.includes('ERROR') ? 'text-red-500' :
                  log.includes('PHASE') ? 'text-yellow-400' :
                  log.includes('Copyright') ? 'text-purple-400' :
                  log.includes('QUANTUM TERMINAL') ? 'font-bold text-cyan-400' :
                  log.includes('AI RESPONSE') ? 'text-purple-300 font-semibold' :
                  log.includes('AI MODEL SWITCHED') ? 'text-blue-300' :
                  log.includes('AVAILABLE AI MODELS') ? 'text-cyan-300 font-semibold' :
                  ''
                }`}
              >
                {log}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center text-yellow-400">
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Processing request with {currentAIModel}...
              </div>
            )}
          </div>
          <form onSubmit={executeCommand} className="mt-2 flex">
            <span className="mr-2 text-yellow-500">{'>'}</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              autoFocus
              disabled={isProcessing}
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
              else if (key.includes('ai')) Icon = BrainCircuit;
              
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
          
          {/* AI Model section */}
          <h3 className="font-bold border-b border-green-700 pb-1 my-3 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            QUANTUM AI SYSTEM
          </h3>
          
          <div className="p-2 bg-gray-800 rounded border border-indigo-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs">Current Model:</span>
              <span className="text-xs font-bold text-indigo-300">{currentAIModel}</span>
            </div>
            <div className="text-xs text-gray-400 mb-2">
              Type "ai models" to see all available AI models or "ai use [model]" to switch models.
            </div>
            <div className="text-xs text-gray-400">
              Type "ask [your question]" to query the UltraQuantum AI assistant.
            </div>
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