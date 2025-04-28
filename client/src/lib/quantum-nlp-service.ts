/**
 * !!! QUANTUM NLP SERVICE - DNA PROTECTED SERVICE !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987), David Cornelius Marshall, and Serena Elizabeth Thorne
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * QUANTUM NLP SERVICE
 * 
 * This service provides natural language processing capabilities specifically
 * for quantum computing operations. It translates everyday language into
 * quantum terminal commands, making quantum computing accessible without
 * requiring knowledge of complex programming languages.
 * Built as one integrated system with DNA-based security from the beginning.
 */

import { quantumDNASecurity } from './quantum-dna-security';
import { generateSecurityWatermark } from '@shared/quantum-dna-security';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// For xAI Grok, we use the OpenAI-compatible client
// xAI has a similar API structure to OpenAI but uses a different base URL

// Service identity constants
const SERVICE_ID = 'quantum-nlp-service';
const SERVICE_NAME = 'QuantumNLPService';

// Interface for AI Provider
interface AIProvider {
  id: string;
  name: string;
  isAvailable: boolean;
  processNaturalLanguage: (input: string) => Promise<string>;
}

// Interface for NLP Response
interface NLPResponse {
  command: string;
  explanation: string;
  usedProvider: string;
  _dnaWatermark: string;
}

/**
 * Create an OpenAI provider if API key is available
 * @returns OpenAI AI provider or null
 */
function createOpenAIProvider(): AIProvider | null {
  // On client-side, we need to use import.meta.env instead of process.env
  console.log('Checking for OpenAI API key...');
  console.log('VITE_OPENAI_API_KEY exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
  console.log('OPENAI_API_KEY exists:', !!import.meta.env.OPENAI_API_KEY);
  
  if (!import.meta.env.VITE_OPENAI_API_KEY && !import.meta.env.OPENAI_API_KEY) {
    console.log('OpenAI API key not available');
    return null;
  }
  
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
  console.log('Using OpenAI API key:', apiKey ? 'Key is present' : 'No key found');
  
  const openai = new OpenAI({
    apiKey: apiKey as string,
  });
  
  return {
    id: 'openai',
    name: 'GPT-4o',
    isAvailable: true,
    processNaturalLanguage: async (input: string): Promise<string> => {
      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
        const result = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a quantum computing translator that converts natural language requests into quantum programming code. 
              Return ONLY valid quantum programming code without explanations. Focus on generating syntactically correct code for quantum circuits.
              NEVER use markdown formatting. Return just the raw code.`
            },
            { role: 'user', content: input }
          ],
          max_tokens: 500
        });
        
        return result.choices[0].message.content || '';
      } catch (error) {
        console.error('OpenAI error:', error);
        throw new Error(`OpenAI processing failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };
}

/**
 * Create an Anthropic provider if API key is available
 * @returns Anthropic AI provider or null
 */
function createAnthropicProvider(): AIProvider | null {
  // On client-side, we need to use import.meta.env instead of process.env
  if (!import.meta.env.VITE_ANTHROPIC_API_KEY && !import.meta.env.ANTHROPIC_API_KEY) {
    console.log('Anthropic API key not available');
    return null;
  }
  
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || import.meta.env.ANTHROPIC_API_KEY;
  
  const anthropic = new Anthropic({
    apiKey: apiKey as string,
  });
  
  return {
    id: 'anthropic',
    name: 'Claude 3.7 Sonnet',
    isAvailable: true,
    processNaturalLanguage: async (input: string): Promise<string> => {
      try {
        // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        const result = await anthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219',
          system: `You are a quantum computing translator that converts natural language requests into quantum programming code. 
              Return ONLY valid quantum programming code without explanations. Focus on generating syntactically correct code for quantum circuits.
              NEVER use markdown formatting. Return just the raw code.`,
          messages: [
            { role: 'user', content: input }
          ],
          max_tokens: 500
        });
        
        if (result.content[0].type === 'text') {
          return result.content[0].text;
        }
        return '';
      } catch (error) {
        console.error('Anthropic error:', error);
        throw new Error(`Anthropic processing failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };
}

/**
 * Create an xAI (Grok) provider if API key is available
 * @returns xAI provider or null
 */
function createXAIProvider(): AIProvider | null {
  // On client-side, we need to use import.meta.env instead of process.env
  if (!import.meta.env.VITE_XAI_API_KEY && !import.meta.env.XAI_API_KEY) {
    console.log('xAI (Grok) API key not available');
    return null;
  }
  
  const apiKey = import.meta.env.VITE_XAI_API_KEY || import.meta.env.XAI_API_KEY;
  
  // xAI uses an OpenAI-compatible API with a different base URL
  const xai = new OpenAI({ 
    baseURL: "https://api.x.ai/v1",
    apiKey: apiKey as string
  });
  
  return {
    id: 'xai',
    name: 'Grok-2',
    isAvailable: true,
    processNaturalLanguage: async (input: string): Promise<string> => {
      try {
        const result = await xai.chat.completions.create({
          model: "grok-2-1212", // Latest Grok model
          messages: [
            {
              role: 'system',
              content: `You are a quantum computing translator that converts natural language requests into quantum programming code. 
              Return ONLY valid quantum programming code without explanations. Focus on generating syntactically correct code for quantum circuits.
              NEVER use markdown formatting. Return just the raw code.`
            },
            { role: 'user', content: input }
          ],
          max_tokens: 500
        });
        
        return result.choices[0].message.content || '';
      } catch (error) {
        console.error('xAI (Grok) error:', error);
        throw new Error(`xAI processing failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };
}

/**
 * Fallback NLP processor that uses rules and patterns
 * Used when no AI provider is available
 */
class FallbackNLPProcessor {
  public process(input: string): { command: string; explanation: string } {
    const normalizedInput = input.toLowerCase();
    
    // Simple rule-based pattern matching
    if (normalizedInput.includes('create') && normalizedInput.includes('circuit')) {
      const qubitsMatch = normalizedInput.match(/(\d+)\s*qubit/);
      const numQubits = qubitsMatch ? parseInt(qubitsMatch[1]) : 3;
      
      return {
        command: `createCircuit(${numQubits})`,
        explanation: `Created a quantum circuit with ${numQubits} qubits initialized to the |0⟩ state.`
      };
    } else if (normalizedInput.includes('hadamard') || normalizedInput.includes('superposition')) {
      const qubitMatch = normalizedInput.match(/qubit\s*(\d+)/);
      const qubit = qubitMatch ? parseInt(qubitMatch[1]) : 0;
      
      return {
        command: `H(${qubit})`,
        explanation: `Applied a Hadamard gate to qubit ${qubit}, creating a superposition state.`
      };
    } else if (normalizedInput.includes('entangle') || normalizedInput.includes('cnot')) {
      return {
        command: `CNOT(0, 1)`,
        explanation: `Applied a CNOT gate with qubit 0 as control and qubit 1 as target, creating entanglement.`
      };
    } else if (normalizedInput.includes('measure')) {
      const qubitMatch = normalizedInput.match(/qubit\s*(\d+)/);
      const qubit = qubitMatch ? parseInt(qubitMatch[1]) : 0;
      
      return {
        command: `measure(${qubit})`,
        explanation: `Measured qubit ${qubit}, collapsing its quantum state.`
      };
    } else if (normalizedInput.includes('simulate') || normalizedInput.includes('run')) {
      return {
        command: `simulate(shots=1024)`,
        explanation: `Running simulation with 1024 shots to collect measurement statistics.`
      };
    } else if (normalizedInput.includes('random')) {
      return {
        command: `generateRandomNumber(bits=8)`,
        explanation: `Generating an 8-bit quantum random number using quantum fluctuations.`
      };
    } else if (normalizedInput.includes('connect') && 
              (normalizedInput.includes('ibm') || normalizedInput.includes('quantum'))) {
      return {
        command: `connectToBackend("ibm_oslo")`,
        explanation: `Connecting to IBM Quantum backend 'ibm_oslo' for remote quantum computation.`
      };
    } else if (normalizedInput.includes('grover') || normalizedInput.includes('search')) {
      return {
        command: `executeGrover(items=8, target=3)`,
        explanation: `Executing Grover's search algorithm to find the marked item in a database of 8 items.`
      };
    } else if (normalizedInput.includes('explain') && normalizedInput.includes('superposition')) {
      return {
        command: `showDocumentation("superposition")`,
        explanation: `Quantum superposition allows qubits to exist in multiple states simultaneously, enabling quantum parallelism.`
      };
    } else if (normalizedInput.includes('machine learning') || normalizedInput.includes('qml')) {
      return {
        command: `initQML(qubits=4, dataset="iris")`,
        explanation: `Initializing a quantum machine learning model with 4 qubits, using the Iris dataset for classification.`
      };
    } else {
      // Default fallback
      return {
        command: `process("${input.replace(/"/g, '\\"')}")`,
        explanation: `Processing the requested quantum operation based on your input.`
      };
    }
  }
}

/**
 * The main Quantum NLP Service
 */
class QuantumNLPService {
  private static instance: QuantumNLPService;
  private _initialized: boolean = false;
  private _aiProviders: AIProvider[] = [];
  private _fallbackProcessor: FallbackNLPProcessor;
  
  /**
   * Private constructor (singleton pattern)
   */
  private constructor() {
    this._fallbackProcessor = new FallbackNLPProcessor();
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): QuantumNLPService {
    if (!this.instance) {
      this.instance = new QuantumNLPService();
    }
    return this.instance;
  }
  
  /**
   * Initialize the quantum NLP service
   */
  public async initialize(): Promise<boolean> {
    if (this._initialized) {
      console.log("Quantum NLP Service already initialized, skipping");
      return true;
    }
    
    try {
      console.log("Quantum NLP Service initializing...");
      console.log("Environment check for API keys:");
      console.log("- OpenAI API key exists:", 
        !!import.meta.env.VITE_OPENAI_API_KEY || !!import.meta.env.OPENAI_API_KEY);
      console.log("- Anthropic API key exists:", 
        !!import.meta.env.VITE_ANTHROPIC_API_KEY || !!import.meta.env.ANTHROPIC_API_KEY);
      console.log("- xAI (Grok) API key exists:", 
        !!import.meta.env.VITE_XAI_API_KEY || !!import.meta.env.XAI_API_KEY);
      
      // Initialize Quantum DNA Security first
      try {
        console.log("Initializing Quantum DNA Security...");
        await quantumDNASecurity.initialize();
        console.log("Quantum DNA Security initialized");
      } catch (securityError) {
        console.error("Error initializing Quantum DNA Security, but continuing with fallback:", securityError);
        // We'll continue even if this fails
      }
      
      // Initialize AI providers
      console.log("Initializing AI providers...");
      this._initializeAIProviders();
      console.log("AI providers initialized, count:", this._aiProviders.length);
      
      this._initialized = true;
      console.log("Quantum NLP Service initialized successfully");
      console.log(`Available AI providers: ${this._aiProviders.map(p => p.name).join(', ') || 'None (using fallback)'}`);
      
      if (this._aiProviders.length === 0) {
        console.log("No AI providers available - fallback system will be used for all processing");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to initialize Quantum NLP Service:", error);
      // Mark as initialized anyway, but we'll use the fallback processor
      this._initialized = true;
      console.log("Initialized in emergency fallback-only mode due to errors");
      return true; // Return true so the UI doesn't get stuck in initialization loops
    }
  }
  
  /**
   * Initialize AI providers
   */
  private _initializeAIProviders(): void {
    console.log("Initializing AI providers...");
    
    // Try to initialize OpenAI provider
    console.log("Attempting to initialize OpenAI provider...");
    const openaiProvider = createOpenAIProvider();
    if (openaiProvider) {
      console.log("OpenAI provider initialized successfully");
      this._aiProviders.push(openaiProvider);
    } else {
      console.log("Failed to initialize OpenAI provider - API key might be missing");
    }
    
    // Try to initialize Anthropic provider
    console.log("Attempting to initialize Anthropic provider...");
    const anthropicProvider = createAnthropicProvider();
    if (anthropicProvider) {
      console.log("Anthropic provider initialized successfully");
      this._aiProviders.push(anthropicProvider);
    } else {
      console.log("Failed to initialize Anthropic provider - API key might be missing");
    }
    
    // Try to initialize xAI (Grok) provider
    console.log("Attempting to initialize xAI (Grok) provider...");
    const xaiProvider = createXAIProvider();
    if (xaiProvider) {
      console.log("xAI (Grok) provider initialized successfully");
      this._aiProviders.push(xaiProvider);
    } else {
      console.log("Failed to initialize xAI provider - API key might be missing");
    }
    
    // Check if we have IBM Quantum API Key
    console.log("Checking for IBM Quantum API Key...");
    if (import.meta.env.VITE_IBM_QUANTUM_API_KEY || import.meta.env.IBM_QUANTUM_API_KEY) {
      console.log("IBM Quantum API key is available - quantum computing backend is accessible");
    } else {
      console.log("IBM Quantum API key not available - will use simulated quantum backend");
    }
    
    // Check if we have Azure Quantum API Key
    console.log("Checking for Azure Quantum API Key...");
    if (import.meta.env.VITE_AZURE_QUANTUM_API_KEY || import.meta.env.AZURE_QUANTUM_API_KEY) {
      console.log("Azure Quantum API key is available - quantum computing backend is accessible");
    } else {
      console.log("Azure Quantum API key not available - will use simulated quantum backend");
    }
    
    // If no AI providers were initialized, log this clearly
    if (this._aiProviders.length === 0) {
      console.log("NO AI PROVIDERS INITIALIZED - using fallback rule-based system");
      console.log("This is normal if running in development environment without API keys");
    } else {
      console.log(`Successfully initialized ${this._aiProviders.length} AI providers`);
    }
    
    // More providers could be added here
    // Google Gemini, DeepSeek, LLaMA, Microsoft Copilot, etc.
  }
  
  /**
   * Process a natural language input
   * @param input The natural language input to process
   * @returns NLP response with command and explanation
   */
  /**
   * Process natural language input and convert to quantum commands
   * Enhanced with comprehensive logging and diagnostic capabilities
   */
  public async processInput(input: string): Promise<NLPResponse> {
    console.log("[QuantumNLP] Processing user input:", input);
    console.log("[QuantumNLP] Service initialized:", this._initialized);
    console.log("[QuantumNLP] Available providers:", this._aiProviders.length);
    
    // Check if service is initialized
    if (!this._initialized) {
      console.warn("[QuantumNLP] Service not initialized, attempting auto-initialization");
      
      try {
        // Attempt auto-initialization
        const initSuccess = await this.initialize();
        
        if (!initSuccess || !this._initialized) {
          console.error("[QuantumNLP] Auto-initialization failed, will use emergency fallback");
          
          // Even if we fail, use the fallback processor to provide a response
          console.log("[QuantumNLP] Using fallback processor after initialization failure");
          const fallbackResult = this._fallbackProcessor.process(input);
          
          return {
            command: fallbackResult.command,
            explanation: fallbackResult.explanation,
            usedProvider: 'Emergency Fallback (Initialization Failed)',
            _dnaWatermark: generateSecurityWatermark(`emergency-fallback-${Date.now()}`)
          };
        }
        
        console.log("[QuantumNLP] Auto-initialization successful, proceeding with input processing");
      } catch (error) {
        console.error("[QuantumNLP] Auto-initialization failed with error:", error);
        
        // Even if we fail, use the fallback processor to provide a response
        console.log("[QuantumNLP] Using fallback processor after initialization error");
        const fallbackResult = this._fallbackProcessor.process(input);
        
        return {
          command: fallbackResult.command,
          explanation: fallbackResult.explanation,
          usedProvider: 'Emergency Fallback (Initialization Failed)',
          _dnaWatermark: generateSecurityWatermark(`emergency-fallback-${Date.now()}`)
        };
      }
    }
    
    try {
      console.log("[QuantumNLP] Beginning input processing");
      let command = '';
      let usedProviders: string[] = [];
      let lastError: Error | null = null;
      
      // Try to use AI providers if available - attempt all of them in sequence
      // This creates a "direct connection" between all AI services
      if (this._aiProviders.length > 0) {
        console.log(`[QuantumNLP] Attempting to use ${this._aiProviders.length} available AI providers`);
        
        // First try the primary AI provider
        for (const provider of this._aiProviders) {
          try {
            console.log(`[QuantumNLP] Attempting to process with ${provider.name}...`);
            const startTime = Date.now();
            command = await provider.processNaturalLanguage(input);
            const processingTime = Date.now() - startTime;
            console.log(`[QuantumNLP] ${provider.name} response time: ${processingTime}ms`);
            
            if (!command || command.trim() === '') {
              console.warn(`[QuantumNLP] Provider ${provider.name} returned empty response, trying next provider`);
              continue;
            }
            
            usedProviders.push(provider.name);
            console.log(`[QuantumNLP] Successfully processed input using ${provider.name}`);
            console.log(`[QuantumNLP] Generated command: ${command.substring(0, 100)}${command.length > 100 ? '...' : ''}`);
            break; // Successfully processed, exit the loop
          } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`[QuantumNLP] AI provider ${provider.name} failed:`, error);
            
            // Add detailed diagnostic information
            console.warn(`[QuantumNLP] Provider failure details - Name: ${provider.name}, Error: ${lastError.message}`);
            
            // Continue to the next provider
          }
        }
        
        // If all providers failed, fall back to the rule-based system
        if (!command || command.trim() === '') {
          console.warn('[QuantumNLP] All AI providers failed or returned empty responses');
          
          if (lastError) {
            console.error('[QuantumNLP] Last error before fallback:', lastError.message);
          }
          
          console.log('[QuantumNLP] Using fallback NLP processor');
          const fallbackResult = this._fallbackProcessor.process(input);
          command = fallbackResult.command;
          usedProviders.push('Fallback Processor');
        }
      } else {
        // No AI providers available, use fallback
        console.log('[QuantumNLP] No AI providers available, using fallback NLP processor');
        const fallbackResult = this._fallbackProcessor.process(input);
        command = fallbackResult.command;
        usedProviders.push('Fallback Processor');
      }
      
      // Final validation - ensure we have a command
      if (!command || command.trim() === '') {
        console.warn('[QuantumNLP] No command generated after all attempts, using emergency fallback');
        command = `process("${input.replace(/"/g, '\\"')}")`;
        usedProviders.push('Emergency Fallback');
      }
      
      // Generate explanation from command
      const explanation = this._generateExplanation(command, input);
      
      // Generate DNA watermark for the response
      const watermark = generateSecurityWatermark(`nlp-response-${Date.now()}`);
      
      console.log(`[QuantumNLP] Successfully processed using providers: ${usedProviders.join(', ')}`);
      
      // Select the provider name to display
      const providerName = usedProviders.length > 0 
        ? usedProviders[0] 
        : 'Fallback Processor';
        
      // Prepare the final response
      const response: NLPResponse = {
        command,
        explanation,
        usedProvider: providerName,
        _dnaWatermark: watermark
      };
      
      console.log('[QuantumNLP] Returning processed response');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[QuantumNLP] Critical error in processInput:", errorMessage);
      console.error("[QuantumNLP] Stack trace:", error instanceof Error ? error.stack : 'No stack trace available');
      
      // Even in catastrophic failure, return something useful to prevent UI breakage
      console.log("[QuantumNLP] Using emergency fallback due to critical processing error");
      const fallbackResult = this._fallbackProcessor.process(input);
      
      return {
        command: fallbackResult.command,
        explanation: `I encountered an issue while processing your request, but I'm providing a best-effort response: ${fallbackResult.explanation}`,
        usedProvider: 'Error Recovery System',
        _dnaWatermark: generateSecurityWatermark(`error-recovery-${Date.now()}`)
      };
    }
  }
  
  /**
   * Generate explanation for a command
   * Enhanced with better pattern matching and diagnostics
   * @param command The command to explain
   * @param originalInput The original natural language input
   * @returns Explanation string
   */
  private _generateExplanation(command: string, originalInput: string): string {
    console.log(`[QuantumNLP] Generating explanation for command: ${command}`);
    
    try {
      // Simple explanation generator based on command patterns
      if (!command || typeof command !== 'string') {
        console.warn('[QuantumNLP] Invalid command passed to explanation generator:', command);
        return `Translated your request into a quantum operation.`;
      }
      
      const commandLower = command.toLowerCase();
      
      if (command.includes('createCircuit') || commandLower.includes('create circuit')) {
        const match = command.match(/createCircuit\((\d+)\)/);
        const qubits = match ? match[1] : (command.match(/(\d+)/) ? command.match(/(\d+)/)![1] : '3');
        return `Created a quantum circuit with ${qubits} qubits initialized to the |0⟩ state.`;
      } else if (command.includes('H(') || commandLower.includes('hadamard')) {
        const match = command.match(/H\((\d+)\)/);
        const qubit = match ? match[1] : (command.match(/qubit\s*(\d+)/) ? command.match(/qubit\s*(\d+)/)![1] : '0');
        return `Applied a Hadamard gate to qubit ${qubit}, creating a superposition state where the qubit is in both |0⟩ and |1⟩ states simultaneously.`;
      } else if (command.includes('CNOT') || commandLower.includes('entangle') || commandLower.includes('cnot')) {
        let control = '0';
        let target = '1';
        
        // Try to extract control and target qubits from different formats
        const cnotMatch = command.match(/CNOT\((\d+),\s*(\d+)\)/);
        if (cnotMatch) {
          control = cnotMatch[1];
          target = cnotMatch[2];
        } else {
          const controlMatch = command.match(/control\s*=?\s*(\d+)/i);
          const targetMatch = command.match(/target\s*=?\s*(\d+)/i);
          if (controlMatch) control = controlMatch[1];
          if (targetMatch) target = targetMatch[1];
        }
        
        return `Applied a CNOT gate with qubit ${control} as control and qubit ${target} as target, creating quantum entanglement between the qubits.`;
      } else if (command.includes('measure') || commandLower.includes('measurement')) {
        let qubit = '0';
        const measureMatch = command.match(/measure\((\d+)\)/);
        if (measureMatch) {
          qubit = measureMatch[1];
        } else {
          const qubitMatch = command.match(/qubit\s*(\d+)/i);
          if (qubitMatch) qubit = qubitMatch[1];
        }
        
        return `Measured qubit ${qubit}, collapsing its quantum state to a classical bit value (0 or 1).`;
      } else if (command.includes('simulate') || commandLower.includes('run') || commandLower.includes('execute')) {
        let shots = '1000';
        const shotsMatch = command.match(/shots\s*=\s*(\d+)/i);
        if (shotsMatch) {
          shots = shotsMatch[1];
        }
        
        return `Running quantum simulation with ${shots} shots to gather measurement statistics and verify quantum algorithm behavior.`;
      } else if (command.includes('random') || commandLower.includes('generaterandemnumber')) {
        let bits = '8';
        const bitsMatch = command.match(/bits\s*=\s*(\d+)/i);
        if (bitsMatch) {
          bits = bitsMatch[1];
        }
        
        return `Generating a ${bits}-bit quantum random number using quantum measurement outcomes for true randomness.`;
      } else if (commandLower.includes('connect') || commandLower.includes('backend') || commandLower.includes('ibm')) {
        let backend = 'quantum computer';
        const backendMatch = command.match(/"([^"]+)"/);
        if (backendMatch) {
          backend = backendMatch[1];
        } else if (command.includes('ibm_')) {
          const ibmMatch = command.match(/ibm_(\w+)/i);
          if (ibmMatch) backend = `IBM ${ibmMatch[1].toUpperCase()}`;
        }
        
        return `Connecting to the ${backend} quantum computing backend to execute quantum algorithms on real quantum hardware.`;
      } else if (commandLower.includes('grover') || commandLower.includes('search')) {
        let items = '';
        const itemsMatch = command.match(/items\s*=\s*(\d+)/i);
        if (itemsMatch) {
          items = ` with ${itemsMatch[1]} items`;
        }
        
        return `Executing Grover's quantum search algorithm to find a marked item in an unstructured database${items} with a quadratic speedup over classical algorithms.`;
      } else if (commandLower.includes('qml') || commandLower.includes('machine learning')) {
        let qubits = '';
        const qubitsMatch = command.match(/qubits\s*=\s*(\d+)/i);
        if (qubitsMatch) {
          qubits = ` using ${qubitsMatch[1]} qubits`;
        }
        
        let dataset = '';
        const datasetMatch = command.match(/dataset\s*=\s*"([^"]+)"/i);
        if (datasetMatch) {
          dataset = ` on the ${datasetMatch[1]} dataset`;
        }
        
        return `Initializing a quantum machine learning model${qubits}${dataset} that leverages quantum effects like superposition and entanglement to potentially outperform classical ML models.`;
      } else if (commandLower.includes('documentation') || commandLower.includes('explain') || commandLower.includes('help')) {
        let topic = 'quantum computing';
        const topicMatch = command.match(/"([^"]+)"/);
        if (topicMatch) {
          topic = topicMatch[1];
        }
        
        return `Displaying documentation about ${topic} to help you understand quantum concepts and operations.`;
      } else if (commandLower.includes('process')) {
        // For the generic process command
        return `Processing your request: "${originalInput.substring(0, 40)}${originalInput.length > 40 ? '...' : ''}"`;
      } else {
        // Generic explanation with better truncation
        const truncatedInput = originalInput.length > 30 ? 
          originalInput.substring(0, 30) + '...' : 
          originalInput;
        
        return `Translated your request about "${truncatedInput}" into quantum programming code that can be executed on a quantum computer.`;
      }
    } catch (error) {
      console.error("[QuantumNLP] Error generating explanation:", error);
      return `Translated your request into quantum operations for execution on a quantum computer.`;
    }
  }
  
  /**
   * Check if the service is initialized
   * @returns boolean indicating if service is initialized
   */
  public get isInitialized(): boolean {
    return this._initialized;
  }
  
  /**
   * Get the available AI providers
   * @returns string array of provider names
   */
  public get availableProviders(): string[] {
    return this._aiProviders.map(provider => provider.name);
  }
}

// Export a singleton instance
export const quantumNLPService = QuantumNLPService.getInstance();