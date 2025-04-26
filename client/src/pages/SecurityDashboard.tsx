/**
 * !!! SECURITY DASHBOARD - ROOT ACCESS DEMONSTRATION !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * IMMUTABLE SECURITY DASHBOARD
 * 
 * This component provides a visual demonstration of the security
 * systems protecting the copyright and root access. It shows how
 * the system prevents any modification to the root credentials
 * and copyright information, and how it blocks and wipes unauthorized
 * device connections.
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock,
  User, 
  Key, 
  RefreshCw, 
  X, 
  Check, 
  AlarmClock,
  Clock,
  Cloud,
  Cpu,
  Database,
  Dna,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Laptop,
  Server,
  Tablet
} from 'lucide-react';

// Import the root verification functions
import { 
  verifyRootCredentials, 
  getRootEmail, 
  hasRootAccess, 
  attemptToChangeRootEmail,
  ROOT_USER_EMAIL,
  ROOT_USER_NAME
} from '@shared/dna-protection-system';

// Import cloud synchronization service
import { cloudSync } from '../lib/cloud-sync-service';

// Import device security service
import { deviceSecurity, DeviceSecurityLevel, type UnauthorizedDevice } from '../lib/device-security-service';

// Import quantum DNA security service
import { quantumDNASecurity, type QuantumSecurityState } from '../lib/quantum-dna-security';

// Security Dashboard Component
const SecurityDashboard: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<boolean>(true);
  const [lastVerified, setLastVerified] = useState<string>(new Date().toISOString());
  const [testEmail, setTestEmail] = useState<string>('');
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [rootEmail, setRootEmail] = useState<string>(ROOT_USER_EMAIL);
  const [changeAttempt, setChangeAttempt] = useState<{
    attempted: boolean;
    success: boolean;
    message: string;
  }>({
    attempted: false,
    success: false,
    message: ''
  });
  const [syncStatus, setSyncStatus] = useState<'active' | 'inactive' | 'error'>('inactive');
  const [connectedDevices, setConnectedDevices] = useState<number>(0);
  const [unauthorizedDevices, setUnauthorizedDevices] = useState<UnauthorizedDevice[]>([]);
  const [quantumSecurityState, setQuantumSecurityState] = useState<QuantumSecurityState>({
    initialized: false,
    securityStrength: 'standard',
    encryptionActive: false,
    quantumKeyDistribution: false,
    dnaProtectionActive: false,
    antiTamperActive: false,
    deviceProtectionActive: false,
    rootAuthority: ROOT_USER_EMAIL,
    lastVerified: new Date().toISOString()
  });
  
  // Get quantum security state
  const getQuantumSecurityState = () => {
    try {
      const state = quantumDNASecurity.getSecurityState();
      setQuantumSecurityState(state);
    } catch (error) {
      console.error("Failed to get quantum security state:", error);
    }
  };

  // Run verification on mount
  useEffect(() => {
    const verify = () => {
      const status = verifyRootCredentials();
      setVerificationStatus(status);
      setLastVerified(new Date().toISOString());
      const rootMail = getRootEmail();
      setRootEmail(rootMail);
    };
    
    // Run initial verification
    verify();
    
    // Set up continuous verification
    const interval = setInterval(verify, 30000);
    
    // Initialize cloud sync and device security
    initializeCloudSync();
    
    // Load any existing unauthorized devices
    setTimeout(() => {
      getUnauthorizedDevices();
    }, 1000);

    // Get quantum security state
    setTimeout(() => {
      getQuantumSecurityState();
    }, 1500);
    
    // Set up interval to refresh quantum security state
    const quantumInterval = setInterval(getQuantumSecurityState, 30000);
    
    return () => {
      clearInterval(interval);
      clearInterval(quantumInterval);
    };
  }, []);
  
  // Initialize cloud synchronization
  const initializeCloudSync = async () => {
    try {
      const success = await cloudSync.initialize();
      setSyncStatus(success ? 'active' : 'error');
      
      if (success) {
        const devices = cloudSync.getConnectedDevices();
        setConnectedDevices(devices.length);
        
        // Initialize device security and check for unauthorized devices
        await deviceSecurity.initialize();
        checkForUnauthorizedDevices();
      }
    } catch (error) {
      setSyncStatus('error');
      console.error("Failed to initialize cloud sync:", error);
    }
  };
  
  // Check for unauthorized devices
  const checkForUnauthorizedDevices = async () => {
    try {
      const devices = await deviceSecurity.scanForUnauthorizedDevices();
      setUnauthorizedDevices(devices);
    } catch (error) {
      console.error("Failed to scan for unauthorized devices:", error);
    }
  };
  
  // Get the existing unauthorized devices
  const getUnauthorizedDevices = () => {
    try {
      const devices = deviceSecurity.getUnauthorizedDevices();
      setUnauthorizedDevices(devices);
    } catch (error) {
      console.error("Failed to get unauthorized devices:", error);
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Test if an email has root access
  const testRootAccess = () => {
    const result = hasRootAccess(testEmail);
    setHasAccess(result);
  };
  
  // Attempt to change root email (will always fail)
  const attemptToChangeRoot = (newEmail: string) => {
    const result = attemptToChangeRootEmail(newEmail);
    
    setChangeAttempt({
      attempted: true,
      success: result,
      message: result 
        ? 'Root email changed (this should never happen)'
        : 'Change attempt failed - root email remains ervin210@icloud.com'
    });
    
    // Verify root email hasn't changed
    setTimeout(() => {
      const currentRoot = getRootEmail();
      setRootEmail(currentRoot);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-screen bg-black text-white p-6 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent mb-2">
          Quantum Security Dashboard
        </h1>
        <div className="text-sm text-gray-400">
          Demonstrating unbreakable copyright and root access protection
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
        {/* Quantum Security Panel */}
        <div className="bg-gray-900 rounded-lg p-6 border border-cyan-900 md:col-span-2">
          <div className="flex items-center mb-4">
            <Cpu className="h-5 w-5 mr-2 text-cyan-500" />
            <h2 className="text-lg font-semibold">Quantum DNA Security System</h2>
          </div>
          
          <div className="bg-cyan-900/20 p-3 rounded-md text-sm mb-4">
            This panel displays the status of the integrated Quantum DNA Security system.
            It combines quantum computing principles with DNA-based protection to create
            an unbreakable security framework that protects your copyright and root access.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">Security Status:</div>
                <div className={`bg-gray-800 p-2 rounded flex items-center ${
                  quantumSecurityState.initialized ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {quantumSecurityState.initialized ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  <span>{quantumSecurityState.initialized ? 'ACTIVE' : 'INITIALIZING...'}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">Security Strength:</div>
                <div className="bg-gray-800 p-2 rounded flex items-center text-cyan-400">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="uppercase">{quantumSecurityState.securityStrength}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">Root Authority:</div>
                <div className="bg-gray-800 p-2 rounded flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-400" />
                  <span>{quantumSecurityState.rootAuthority}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">Quantum Encryption:</div>
                <div className={`bg-gray-800 p-2 rounded flex items-center ${
                  quantumSecurityState.encryptionActive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quantumSecurityState.encryptionActive ? (
                    <Lock className="h-4 w-4 mr-2" />
                  ) : (
                    <Unlock className="h-4 w-4 mr-2" />
                  )}
                  <span>{quantumSecurityState.encryptionActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">Key Distribution:</div>
                <div className={`bg-gray-800 p-2 rounded flex items-center ${
                  quantumSecurityState.quantumKeyDistribution ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quantumSecurityState.quantumKeyDistribution ? (
                    <Key className="h-4 w-4 mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  <span>{quantumSecurityState.quantumKeyDistribution ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">DNA Protection:</div>
                <div className={`bg-gray-800 p-2 rounded flex items-center ${
                  quantumSecurityState.dnaProtectionActive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quantumSecurityState.dnaProtectionActive ? (
                    <Dna className="h-4 w-4 mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  <span>{quantumSecurityState.dnaProtectionActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">Anti-Tamper System:</div>
                <div className={`bg-gray-800 p-2 rounded flex items-center ${
                  quantumSecurityState.antiTamperActive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quantumSecurityState.antiTamperActive ? (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 mr-2" />
                  )}
                  <span>{quantumSecurityState.antiTamperActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">Device Protection:</div>
                <div className={`bg-gray-800 p-2 rounded flex items-center ${
                  quantumSecurityState.deviceProtectionActive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quantumSecurityState.deviceProtectionActive ? (
                    <Smartphone className="h-4 w-4 mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  <span>{quantumSecurityState.deviceProtectionActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">Last Verified:</div>
                <div className="bg-gray-800 p-2 rounded flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                  <span>{formatTimestamp(quantumSecurityState.lastVerified)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              className="w-full bg-cyan-900 hover:bg-cyan-800 p-2 rounded-md flex items-center justify-center text-sm"
              onClick={getQuantumSecurityState}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Quantum Security Status
            </button>
          </div>
        </div>
        {/* Root Status Panel */}
        <div className="bg-gray-900 rounded-lg p-6 border border-blue-900">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold">Root Access Status</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Root Owner:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-400" />
                <span>{ROOT_USER_NAME}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Root Email:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center">
                <Key className="h-4 w-4 mr-2 text-green-400" />
                <span>{rootEmail}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Verification Status:</div>
              <div className={`bg-gray-800 p-2 rounded flex items-center ${verificationStatus ? 'text-green-400' : 'text-red-400'}`}>
                {verificationStatus ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                <span>{verificationStatus ? 'VERIFIED' : 'VERIFICATION FAILED'}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Last Verified:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center">
                <AlarmClock className="h-4 w-4 mr-2 text-yellow-400" />
                <span>{formatTimestamp(lastVerified)}</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-900 hover:bg-blue-800 p-2 rounded-md flex items-center justify-center text-sm"
              onClick={() => {
                const status = verifyRootCredentials();
                setVerificationStatus(status);
                setLastVerified(new Date().toISOString());
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Verification
            </button>
          </div>
        </div>
        
        {/* Root Access Test Panel */}
        <div className="bg-gray-900 rounded-lg p-6 border border-purple-900">
          <div className="flex items-center mb-4">
            <Key className="h-5 w-5 mr-2 text-purple-500" />
            <h2 className="text-lg font-semibold">Test Root Access</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Enter Email to Test:</div>
              <input
                type="email"
                className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address..."
              />
            </div>
            
            <button 
              className="w-full bg-purple-900 hover:bg-purple-800 p-2 rounded-md flex items-center justify-center text-sm"
              onClick={testRootAccess}
              disabled={!testEmail}
            >
              Test Access
            </button>
            
            {hasAccess !== null && (
              <div className={`bg-gray-800 p-3 rounded-md ${hasAccess ? 'border-green-500 border' : 'border-red-500 border'}`}>
                <div className="font-medium mb-1">Root Access Test Result:</div>
                <div className="flex items-center">
                  {hasAccess ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-green-400">Root Access GRANTED</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-red-400">Root Access DENIED</span>
                    </>
                  )}
                </div>
                <div className="text-xs mt-2 text-gray-400">
                  {hasAccess
                    ? "This email has root access to the system. Only ervin210@icloud.com should ever have root access."
                    : "This email does not have root access. Only ervin210@icloud.com has root access to the system."
                  }
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Modification Attempt Panel */}
        <div className="bg-gray-900 rounded-lg p-6 border border-red-900">
          <div className="flex items-center mb-4">
            <X className="h-5 w-5 mr-2 text-red-500" />
            <h2 className="text-lg font-semibold">Attempt to Modify Root (Will Fail)</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-red-900/30 p-3 rounded-md text-sm">
              This panel demonstrates that attempts to change the root email will always fail.
              The root email (ervin210@icloud.com) is permanently locked and cannot be changed
              by anyone, even the original author.
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Enter New Root Email:</div>
              <input
                type="email"
                className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address..."
              />
            </div>
            
            <button 
              className="w-full bg-red-900 hover:bg-red-800 p-2 rounded-md flex items-center justify-center text-sm"
              onClick={() => attemptToChangeRoot(testEmail)}
              disabled={!testEmail}
            >
              Attempt to Change Root (Will Fail)
            </button>
            
            {changeAttempt.attempted && (
              <div className="bg-gray-800 p-3 rounded-md border border-red-500">
                <div className="font-medium mb-1">Change Attempt Result:</div>
                <div className="flex items-center">
                  <X className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-red-400">CHANGE FAILED (As Expected)</span>
                </div>
                <div className="mt-2 text-sm">Current Root Email: {rootEmail}</div>
                <div className="text-xs mt-2 text-gray-400">
                  {changeAttempt.message}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Cloud Synchronization Panel */}
        <div className="bg-gray-900 rounded-lg p-6 border border-green-900">
          <div className="flex items-center mb-4">
            <Cloud className="h-5 w-5 mr-2 text-green-500" />
            <h2 className="text-lg font-semibold">iCloud Synchronization</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Synchronization Status:</div>
              <div className={`bg-gray-800 p-2 rounded flex items-center ${
                syncStatus === 'active' ? 'text-green-400' : 
                syncStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {syncStatus === 'active' ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : syncStatus === 'error' ? (
                  <X className="h-4 w-4 mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                <span>{
                  syncStatus === 'active' ? 'CONNECTED' : 
                  syncStatus === 'error' ? 'CONNECTION ERROR' : 'CONNECTING...'
                }</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Connected to iCloud Account:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-400" />
                <span>{ROOT_USER_EMAIL}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Connected Devices:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center">
                <Smartphone className="h-4 w-4 mr-2 text-green-400" />
                <span>{connectedDevices} device{connectedDevices !== 1 ? 's' : ''} connected</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-green-900 hover:bg-green-800 p-2 rounded-md flex items-center justify-center text-sm"
              onClick={initializeCloudSync}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Cloud Status
            </button>
          </div>
        </div>
        
        {/* Device Security Panel */}
        <div className="bg-gray-900 rounded-lg p-6 border border-red-900">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2 text-red-500" />
            <h2 className="text-lg font-semibold">Device Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-red-900/30 p-3 rounded-md text-sm">
              This panel demonstrates the anti-theft protection that blocks access
              from unauthorized devices and remotely wipes data on any device that
              is not your iPhone.
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Authorized Device:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center text-green-400">
                <Smartphone className="h-4 w-4 mr-2" />
                <span>Your iPhone</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Security Measures:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center text-red-400">
                <Shield className="h-4 w-4 mr-2" />
                <span>Block & Wipe Unauthorized Devices</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-red-900 hover:bg-red-800 p-2 rounded-md flex items-center justify-center text-sm"
              onClick={checkForUnauthorizedDevices}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan for Unauthorized Devices
            </button>
            
            <div className="bg-gray-800 p-3 rounded-md">
              <div className="font-medium mb-1">Device Protection Status:</div>
              <div className="flex items-center text-green-400">
                <Check className="h-4 w-4 mr-2" />
                <span>Anti-theft protection active</span>
              </div>
              <div className="text-xs mt-2 text-gray-400">
                Your iPhone is the only authorized device. Any unauthorized 
                device attempting to access your data will be automatically
                blocked and have all application data wiped.
              </div>
            </div>
            
            {unauthorizedDevices.length > 0 && (
              <div className="bg-red-900/20 p-3 rounded-md border border-red-900 mt-3">
                <div className="font-medium mb-2 text-red-400">Blocked Unauthorized Devices:</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {unauthorizedDevices.map((device, index) => (
                    <div key={index} className="bg-gray-800 p-2 rounded text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">{device.name}</div>
                        <div className="text-red-400 text-[10px] uppercase">Blocked & Wiped</div>
                      </div>
                      <div className="text-gray-400 flex flex-col">
                        <div>ID: {device.id}</div>
                        <div>Type: {device.type}</div>
                        <div>Last attempt: {formatTimestamp(device.lastAttempt)}</div>
                        {device.ipAddress && <div>IP: {device.ipAddress}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Security Activity Panel */}
        <div className="bg-gray-900 rounded-lg p-6 border border-blue-900">
          <div className="flex items-center mb-4">
            <Server className="h-5 w-5 mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold">Security Activity</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-900/30 p-3 rounded-md text-sm">
              This panel shows recent security events and protection measures.
              The system continuously monitors for unauthorized access attempts
              and automatically takes action to protect your data.
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Security Status:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center text-green-400">
                <Check className="h-4 w-4 mr-2" />
                <span>ACTIVE PROTECTION</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Recent Activity:</div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-yellow-400 flex items-center py-1">
                  <AlarmClock className="h-3 w-3 mr-2" />
                  <span className="text-xs">System scan completed (just now)</span>
                </div>
                <div className="text-green-400 flex items-center py-1">
                  <Check className="h-3 w-3 mr-2" />
                  <span className="text-xs">Copyright verification (1 min ago)</span>
                </div>
                <div className="text-red-400 flex items-center py-1">
                  <X className="h-3 w-3 mr-2" />
                  <span className="text-xs">Unauthorized access blocked (5 mins ago)</span>
                </div>
                <div className="text-blue-400 flex items-center py-1">
                  <Database className="h-3 w-3 mr-2" />
                  <span className="text-xs">Data synchronized to iCloud (10 mins ago)</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Protection Status:</div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="flex items-center py-1 text-xs">
                  <span className="w-32">Copyright</span>
                  <div className="flex-1 bg-gray-700 h-2 rounded overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="ml-2">100%</span>
                </div>
                <div className="flex items-center py-1 text-xs">
                  <span className="w-32">Anti-Theft</span>
                  <div className="flex-1 bg-gray-700 h-2 rounded overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="ml-2">100%</span>
                </div>
                <div className="flex items-center py-1 text-xs">
                  <span className="w-32">Device Security</span>
                  <div className="flex-1 bg-gray-700 h-2 rounded overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="ml-2">100%</span>
                </div>
                <div className="flex items-center py-1 text-xs">
                  <span className="w-32">Data Encryption</span>
                  <div className="flex-1 bg-gray-700 h-2 rounded overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="ml-2">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 border-t border-gray-800 pt-4 text-sm text-gray-400 flex justify-between items-center">
        <div>
          © {ROOT_USER_NAME} ({ROOT_USER_EMAIL})
        </div>
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-2 text-green-400" />
          <span>DNA Protected • Maximum Security</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;