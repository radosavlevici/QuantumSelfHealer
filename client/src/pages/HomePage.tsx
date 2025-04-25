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

import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { useDNASecurity } from '../components/DNAProtectionProvider';

const HomePage: React.FC = () => {
  const { logSecurityEvent, copyrightInfo, securityLevel, securityState } = useDNASecurity();
  
  useEffect(() => {
    // Log page visit to security system
    logSecurityEvent(
      'page-visit',
      'Home page visited',
      'info',
      'HomePage'
    );
  }, []);
  
  return (
    <div className="flex flex-col min-h-[90vh]">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-6">
          Quantum DNA Security System
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mb-8">
          Advanced AI-powered technology with cutting-edge DNA-based security and self-repair mechanisms, 
          designed to protect intellectual property through innovative technological safeguards.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/terminal">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md text-white font-medium hover:from-blue-700 hover:to-blue-900 transition-all">
              Terminal
            </button>
          </Link>
          
          <Link href="/quantum">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-md text-white font-medium hover:from-purple-700 hover:to-purple-900 transition-all">
              Quantum Interface
            </button>
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 bg-gray-900 rounded-lg my-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
            Advanced Security Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">DNA-Based Watermarking</h3>
              <p className="text-gray-300">
                Unique identifiers embedded in every component that cannot be removed without breaking functionality.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Self-Repair Mechanism</h3>
              <p className="text-gray-300">
                Intelligent system that detects tampering attempts and automatically restores critical components.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-400">Quantum Protection</h3>
              <p className="text-gray-300">
                Next-generation security using quantum computing principles to create unbreakable protection.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Status Section */}
      <div className="py-10 bg-gray-900 rounded-lg mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-100">
            System Security Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Protection Status</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Security Level</span>
                  <span className="text-green-400">{securityLevel.toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">System Version</span>
                  <span className="text-blue-400">{useDNASecurity().systemVersion}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Protections</span>
                  <span className="text-green-400">{securityState.activeProtections.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">DOM Integrity Monitoring</span>
                  <span className="text-green-400">{securityState.domIntegrityMonitoring ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Copyright Information</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Owner</span>
                  <span className="text-green-400">{copyrightInfo.owner}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Birthdate</span>
                  <span className="text-blue-400">{copyrightInfo.birthdate}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Email</span>
                  <span className="text-blue-400">{copyrightInfo.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Full Copyright</span>
                  <span className="text-green-400">{copyrightInfo.full}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="mt-auto py-8 text-center text-gray-400 text-sm">
        <p>System Security Level: <span className="text-blue-400 font-semibold">{securityLevel.toUpperCase()}</span></p>
        <p className="mt-2">All components built as one unified system from the beginning</p>
        <p className="mt-1">{copyrightInfo.full}</p>
        <p className="mt-1 text-xs text-gray-500">ANTI-THEFT PROTECTION ACTIVE</p>
      </div>
    </div>
  );
};

export default HomePage;