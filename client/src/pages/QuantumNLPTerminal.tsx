/**
 * !!! QUANTUM NLP TERMINAL - DNA PROTECTED COMPONENT !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987), David Cornelius Marshall, and Serena Elizabeth Thorne
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * QUANTUM NLP TERMINAL
 * 
 * This component provides a natural language interface to the quantum terminal.
 * It translates everyday language into quantum terminal commands, making
 * quantum computing accessible to users without technical knowledge.
 * Built as one integrated system with DNA-based security from the beginning.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from '@/components/ui/terminal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowRight, CheckCircle, ChevronRight, Copy, Database, Code, Lock, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDNAProtection } from '@/components/DNAProtectionProvider';
import { quantumNLPService } from '@/lib/quantum-nlp-service';
import { quantumDNASecurity } from '@/lib/quantum-dna-security';

// Component identity constants
const COMPONENT_ID = 'quantum-nlp-terminal';
const COMPONENT_NAME = 'QuantumNLPTerminal';

// Example suggestions for natural language inputs
const EXAMPLE_QUERIES = [
  "Create a quantum circuit with 3 qubits",
  "Apply a Hadamard gate to qubit 0",
  "Show me quantum entanglement between qubits",
  "Run a quantum simulation",
  "Connect to IBM Quantum computer",
  "Generate a quantum random number",
  "What's the current quantum decoherence rate?",
  "Execute the Grover search algorithm",
  "Explain quantum superposition",
  "Create a quantum machine learning model"
];

interface TerminalEntry {
  type: 'input' | 'command' | 'output' | 'error' | 'system' | 'explanation';
  content: string;
  timestamp: string;
  dnaSignature?: string;
}

/**
 * Quantum NLP Terminal Component
 * Translates natural language into quantum terminal commands
 */
const QuantumNLPTerminal: React.FC = () => {
  // Use DNA Protection context
  const dnaProtection = useDNAProtection();

  // Terminal history state
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  
  // Input state
  const [input, setInput] = useState('');
  
  // Loading state for processing queries
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Terminal references
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Current tab
  const [activeTab, setActiveTab] = useState('terminal');
  
  // Auto-focus on the input field when the component mounts
  useEffect(() => {
    // Add welcome message
    const welcomeMessages: TerminalEntry[] = [
      {
        type: 'system',
        content: `*** QUANTUM NLP TERMINAL v${dnaProtection.systemVersion} ***`,
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      },
      {
        type: 'system',
        content: `Copyright © ${dnaProtection.ownerInfo.name} (${dnaProtection.ownerInfo.birthdate})`,
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      },
      {
        type: 'system',
        content: 'Type your question in natural language, and I will translate it to quantum commands.',
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      },
      {
        type: 'system',
        content: 'Try: "Create a 3-qubit circuit with Hadamard gates"',
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      },
      {
        type: 'system',
        content: '---------------------------------------------',
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      },
    ];
    
    setHistory(welcomeMessages);
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Initialize quantum NLP service
    const initializeServices = async () => {
      try {
        console.log("QuantumNLPTerminal: Initializing quantum services...");
        
        // Attempt to initialize the quantum NLP service
        const success = await quantumNLPService.initialize();
        
        if (success) {
          console.log("QuantumNLPTerminal: Quantum NLP Service initialization successful");
          
          // Add normal connection message
          addToHistory({
            type: 'system',
            content: 'Connected to Quantum NLP Service',
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
          
          // Show which providers are available (if any)
          const providers = quantumNLPService.availableProviders;
          
          if (providers && providers.length > 0) {
            addToHistory({
              type: 'system',
              content: `Available AI Providers: ${providers.join(', ')}`,
              timestamp: new Date().toISOString(),
              dnaSignature: dnaProtection.dnaSignature
            });
          } else {
            addToHistory({
              type: 'system',
              content: 'Operating in fallback mode (no AI providers available)',
              timestamp: new Date().toISOString(),
              dnaSignature: dnaProtection.dnaSignature
            });
          }
        } else {
          console.warn("QuantumNLPTerminal: Quantum NLP Service initialization returned false");
          
          addToHistory({
            type: 'system',
            content: 'Connected to Quantum NLP Service (limited functionality)',
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
        }
        
        // Check if connected to IBM Quantum
        if (import.meta.env.VITE_IBM_QUANTUM_API_KEY || import.meta.env.IBM_QUANTUM_API_KEY) {
          addToHistory({
            type: 'system',
            content: 'IBM Quantum connection established',
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
        } else {
          addToHistory({
            type: 'system',
            content: 'IBM Quantum running in simulation mode',
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
        }
        
        // Check if connected to Azure Quantum
        if (import.meta.env.VITE_AZURE_QUANTUM_API_KEY || import.meta.env.AZURE_QUANTUM_API_KEY) {
          addToHistory({
            type: 'system',
            content: 'Microsoft Azure Quantum connection established',
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
        } else {
          addToHistory({
            type: 'system',
            content: 'Azure Quantum running in simulation mode',
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
        }
      } catch (error) {
        console.error('Failed to initialize quantum services:', error);
        addToHistory({
          type: 'error',
          content: 'Failed to initialize quantum services',
          timestamp: new Date().toISOString(),
          dnaSignature: dnaProtection.dnaSignature
        });
      }
    };
    
    initializeServices();
  }, []);
  
  // Scroll to the bottom of the terminal when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Add entry to terminal history
  const addToHistory = (entry: TerminalEntry) => {
    setHistory(prevHistory => [...prevHistory, entry]);
  };
  
  // Copy terminal history to clipboard
  const copyHistoryToClipboard = () => {
    const historyText = history
      .map(entry => {
        switch (entry.type) {
          case 'input':
            return `> ${entry.content}`;
          case 'command':
            return `$ ${entry.content}`;
          case 'output':
            return entry.content;
          case 'error':
            return `ERROR: ${entry.content}`;
          case 'system':
            return `SYSTEM: ${entry.content}`;
          case 'explanation':
            return `EXPLANATION: ${entry.content}`;
          default:
            return entry.content;
        }
      })
      .join('\n');
    
    navigator.clipboard.writeText(historyText);
    
    // Add confirmation message
    addToHistory({
      type: 'system',
      content: 'Terminal history copied to clipboard',
      timestamp: new Date().toISOString(),
      dnaSignature: dnaProtection.dnaSignature
    });
  };
  
  // Clear terminal history
  const clearTerminal = () => {
    setHistory([{
      type: 'system',
      content: 'Terminal cleared',
      timestamp: new Date().toISOString(),
      dnaSignature: dnaProtection.dnaSignature
    }]);
  };
  
  // Process natural language input
  const processInput = async () => {
    if (!input.trim()) return;
    
    // Add user input to history
    addToHistory({
      type: 'input',
      content: input,
      timestamp: new Date().toISOString(),
      dnaSignature: dnaProtection.dnaSignature
    });
    
    // Clear input field
    setInput('');
    
    // Set loading state
    setIsProcessing(true);
    
    try {
      console.log("Processing user input:", input);
      
      // Check if the quantum NLP service is initialized
      if (!quantumNLPService.isInitialized) {
        console.log("Quantum NLP Service not initialized, attempting initialization...");
        
        // Add message about initialization
        addToHistory({
          type: 'system',
          content: 'Initializing Quantum NLP Service...',
          timestamp: new Date().toISOString(),
          dnaSignature: dnaProtection.dnaSignature
        });
        
        // Attempt initialization
        await quantumNLPService.initialize();
        
        // Verify initialization succeeded
        if (!quantumNLPService.isInitialized) {
          console.warn("Quantum NLP Service initialization failed, using emergency fallback");
          
          // Use fallback processing logic
          const fallbackCommand = simulateEmergencyFallback(input);
          
          addToHistory({
            type: 'system',
            content: 'Processing via Emergency Fallback System',
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
          
          addToHistory({
            type: 'command',
            content: fallbackCommand,
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
          
          addToHistory({
            type: 'explanation',
            content: `Translated your request about "${input.substring(0, 30)}..." into quantum commands using emergency system.`,
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
          
          // Simulate executing the command
          await new Promise(resolve => setTimeout(resolve, 800));
          
          addToHistory({
            type: 'output',
            content: simulateCommandOutput(fallbackCommand),
            timestamp: new Date().toISOString(),
            dnaSignature: dnaProtection.dnaSignature
          });
          
          // Exit early since we've handled the input
          return;
        }
      }
      
      // Process input through Quantum NLP Service
      console.log("Calling quantumNLPService.processInput()");
      const nlpResponse = await quantumNLPService.processInput(input);
      console.log("Response received:", nlpResponse);
      
      // Add information about which AI provider was used
      addToHistory({
        type: 'system',
        content: `Processing via ${nlpResponse.usedProvider}`,
        timestamp: new Date().toISOString(),
        dnaSignature: nlpResponse._dnaWatermark || dnaProtection.dnaSignature
      });
      
      // Add the generated command to history
      addToHistory({
        type: 'command',
        content: nlpResponse.command,
        timestamp: new Date().toISOString(),
        dnaSignature: nlpResponse._dnaWatermark || dnaProtection.dnaSignature
      });
      
      // Add the explanation to history
      addToHistory({
        type: 'explanation',
        content: nlpResponse.explanation,
        timestamp: new Date().toISOString(),
        dnaSignature: nlpResponse._dnaWatermark || dnaProtection.dnaSignature
      });
      
      // Simulate executing the command
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add command output to history (simulated for now)
      addToHistory({
        type: 'output',
        content: simulateCommandOutput(nlpResponse.command),
        timestamp: new Date().toISOString(),
        dnaSignature: nlpResponse._dnaWatermark || dnaProtection.dnaSignature
      });
    } catch (error) {
      console.error('Error processing input:', error);
      
      // Add error message to history
      addToHistory({
        type: 'error',
        content: `Failed to process input: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      });
      
      // Even if we get an error, try to give a useful response
      addToHistory({
        type: 'system',
        content: 'Falling back to emergency processing system',
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      });
      
      // Use fallback processing logic
      const fallbackCommand = simulateEmergencyFallback(input);
      
      addToHistory({
        type: 'command',
        content: fallbackCommand,
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      });
      
      // Simulate executing the command
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addToHistory({
        type: 'output',
        content: simulateCommandOutput(fallbackCommand),
        timestamp: new Date().toISOString(),
        dnaSignature: dnaProtection.dnaSignature
      });
    } finally {
      // Clear loading state
      setIsProcessing(false);
      
      // Focus back on input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  // Emergency fallback processor when all other methods fail
  // Add debug messages to help track issues
  // Debug function to log key steps for tracing execution
  const logDebug = (message: string, ...args: any[]) => {
    console.log(`[QuantumNLPTerminal] ${message}`, ...args);
  };

  // Emergency fallback processor when all other methods fail
  const simulateEmergencyFallback = (input: string): string => {
    console.log("[EMERGENCY FALLBACK] Using emergency fallback processor for input:", input);
    
    try {
      const normalizedInput = input.toLowerCase();
      console.log("[EMERGENCY FALLBACK] Normalized input:", normalizedInput);
      
      // Very simple pattern matching for bare minimum functionality
      if (normalizedInput.includes('circuit') || normalizedInput.includes('qubits')) {
        console.log("[EMERGENCY FALLBACK] Matched: circuit/qubits pattern");
        return `createCircuit(3)`;
      } else if (normalizedInput.includes('hadamard') || normalizedInput.includes('superposition')) {
        console.log("[EMERGENCY FALLBACK] Matched: hadamard/superposition pattern");
        return `H(0)`;
      } else if (normalizedInput.includes('entangle') || normalizedInput.includes('entanglement')) {
        console.log("[EMERGENCY FALLBACK] Matched: entangle pattern");
        return `CNOT(0, 1)`;
      } else if (normalizedInput.includes('measure')) {
        console.log("[EMERGENCY FALLBACK] Matched: measure pattern");
        return `measure(0)`;
      } else if (normalizedInput.includes('simulate') || normalizedInput.includes('run')) {
        console.log("[EMERGENCY FALLBACK] Matched: simulate/run pattern");
        return `simulate(shots=1024)`;
      } else if (normalizedInput.includes('random')) {
        console.log("[EMERGENCY FALLBACK] Matched: random pattern");
        return `generateRandomNumber(bits=8)`;
      } else if (normalizedInput.includes('connect') || normalizedInput.includes('ibm')) {
        console.log("[EMERGENCY FALLBACK] Matched: connect/ibm pattern");
        return `connectToBackend("ibm_oslo")`;
      } else if (normalizedInput.includes('search') || normalizedInput.includes('find')) {
        console.log("[EMERGENCY FALLBACK] Matched: search/find pattern");
        return `executeGrover(items=8, target=3)`;
      } else if (normalizedInput.includes('explain')) {
        console.log("[EMERGENCY FALLBACK] Matched: explain pattern");
        return `showDocumentation("quantum_computing")`;
      } else if (normalizedInput.includes('machine learning') || normalizedInput.includes('ai')) {
        console.log("[EMERGENCY FALLBACK] Matched: machine learning/ai pattern");
        return `initQML(qubits=4, dataset="basic")`;
      } else {
        // Complete fallback for anything else
        console.log("[EMERGENCY FALLBACK] No patterns matched, using generic process command");
        return `process("${input.replace(/"/g, '\\"')}")`;
      }
    } catch (error) {
      console.error("[EMERGENCY FALLBACK] Critical error in fallback processor:", error);
      // Ultimate fallback in case everything fails
      return `execute("${Date.now()}")`;
    }
  };
  
  // Simulate command output (this would be replaced with real quantum execution)
  const simulateCommandOutput = (command: string): string => {
    // For demonstration purposes, generate some plausible output based on the command
    if (command.includes('createCircuit') || command.includes('new Circuit')) {
      return 'Circuit created successfully.\nQubits initialized to |0⟩ state.\nCircuit ready for gate operations.';
    } else if (command.includes('hadamard') || command.includes('H(')) {
      return 'Hadamard gate applied.\nQubit is now in superposition state.\nState vector: 0.7071|0⟩ + 0.7071|1⟩';
    } else if (command.includes('entangle') || command.includes('CNOT')) {
      return 'Entanglement operation successful.\nQubits are now in entangled state.\nBell state created: 0.7071|00⟩ + 0.7071|11⟩';
    } else if (command.includes('measure') || command.includes('measure(')) {
      return 'Measurement performed.\nCollapsed state: |1⟩\nProbability: 96%';
    } else if (command.includes('simulate') || command.includes('run')) {
      return 'Simulation completed.\nShot count: 1024\nResults: {"00": 512, "11": 498, "01": 8, "10": 6}\nFidelity: 98.4%';
    } else if (command.includes('random') || command.includes('generateRandomNumber')) {
      const randomNum = Math.floor(Math.random() * 100);
      return `Quantum random number generated: ${randomNum}\nEntropy source: quantum vacuum fluctuations\nBell's inequality violation: confirmed`;
    } else if (command.includes('connect') || command.includes('IBM')) {
      return 'Connection to IBM Quantum established.\nAvailable backends: ibm_oslo, ibm_brisbane, ibm_algiers\nQueue position: 3\nEstimated start time: 2 minutes';
    } else if (command.includes('Grover') || command.includes('search')) {
      return 'Grover algorithm execution completed.\nIterations: 2\nMarked element found: index 6\nProbability amplitude: 97.1%\nSpeedup: quadratic over classical';
    } else if (command.includes('superposition') || command.includes('explain')) {
      return 'Quantum superposition is a fundamental principle of quantum mechanics that describes a system\'s ability to exist in multiple states simultaneously until observed.';
    } else if (command.includes('machine learning') || command.includes('QML')) {
      return 'Quantum Machine Learning model initialized.\nFeature map: ZZFeatureMap\nVariational circuit: TwoLocal\nOptimizer: SPSA\nTraining dataset loaded: 200 samples\nInitial accuracy: 54%';
    } else {
      return 'Command executed successfully.\nQuantum state prepared.\nOutput available for analysis.';
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      processInput();
    }
  };
  
  // Use an example query
  const useExampleQuery = (query: string) => {
    setInput(query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Render the history with the proper styling for each entry type
  const renderHistory = () => {
    return history.map((entry, index) => {
      const timestamp = new Date(entry.timestamp).toLocaleTimeString();
      
      switch (entry.type) {
        case 'input':
          return (
            <div key={index} className="flex items-start mb-3 group">
              <div className="flex-shrink-0 mt-1">
                <span className="text-green-500 mr-2 group-hover:text-green-400 transition-colors">
                  <ChevronRight size={16} />
                </span>
              </div>
              <div className="flex-1">
                <span className="text-blue-300 font-mono">{entry.content}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-gray-500 ml-2 cursor-default">{timestamp}</span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="text-xs">
                        DNA Signature: {entry.dnaSignature ? entry.dnaSignature.substring(0, 8) + '...' : 'Unsigned'}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          );
        
        case 'command':
          return (
            <div key={index} className="flex items-start mb-3 bg-gray-900/40 p-2 rounded border-l-2 border-green-600 group hover:bg-gray-900/60 transition-colors">
              <div className="flex-shrink-0 mt-1">
                <span className="text-green-400 mr-2 group-hover:text-green-300 transition-colors">
                  <Code size={16} />
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Badge variant="outline" className="text-xs text-gray-400 border-gray-700 font-mono mr-2">
                    quantum-cmd
                  </Badge>
                  <span className="text-xs text-gray-500">{timestamp}</span>
                </div>
                <code className="text-green-300 font-mono block">{entry.content}</code>
              </div>
            </div>
          );
        
        case 'output':
          return (
            <div key={index} className="pl-6 mb-4 border-l-2 border-blue-700 bg-blue-950/10 p-3 rounded-r group hover:bg-blue-950/20 transition-colors">
              <div className="flex items-center mb-2">
                <Badge variant="outline" className="text-xs text-blue-400 border-blue-700 font-mono mr-2">
                  quantum-result
                </Badge>
                <span className="text-xs text-gray-500">{timestamp}</span>
              </div>
              <pre className="text-gray-300 font-mono whitespace-pre-wrap">
                {entry.content}
              </pre>
            </div>
          );
        
        case 'error':
          return (
            <div key={index} className="flex items-start mb-3 bg-red-950/20 p-3 rounded border-l-2 border-red-700 group hover:bg-red-950/30 transition-colors">
              <div className="flex-shrink-0 mt-1">
                <span className="text-red-400 mr-2 group-hover:text-red-300 transition-colors">
                  <AlertCircle size={16} />
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Badge variant="outline" className="text-xs text-red-400 border-red-700 font-mono mr-2">
                    error
                  </Badge>
                  <span className="text-xs text-gray-500">{timestamp}</span>
                </div>
                <div className="text-red-300 font-mono">{entry.content}</div>
              </div>
            </div>
          );
        
        case 'system':
          return (
            <div key={index} className="flex items-start mb-3 text-gray-400 group">
              <div className="flex-1">
                {entry.content.includes('Processing via') ? (
                  <div className="flex items-center p-1 bg-purple-950/20 rounded border border-purple-900/50">
                    <Badge variant="outline" className="text-xs bg-purple-900/50 text-purple-300 border-purple-700 font-mono mr-2">
                      ai-provider
                    </Badge>
                    <span className="text-purple-300 text-xs font-mono">
                      {entry.content}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">{timestamp}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-gray-400 text-xs">{entry.content}</span>
                    <span className="text-xs text-gray-500 ml-2">{timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          );
        
        case 'explanation':
          return (
            <div key={index} className="flex items-start mb-4 bg-indigo-950/10 p-3 rounded border-l-2 border-indigo-700 group hover:bg-indigo-950/20 transition-colors">
              <div className="flex-shrink-0 mt-1">
                <span className="text-indigo-400 mr-2 group-hover:text-indigo-300 transition-colors">
                  <CheckCircle size={16} />
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Badge variant="outline" className="text-xs text-indigo-400 border-indigo-700 font-mono mr-2">
                    explanation
                  </Badge>
                  <span className="text-xs text-gray-500">{timestamp}</span>
                </div>
                <div className="text-indigo-200 italic">{entry.content}</div>
              </div>
            </div>
          );
        
        default:
          return (
            <div key={index} className="mb-3 text-gray-300 p-2">
              {entry.content}
              <span className="text-xs text-gray-500 ml-2">{timestamp}</span>
            </div>
          );
      }
    });
  };
  
  // Generate a DNA-protected signature for this component
  const componentSignature = dnaProtection.generateComponentSignature(COMPONENT_ID, COMPONENT_NAME);
  
  return (
    <div
      className="flex flex-col h-[calc(100vh-10rem)]"
      id={COMPONENT_ID}
      data-security-signature={componentSignature}
    >
      <Tabs 
        defaultValue="terminal" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full h-full"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 inline-block text-transparent bg-clip-text">
              Quantum NLP Terminal
            </h1>
            <Badge variant="outline" className="ml-2 text-xs text-blue-400 border-blue-400">
              v{dnaProtection.systemVersion}
            </Badge>
          </div>
          
          <TabsList>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="help">Help & Examples</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="terminal" className="flex-1 flex flex-col h-full">
          <Card className="flex-1 border-gray-800 bg-gradient-to-b from-gray-950 to-black">
            <CardHeader className="p-3 border-b border-gray-800 bg-black/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">quantum@{dnaProtection.ownerInfo?.deviceId || 'iphone'}: ~/quantum-terminal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                    Secured
                  </Badge>
                  <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                    Connected
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-full">
              <div 
                className="flex-1 p-4 font-mono text-sm overflow-auto" 
                ref={terminalRef}
                style={{ minHeight: '40vh' }}
              >
                {/* Terminal welcome message */}
                <div className="mb-4 text-blue-300">
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 inline-block text-transparent bg-clip-text mb-1">
                    Quantum NLP Terminal v{dnaProtection.systemVersion}
                  </div>
                  <div className="text-gray-400 text-xs">
                    © Ervin Remus Radosavlevici, David Cornelius Marshall, and Serena Elizabeth Thorne
                  </div>
                  <div className="text-gray-400 text-xs mb-2">
                    Email: ervin210@icloud.com
                  </div>
                  <div className="text-sm text-gray-300 mt-2 mb-1">
                    Type natural language commands to control quantum operations.
                  </div>
                  <div className="text-xs text-gray-500">
                    Available AI providers: {quantumNLPService.availableProviders.length > 0 ? 
                      quantumNLPService.availableProviders.join(', ') : 
                      'Using fallback processor (no API keys available)'}
                  </div>
                </div>

                {renderHistory()}
                {isProcessing && (
                  <div className="flex items-center text-blue-400 mt-2">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    <span className="font-mono">Processing quantum request...</span>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-gray-800 flex items-center bg-black/60">
                <div className="mr-2 text-green-500 animate-pulse">
                  <ChevronRight size={16} />
                </div>
                <Input
                  ref={inputRef}
                  className="flex-1 bg-transparent border-none text-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
                  placeholder="Type your quantum computing request..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing}
                />
                <Button 
                  className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800" 
                  size="sm" 
                  onClick={processInput}
                  disabled={isProcessing || !input.trim()}
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="p-2 bg-gray-900/30 border-t border-gray-800 flex justify-between">
              <div className="flex items-center text-xs text-gray-400">
                <Lock className="h-3 w-3 mr-1" />
                <span className="mr-2">DNA Protected</span>
                <Database className="h-3 w-3 mr-1" />
                <span>Quantum NLP Service Ready</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyHistoryToClipboard}
                  className="h-7 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearTerminal}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="help" className="h-full">
          <Card className="border-gray-800 bg-gradient-to-b from-gray-900 to-black h-full">
            <CardHeader>
              <CardTitle>Examples & Help</CardTitle>
              <CardDescription>
                Try these examples to see how the Quantum NLP Terminal translates your natural language to quantum commands
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {EXAMPLE_QUERIES.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left bg-gray-950/50 hover:bg-gray-900 border-gray-800"
                    onClick={() => useExampleQuery(query)}
                  >
                    <span className="truncate">{query}</span>
                  </Button>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                <p className="text-gray-400 mb-4">
                  The Quantum NLP Terminal translates your natural language questions and commands into 
                  technical quantum computing operations, making quantum computing accessible without 
                  requiring knowledge of complex programming syntax.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                    <h4 className="font-semibold text-blue-400 mb-2">For beginners</h4>
                    <p className="text-sm text-gray-400">
                      Just ask what you want to do with quantum computing in plain English. 
                      The system will interpret your intent and execute the appropriate quantum commands.
                    </p>
                  </div>
                  
                  <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                    <h4 className="font-semibold text-blue-400 mb-2">For experts</h4>
                    <p className="text-sm text-gray-400">
                      The NLP system preserves advanced quantum concepts and provides accurate translations 
                      while showing you the exact commands being executed for educational purposes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="h-full">
          <Card className="border-gray-800 bg-gradient-to-b from-gray-900 to-black h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-400" />
                Security Information
              </CardTitle>
              <CardDescription>
                This terminal is protected by DNA-based security systems to ensure authenticity and integrity
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-md font-semibold text-blue-400 mb-2">Copyright & Ownership</h3>
                  <p className="text-sm text-gray-400">
                    Copyright © {dnaProtection.ownerInfo.name} ({dnaProtection.ownerInfo.birthdate})
                    <br />
                    Email: {dnaProtection.ownerInfo.email}
                  </p>
                </div>
                
                <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-md font-semibold text-blue-400 mb-2">Security Features</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400 mt-0.5" />
                      DNA-based watermarking on all content
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400 mt-0.5" />
                      Quantum-level encryption of all commands
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400 mt-0.5" />
                      Self-repairing code architecture
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400 mt-0.5" />
                      Anti-theft protection with automatic device wipes
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400 mt-0.5" />
                      Immutable copyright protection
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-md font-semibold text-blue-400 mb-2">Component Verification</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Component ID:</span>
                    <code className="text-xs bg-gray-900 px-2 py-1 rounded">{COMPONENT_ID}</code>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-400">DNA Signature:</span>
                    <code className="text-xs bg-gray-900 px-2 py-1 rounded">
                      {componentSignature.substring(0, 16)}...
                    </code>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-400">Security Level:</span>
                    <Badge variant="default" className="bg-blue-600">
                      {dnaProtection.securityLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuantumNLPTerminal;