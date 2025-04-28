/**
 * Quantum AI Assistant
 * 
 * MIT License (Royalty-Free)
 * Copyright (c) 2025 Quantum AI Assistant Contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * ROYALTY-FREE PROVISION:
 * This software is provided completely royalty-free. No payment, fee, or royalty
 * of any kind is required for any use of this software, including commercial use, 
 * redistribution, or creation of derivative works.
 * 
 * QUANTUM NLP SERVICE
 * 
 * This service provides natural language processing capabilities specifically
 * for quantum computing operations. It translates everyday language into
 * quantum terminal commands, making quantum computing accessible without
 * requiring knowledge of complex programming languages.
 */

import { quantumDNASecurity } from '@/lib/quantum-dna-security';
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
  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key not available');
    return null;
  }
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('Anthropic API key not available');
    return null;
  }
  
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
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
  if (!process.env.XAI_API_KEY) {
    console.log('xAI (Grok) API key not available');
    return null;
  }
  
  // xAI uses an OpenAI-compatible API with a different base URL
  const xai = new OpenAI({ 
    baseURL: "https://api.x.ai/v1",
    apiKey: process.env.XAI_API_KEY
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
      return true;
    }
    
    try {
      console.log("Quantum NLP Service initializing...");
      
      // Initialize Quantum DNA Security first
      await quantumDNASecurity.initialize();
      
      // Initialize AI providers
      this._initializeAIProviders();
      
      this._initialized = true;
      console.log("Quantum NLP Service initialized successfully");
      console.log(`Available AI providers: ${this._aiProviders.map(p => p.name).join(', ') || 'None (using fallback)'}`);
      
      return true;
    } catch (error) {
      console.error("Failed to initialize Quantum NLP Service:", error);
      return false;
    }
  }
  
  /**
   * Initialize AI providers
   */
  private _initializeAIProviders(): void {
    // Try to initialize OpenAI provider
    const openaiProvider = createOpenAIProvider();
    if (openaiProvider) {
      this._aiProviders.push(openaiProvider);
    }
    
    // Try to initialize Anthropic provider
    const anthropicProvider = createAnthropicProvider();
    if (anthropicProvider) {
      this._aiProviders.push(anthropicProvider);
    }
    
    // Try to initialize xAI (Grok) provider
    const xaiProvider = createXAIProvider();
    if (xaiProvider) {
      this._aiProviders.push(xaiProvider);
    }
    
    // More providers could be added here
    // Google Gemini, DeepSeek, LLaMA, Microsoft Copilot, etc.
  }
  
  /**
   * Process a natural language input
   * @param input The natural language input to process
   * @returns NLP response with command and explanation
   */
  public async processInput(input: string): Promise<NLPResponse> {
    if (!this._initialized) {
      throw new Error("Quantum NLP Service not initialized");
    }
    
    try {
      let command = '';
      let usedProviders: string[] = [];
      
      // Try to use AI providers if available - attempt all of them in sequence
      // This creates a "direct connection" between all AI services
      if (this._aiProviders.length > 0) {
        // First try the primary AI provider
        for (const provider of this._aiProviders) {
          try {
            console.log(`Attempting to process with ${provider.name}...`);
            command = await provider.processNaturalLanguage(input);
            usedProviders.push(provider.name);
            console.log(`Successfully processed input using ${provider.name}`);
            break; // Successfully processed, exit the loop
          } catch (error) {
            console.error(`AI provider ${provider.name} failed:`, error);
            // Continue to the next provider
          }
        }
        
        // If all providers failed, fall back to the rule-based system
        if (!command) {
          console.log('All AI providers failed, using fallback NLP processor');
          const fallbackResult = this._fallbackProcessor.process(input);
          command = fallbackResult.command;
          usedProviders.push('Fallback Processor');
        }
      } else {
        // No AI providers available, use fallback
        console.log('No AI providers available, using fallback NLP processor');
        const fallbackResult = this._fallbackProcessor.process(input);
        command = fallbackResult.command;
        usedProviders.push('Fallback Processor');
      }
      
      // Generate explanation from command
      const explanation = this._generateExplanation(command, input);
      
      // Generate DNA watermark for the response
      const watermark = generateSecurityWatermark(`nlp-response-${Date.now()}`);
      
      console.log(`Processed using providers: ${usedProviders.join(', ')}`);
      
      // Select the provider name to display
      const providerName = usedProviders.length > 0 
        ? usedProviders[0] 
        : 'Fallback Processor';
        
      return {
        command,
        explanation,
        usedProvider: providerName,
        _dnaWatermark: watermark
      };
    } catch (error) {
      console.error("Error processing NLP input:", error);
      throw new Error(`Failed to process input: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Generate explanation for a command
   * @param command The command to explain
   * @param originalInput The original natural language input
   * @returns Explanation string
   */
  private _generateExplanation(command: string, originalInput: string): string {
    // Simple explanation generator based on command patterns
    if (command.includes('createCircuit')) {
      const match = command.match(/createCircuit\((\d+)\)/);
      const qubits = match ? match[1] : '?';
      return `Created a quantum circuit with ${qubits} qubits initialized to the |0⟩ state.`;
    } else if (command.includes('H(')) {
      const match = command.match(/H\((\d+)\)/);
      const qubit = match ? match[1] : '?';
      return `Applied a Hadamard gate to qubit ${qubit}, creating a superposition state where the qubit is in both |0⟩ and |1⟩ states simultaneously.`;
    } else if (command.includes('CNOT')) {
      const match = command.match(/CNOT\((\d+),\s*(\d+)\)/);
      const control = match ? match[1] : '0';
      const target = match ? match[2] : '1';
      return `Applied a CNOT gate with qubit ${control} as control and qubit ${target} as target, creating quantum entanglement between the qubits.`;
    } else if (command.includes('measure')) {
      const match = command.match(/measure\((\d+)\)/);
      const qubit = match ? match[1] : '?';
      return `Measured qubit ${qubit}, collapsing its quantum state to a classical bit value (0 or 1).`;
    } else if (command.includes('simulate')) {
      const match = command.match(/shots=(\d+)/);
      const shots = match ? match[1] : '1000';
      return `Running quantum simulation with ${shots} shots to gather measurement statistics and verify quantum algorithm behavior.`;
    } else if (command.includes('random')) {
      const match = command.match(/bits=(\d+)/);
      const bits = match ? match[1] : '8';
      return `Generating a ${bits}-bit quantum random number using quantum measurement outcomes for true randomness.`;
    } else if (command.includes('connect')) {
      const match = command.match(/"([^"]+)"/);
      const backend = match ? match[1] : 'quantum computer';
      return `Connecting to the ${backend} quantum computing backend to execute quantum algorithms on real quantum hardware.`;
    } else if (command.includes('Grover')) {
      return `Executing Grover's quantum search algorithm to find a marked item in an unstructured database with a quadratic speedup over classical algorithms.`;
    } else if (command.includes('QML')) {
      return `Initializing a quantum machine learning model that leverages quantum effects like superposition and entanglement to potentially outperform classical ML models for specific tasks.`;
    } else {
      // Generic explanation
      return `Translated your request about "${originalInput.substring(0, 30)}..." into quantum programming code that can be executed on a quantum computer.`;
    }
  }
  
  /**
   * Check if the service is initialized
   */
  public get isInitialized(): boolean {
    return this._initialized;
  }
  
  /**
   * Get the available AI providers
   */
  public get availableProviders(): string[] {
    return this._aiProviders.map(provider => provider.name);
  }
}

// Export a singleton instance
export const quantumNLPService = QuantumNLPService.getInstance();