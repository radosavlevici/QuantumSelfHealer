/**
 * !!! DNA PROTECTED COMPONENT - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0
 * This component provides the quantum computing interface for the
 * DNA-protected application.
 * 
 * FEATURES:
 * - Quantum computing capabilities with DNA protection
 * - Self-verification mechanisms
 * - Copyright protection embedded in the UI
 * - Quantum-secured encryption operations
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Cpu, Lock, Shield, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { useDNAProtection } from '../components/DNAProtectionProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { quantumService } from '../lib/quantum-service';
import { quantumSystemsService } from '../lib/storage-service';

// Quantum Page component
const QuantumPage: React.FC = () => {
  // Get protection from context
  const { copyrightInfo, applyProtection } = useDNAProtection();
  
  // Apply protection to this component
  const protection = applyProtection('quantum-page');
  
  // Component state
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [systemStatus, setSystemStatus] = useState({
    active: false,
    systemId: null as number | null,
    securityLevel: '',
    qubitsAvailable: false,
    watermark: '',
    copyright: ''
  });
  const [quantumSystems, setQuantumSystems] = useState<any[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Load data on mount
  useEffect(() => {
    // Get system status
    const status = quantumService.getSecurityStatus();
    setSystemStatus(status);
    
    // Get quantum systems
    const systems = quantumSystemsService.getSystems();
    setQuantumSystems(systems);
  }, []);
  
  // Initialize a quantum system
  const initializeQuantumSystem = async () => {
    setIsInitializing(true);
    
    try {
      // Initialize the quantum system
      const success = await quantumService.initializeQuantumSystem(64, 95);
      
      if (success) {
        // Update system status
        const status = quantumService.getSecurityStatus();
        setSystemStatus(status);
        
        // Get updated quantum systems
        const systems = quantumSystemsService.getSystems();
        setQuantumSystems(systems);
      }
    } catch (error) {
      console.error('Failed to initialize quantum system:', error);
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Encrypt text with quantum security
  const encryptText = () => {
    if (!textToEncrypt) return;
    
    try {
      // Encrypt the text
      const result = quantumService.encryptText(textToEncrypt);
      
      // Update state
      setEncryptedText(result.encrypted);
      setEncryptionKey(result.key);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };
  
  return (
    <div
      className="flex flex-col min-h-[90vh]"
      data-component-id="quantum-page"
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
          <Cpu className="w-6 h-6 mr-2 text-cyan-400" />
          Quantum Computing Interface
        </h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={initializeQuantumSystem}
          disabled={isInitializing}
          className="text-cyan-400 border-cyan-900"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isInitializing ? 'animate-spin' : ''}`} />
          {isInitializing ? 'Initializing...' : 'Initialize Quantum System'}
        </Button>
      </header>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Quantum status */}
        <Card className="bg-gray-900 border-cyan-900 shadow-lg col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-cyan-400">Quantum Status</CardTitle>
              <Badge variant="outline" className={`${systemStatus.active ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                {systemStatus.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <CardDescription>
              Current quantum system status and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">System ID:</span>
                <span className="text-white">{systemStatus.systemId || 'Not initialized'}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Security Level:</span>
                <span className="text-white">{systemStatus.securityLevel}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Qubits:</span>
                <span className="text-white">{systemStatus.qubitsAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Owner:</span>
                <span className="text-white">{systemStatus.copyright || copyrightInfo.owner}</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-800">
              <h3 className="text-sm font-medium text-cyan-400 mb-2">Quantum Security</h3>
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm text-gray-300">DNA-protected quantum operations</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                All quantum operations are secured with DNA watermarking and verification chains.
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-gray-500 w-full">
              <div className="truncate">
                <span className="text-gray-400">Watermark: </span>
                {systemStatus.watermark}
              </div>
            </div>
          </CardFooter>
        </Card>
        
        {/* Middle column - Quantum encryption */}
        <Card className="bg-gray-900 border-cyan-900 shadow-lg col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Quantum Encryption
            </CardTitle>
            <CardDescription>
              Encrypt text with quantum-secured algorithms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Text to Encrypt
              </label>
              <Input
                value={textToEncrypt}
                onChange={(e) => setTextToEncrypt(e.target.value)}
                placeholder="Enter text to encrypt with quantum security..."
                className="bg-black/50 border-gray-800 placeholder:text-gray-600"
              />
            </div>
            
            <Button 
              onClick={encryptText}
              disabled={!textToEncrypt || !systemStatus.qubitsAvailable}
              className="w-full bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800/50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Encrypt with Quantum Security
            </Button>
            
            {encryptedText && (
              <div className="space-y-3 pt-3 border-t border-gray-800">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Encrypted Text
                  </label>
                  <div className="bg-black/70 p-2 rounded border border-gray-800 text-sm text-green-400 font-mono overflow-auto max-h-20">
                    {encryptedText}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Quantum Key (Keep Secure)
                  </label>
                  <div className="bg-black/70 p-2 rounded border border-gray-800 text-sm text-yellow-400 font-mono overflow-auto max-h-20">
                    {encryptionKey}
                  </div>
                </div>
                
                <div className="flex items-start pt-2">
                  <Shield className="w-4 h-4 text-cyan-400 mr-2 mt-0.5" />
                  <div className="text-xs text-gray-400">
                    This text is now protected with DNA-secured quantum encryption.
                    The original text cannot be recovered without both the encrypted text and the quantum key.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Quantum systems list */}
      <Card className="bg-gray-900 border-cyan-900 shadow-lg mt-6">
        <CardHeader className="py-3">
          <CardTitle className="text-lg text-cyan-400">Quantum Systems</CardTitle>
          <CardDescription>
            Initialized quantum systems with DNA protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quantumSystems.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {quantumSystems.map((system) => (
                <div key={system.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="font-medium text-white">Quantum System {system.id}</span>
                      <Badge variant="outline" className="ml-2 bg-green-900/20 text-green-400 text-xs">
                        {system.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {system.qubits} qubits • {system.entanglementQuality}% entanglement • {system.securityStrength} security
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Last verified: {new Date(system.lastVerification).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No quantum systems initialized.
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={initializeQuantumSystem}
                  disabled={isInitializing}
                  className="text-cyan-400 border-cyan-900"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isInitializing ? 'animate-spin' : ''}`} />
                  {isInitializing ? 'Initializing...' : 'Initialize Quantum System'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm py-4">
        <p className="mb-1">{copyrightInfo.full}</p>
        <p>Quantum DNA Security System v4.0 - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default QuantumPage;