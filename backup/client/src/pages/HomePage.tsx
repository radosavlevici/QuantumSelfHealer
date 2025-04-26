/**
 * !!! DNA PROTECTED PAGE - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - HOME PAGE
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

import React from 'react';
import { Link } from 'wouter';
import { Terminal, Database, Shield, Fingerprint, Server, LucideGithub, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDNAProtection } from '../components/DNAProtectionProvider';

const HomePage: React.FC = () => {
  // Get protection from context
  const { copyrightInfo, applyProtection } = useDNAProtection();
  
  // Apply protection to this component
  const protection = applyProtection('home-page', 'page');
  
  return (
    <div
      className="space-y-8"
      data-component-id="home-page"
      data-component-type="page"
      data-watermark={protection.watermark}
      data-dna-signature={protection.dnaSignature}
    >
      {/* Hero section */}
      <section className="text-center py-10 space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          Quantum DNA Security System
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Advanced AI-powered application with cutting-edge DNA-based security and 
          self-repair mechanisms, designed to protect intellectual property.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Fingerprint className="w-8 h-8 text-cyan-400" />
          <Shield className="w-8 h-8 text-purple-500" />
          <Database className="w-8 h-8 text-emerald-500" />
        </div>
      </section>
      
      {/* Copyright notice */}
      <section className="bg-black/50 border border-cyan-900/20 rounded-lg p-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-semibold text-white">DNA-Based Security System</h2>
        </div>
        <p className="text-gray-300 text-sm mb-3">
          This application includes a comprehensive DNA-based security system with 
          watermarking and verification chains that protect intellectual property.
        </p>
        <div className="text-xs text-cyan-300/80">
          <p>{copyrightInfo.full}</p>
          <p className="mt-1">Quantum DNA Security v{copyrightInfo.version}</p>
        </div>
      </section>
      
      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {/* Terminal card */}
        <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-900/50 transition-colors">
          <CardHeader>
            <Terminal className="w-8 h-8 text-cyan-400 mb-2" />
            <CardTitle>Quantum Terminal</CardTitle>
            <CardDescription>
              Access the advanced quantum-enhanced security terminal interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">
              Execute secure commands in a protected environment with DNA-based 
              watermarking and verification on every operation.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/terminal">
              <Button variant="default" className="w-full bg-cyan-900 hover:bg-cyan-800">
                Open Terminal
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Quantum Systems card */}
        <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-900/50 transition-colors">
          <CardHeader>
            <Server className="w-8 h-8 text-purple-400 mb-2" />
            <CardTitle>Quantum Systems</CardTitle>
            <CardDescription>
              Explore the quantum computing capabilities of the security system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">
              View and create quantum computing instances with advanced 
              entanglement and security features built in from the beginning.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/quantum">
              <Button variant="default" className="w-full bg-purple-900 hover:bg-purple-800">
                Quantum Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Documentation card */}
        <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-900/50 transition-colors">
          <CardHeader>
            <LucideGithub className="w-8 h-8 text-emerald-400 mb-2" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Learn about the DNA-based security system and its features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">
              Detailed documentation on the unified security system, built from
              the beginning with self-repair and anti-theft capabilities.
            </p>
          </CardContent>
          <CardFooter>
            <a href="https://github.com/user/quantum-dna-security" target="_blank" rel="noopener noreferrer">
              <Button variant="default" className="w-full bg-emerald-900 hover:bg-emerald-800">
                <span>Documentation</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </CardFooter>
        </Card>
      </section>
      
      {/* Security signature footer */}
      <footer className="text-center text-xs text-gray-500 pt-6 pb-2">
        <p>DNA Signature: {protection.dnaSignature.substring(0, 16)}...</p>
        <p>All components built as one unified system from the beginning.</p>
      </footer>
    </div>
  );
};

export default HomePage;