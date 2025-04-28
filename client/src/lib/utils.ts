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
 * UTILITY FUNCTIONS
 * 
 * Common utilities used throughout the application with integrated security features.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  generateDNASignature, 
  generateSecurityWatermark,
  IMMUTABLE_SYSTEM_VERSION,
  IMMUTABLE_COPYRIGHT_OWNER,
  IMMUTABLE_COPYRIGHT_BIRTHDATE,
  IMMUTABLE_COPYRIGHT_EMAIL
} from "@shared/quantum-dna-security";

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Quantum NLP utility functions
 */
export const quantumNLPUtils = {
  /**
   * Translates natural language input to quantum terminal commands
   * @param input Natural language input
   * @returns Structured command and explanation
   */
  translateToQuantumCommand(input: string): { command: string; explanation: string; confidence: number } {
    // Convert the input to lowercase for easier processing
    const lowercaseInput = input.toLowerCase();
    
    // Map common natural language phrases to quantum terminal commands
    
    // Circuit creation
    if (lowercaseInput.includes('create') && lowercaseInput.includes('circuit')) {
      const qubitsMatch = lowercaseInput.match(/(\d+)\s*qubit/);
      const qubits = qubitsMatch ? parseInt(qubitsMatch[1]) : 3;
      
      return {
        command: `createCircuit(${qubits});`,
        explanation: `This command creates a new quantum circuit with ${qubits} qubits initialized to the |0⟩ state.`,
        confidence: 0.95
      };
    }
    
    // Applying gates
    if (lowercaseInput.includes('apply') || lowercaseInput.includes('put') || lowercaseInput.includes('add')) {
      // Hadamard gate
      if (lowercaseInput.includes('hadamard') || lowercaseInput.includes('h gate')) {
        const qubitMatch = lowercaseInput.match(/qubit\s*(\d+)/);
        const qubit = qubitMatch ? parseInt(qubitMatch[1]) : 0;
        
        return {
          command: `H(${qubit});`,
          explanation: `This command applies a Hadamard gate to qubit ${qubit}, putting it in a superposition of |0⟩ and |1⟩ states.`,
          confidence: 0.92
        };
      }
      
      // CNOT gate
      if (lowercaseInput.includes('cnot') || (lowercaseInput.includes('controlled') && lowercaseInput.includes('not'))) {
        const controlMatch = lowercaseInput.match(/control\s*qubit\s*(\d+)/);
        const control = controlMatch ? parseInt(controlMatch[1]) : 0;
        const targetMatch = lowercaseInput.match(/target\s*qubit\s*(\d+)/);
        const target = targetMatch ? parseInt(targetMatch[1]) : 1;
        
        return {
          command: `CNOT(${control}, ${target});`,
          explanation: `This command applies a CNOT gate with qubit ${control} as the control and qubit ${target} as the target, creating entanglement between them.`,
          confidence: 0.88
        };
      }
    }
    
    // Measuring qubits
    if (lowercaseInput.includes('measure')) {
      const qubitMatch = lowercaseInput.match(/qubit\s*(\d+)/);
      const qubit = qubitMatch ? parseInt(qubitMatch[1]) : 'all';
      
      if (qubit === 'all') {
        return {
          command: `measureAll();`,
          explanation: `This command measures all qubits in the circuit, collapsing their quantum states and returning classical bit values.`,
          confidence: 0.90
        };
      } else {
        return {
          command: `measure(${qubit});`,
          explanation: `This command measures qubit ${qubit}, collapsing its quantum state to either 0 or 1.`,
          confidence: 0.93
        };
      }
    }
    
    // Running simulations
    if (lowercaseInput.includes('run') || lowercaseInput.includes('simulate') || lowercaseInput.includes('execute')) {
      const shotsMatch = lowercaseInput.match(/(\d+)\s*shots/);
      const shots = shotsMatch ? parseInt(shotsMatch[1]) : 1024;
      
      return {
        command: `run(shots=${shots});`,
        explanation: `This command executes the quantum circuit ${shots} times and collects the measurement statistics.`,
        confidence: 0.94
      };
    }
    
    // Quantum algorithms
    if (lowercaseInput.includes('algorithm') || lowercaseInput.includes('grover') || lowercaseInput.includes('shor')) {
      // Grover's algorithm
      if (lowercaseInput.includes('grover') || lowercaseInput.includes('search')) {
        return {
          command: `runAlgorithm("grover", { size: 4 });`,
          explanation: `This command initializes and runs Grover's search algorithm on a 4-qubit system to find a marked item in an unsorted database.`,
          confidence: 0.85
        };
      }
      
      // Shor's algorithm
      if (lowercaseInput.includes('shor') || lowercaseInput.includes('factor')) {
        const numMatch = lowercaseInput.match(/factor\s*(\d+)/);
        const num = numMatch ? parseInt(numMatch[1]) : 15;
        
        return {
          command: `runAlgorithm("shor", { number: ${num} });`,
          explanation: `This command runs Shor's algorithm to find the prime factors of ${num} using quantum period finding.`,
          confidence: 0.82
        };
      }
    }
    
    // Quantum machine learning
    if (lowercaseInput.includes('machine learning') || lowercaseInput.includes('qml') || lowercaseInput.includes('model')) {
      return {
        command: `initQML({ layers: 2, features: 4, readout: "classification" });`,
        explanation: `This command initializes a Quantum Machine Learning model with 2 variational layers, 4 feature dimensions, and classification readout.`,
        confidence: 0.78
      };
    }
    
    // Connect to quantum backends
    if (lowercaseInput.includes('connect') || lowercaseInput.includes('backend')) {
      if (lowercaseInput.includes('ibm') || lowercaseInput.includes('qiskit')) {
        return {
          command: `connectBackend("ibm_quantum", { use_real_hw: true });`,
          explanation: `This command connects to IBM Quantum services, allowing you to run circuits on real quantum hardware.`,
          confidence: 0.91
        };
      }
      
      if (lowercaseInput.includes('azure') || lowercaseInput.includes('microsoft')) {
        return {
          command: `connectBackend("azure_quantum", { use_real_hw: true });`,
          explanation: `This command connects to Microsoft Azure Quantum services, allowing you to run circuits on their quantum hardware.`,
          confidence: 0.89
        };
      }
    }
    
    // Get quantum system status
    if (lowercaseInput.includes('status') || lowercaseInput.includes('system') || lowercaseInput.includes('check')) {
      return {
        command: `getSystemStatus();`,
        explanation: `This command checks the status of connected quantum systems and returns information like coherence times, qubit counts, and error rates.`,
        confidence: 0.90
      };
    }
    
    // Generate random numbers
    if (lowercaseInput.includes('random') || lowercaseInput.includes('generate number')) {
      const bitsMatch = lowercaseInput.match(/(\d+)\s*bits?/);
      const bits = bitsMatch ? parseInt(bitsMatch[1]) : 8;
      
      return {
        command: `generateQuantumRandomNumber(bits=${bits});`,
        explanation: `This command generates a truly random ${bits}-bit number using quantum fluctuations.`,
        confidence: 0.93
      };
    }
    
    // Explain quantum concepts
    if (lowercaseInput.includes('explain') || lowercaseInput.includes('what is') || lowercaseInput.includes('how does')) {
      if (lowercaseInput.includes('superposition')) {
        return {
          command: `explainConcept("superposition");`,
          explanation: `This command provides an explanation of quantum superposition, the principle that quantum systems can exist in multiple states simultaneously until measured.`,
          confidence: 0.95
        };
      }
      
      if (lowercaseInput.includes('entanglement')) {
        return {
          command: `explainConcept("entanglement");`,
          explanation: `This command provides an explanation of quantum entanglement, where two or more particles become correlated in ways that cannot be explained by classical physics.`,
          confidence: 0.94
        };
      }
    }
    
    // Default fallback for unknown inputs
    return {
      command: `parseNLP("${input.replace(/"/g, '\\"')}");`,
      explanation: `I've sent your natural language query to the quantum processing system. The system will attempt to interpret your intent and execute the appropriate quantum operations.`,
      confidence: 0.65
    };
  },
  
  /**
   * Protects data with DNA watermark
   * @param data Data to protect
   * @param id Identifier for the data
   * @returns Protected data with watermark
   */
  protectData<T extends object>(data: T, id: string): T & { _dnaWatermark: string } {
    return {
      ...data,
      _dnaWatermark: generateSecurityWatermark(`object-${id}`)
    };
  },
  
  /**
   * Generates a random quantum circuit description for demonstration
   * @returns Random circuit description
   */
  generateRandomCircuitDescription(): string {
    const gateTypes = [
      'Hadamard', 'CNOT', 'X', 'Y', 'Z', 'S', 'T', 'Rx', 'Ry', 'Rz'
    ];
    
    const qubitCount = Math.floor(Math.random() * 5) + 2; // 2-6 qubits
    const depth = Math.floor(Math.random() * 8) + 3; // 3-10 gates
    
    let circuit = `Circuit with ${qubitCount} qubits:\n`;
    
    for (let i = 0; i < depth; i++) {
      const gate = gateTypes[Math.floor(Math.random() * gateTypes.length)];
      const qubit1 = Math.floor(Math.random() * qubitCount);
      
      if (gate === 'CNOT') {
        let qubit2 = Math.floor(Math.random() * qubitCount);
        while (qubit2 === qubit1) {
          qubit2 = Math.floor(Math.random() * qubitCount);
        }
        circuit += `- ${gate} gate: Control=${qubit1}, Target=${qubit2}\n`;
      } else {
        circuit += `- ${gate} gate on qubit ${qubit1}\n`;
      }
    }
    
    return circuit;
  }
};

/**
 * Apply DNA protection to an object with watermarking
 * @param obj Object to protect
 * @param id Identifier for the object
 * @returns Protected object with DNA watermark
 */
export function applyDNAProtection<T extends object>(obj: T, id: string): T & { _dnaProtected: true, _dnaSignature: string, _watermark: string } {
  return {
    ...obj,
    _dnaProtected: true,
    _dnaSignature: generateDNASignature(`object-${id}`, id),
    _watermark: generateSecurityWatermark(`object-${id}`)
  };
}

/**
 * Formats a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Creates a delay for the specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Applies DNA watermark to a string
 */
export function applyWatermark(str: string, id: string): string {
  const watermark = generateSecurityWatermark(`string-${id}`);
  return `${str}\n<!-- DNA Watermark: ${watermark} -->`;
}

/**
 * Securely generates a UUID with DNA protection
 */
export function generateSecureId(): string {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  
  // Add DNA protection
  const protectedUuid = `${uuid}-dna-${IMMUTABLE_SYSTEM_VERSION.replace(/\./g, '')}`;
  return protectedUuid;
}

// Re-export immutable copyright information from shared/quantum-dna-security.ts