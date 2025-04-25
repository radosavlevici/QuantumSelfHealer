/**
 * !!! DNA PROTECTED COMPONENT - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0
 * This component provides the home page for the DNA-protected application
 * with quantum computing capabilities.
 * 
 * FEATURES:
 * - DNA-protected interface
 * - Self-verification mechanisms
 * - Copyright protection embedded in the UI
 * - Quantum security integration
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import React from 'react';
import { Link } from 'wouter';
import { Terminal, Shield, Cpu, Settings, ChevronRight } from 'lucide-react';
import { useDNAProtection } from '../components/DNAProtectionProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Home Page component
const HomePage: React.FC = () => {
  // Get protection from context
  const { copyrightInfo, applyProtection } = useDNAProtection();
  
  // Apply protection to this component
  const protection = applyProtection('home-page');
  
  return (
    <div
      className="flex flex-col min-h-[90vh]"
      data-component-id="home-page"
      data-component-type="page"
      data-watermark={protection.watermark}
      data-dna-signature={protection.dnaSignature}
    >
      {/* Header */}
      <header className="py-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Quantum DNA Security System
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Advanced AI-powered security with quantum-inspired DNA protection, 
          designed to safeguard intellectual property and prevent unauthorized copying.
        </p>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Terminal card */}
          <Card className="bg-gray-900 border-cyan-900 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-cyan-400">
                <Terminal className="h-5 w-5 mr-2" />
                Quantum Terminal
              </CardTitle>
              <CardDescription>
                Access the advanced terminal with quantum-powered commands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Execute quantum-secured operations through an intuitive terminal interface with
                persistent command history and DNA-based verification.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/terminal">
                <Button variant="outline" className="w-full text-cyan-400 border-cyan-900 hover:bg-cyan-950">
                  Launch Terminal <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Security card */}
          <Card className="bg-gray-900 border-cyan-900 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-cyan-400">
                <Shield className="h-5 w-5 mr-2" />
                DNA Protection
              </CardTitle>
              <CardDescription>
                Monitor and control the DNA-based security system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                View and manage security status, watermarks, signatures, and verification
                chains that protect your intellectual property from theft.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/security">
                <Button variant="outline" className="w-full text-cyan-400 border-cyan-900 hover:bg-cyan-950">
                  Security Dashboard <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Quantum card */}
          <Card className="bg-gray-900 border-cyan-900 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-cyan-400">
                <Cpu className="h-5 w-5 mr-2" />
                Quantum Computing
              </CardTitle>
              <CardDescription>
                Access quantum computing capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Leverage quantum-inspired algorithms for encryption, simulation,
                and advanced computational operations with DNA-based security.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/quantum">
                <Button variant="outline" className="w-full text-cyan-400 border-cyan-900 hover:bg-cyan-950">
                  Quantum Dashboard <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* System status */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">System Information</h2>
          <div className="inline-block bg-black/40 border border-cyan-900 rounded-lg p-4 text-left">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="text-gray-400">Copyright Owner:</div>
              <div className="text-white">{copyrightInfo.owner}</div>
              
              <div className="text-gray-400">Birthdate:</div>
              <div className="text-white">{copyrightInfo.birthdate}</div>
              
              <div className="text-gray-400">Contact:</div>
              <div className="text-cyan-400">{copyrightInfo.email}</div>
              
              <div className="text-gray-400">Component ID:</div>
              <div className="text-white">home-page</div>
              
              <div className="text-gray-400">Watermark:</div>
              <div className="text-white truncate max-w-[200px]">{protection.watermark}</div>
              
              <div className="text-gray-400">DNA Signature:</div>
              <div className="text-white truncate max-w-[200px]">{protection.dnaSignature}</div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm py-4">
        <p className="mb-1">{copyrightInfo.full}</p>
        <p>Quantum DNA Security System v4.0 - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HomePage;