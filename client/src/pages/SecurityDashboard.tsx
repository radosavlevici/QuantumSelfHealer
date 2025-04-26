/**
 * !!! SECURITY DASHBOARD - ROOT ACCESS DEMONSTRATION !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE SECURITY DASHBOARD
 * 
 * This component provides a visual demonstration of the security
 * systems protecting the copyright and root access. It shows how
 * the system prevents any modification to the root credentials
 * and copyright information.
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Key, 
  RefreshCw, 
  X, 
  Check, 
  AlarmClock,
  Cloud,
  Database,
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
    
    // Initialize cloud sync
    initializeCloudSync();
    
    return () => clearInterval(interval);
  }, []);
  
  // Initialize cloud synchronization
  const initializeCloudSync = async () => {
    try {
      const success = await cloudSync.initialize();
      setSyncStatus(success ? 'active' : 'error');
      
      if (success) {
        const devices = cloudSync.getConnectedDevices();
        setConnectedDevices(devices.length);
      }
    } catch (error) {
      setSyncStatus('error');
      console.error("Failed to initialize cloud sync:", error);
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
        <div className="bg-gray-900 rounded-lg p-6 border border-blue-900">
          <div className="flex items-center mb-4">
            <Cloud className="h-5 w-5 mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold">iCloud Synchronization</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-900/30 p-3 rounded-md text-sm">
              This panel shows the status of the iCloud synchronization service that allows
              the system to work across all your authorized devices while maintaining
              the same level of security and copyright protection.
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Sync Status:</div>
              <div className={`bg-gray-800 p-2 rounded flex items-center ${
                syncStatus === 'active' ? 'text-green-400' : 
                syncStatus === 'error' ? 'text-red-400' : 
                'text-yellow-400'
              }`}>
                {syncStatus === 'active' ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : syncStatus === 'error' ? (
                  <X className="h-4 w-4 mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                <span>{syncStatus.toUpperCase()}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Connected Devices:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-1 text-blue-400" />
                  <Laptop className="h-4 w-4 mr-1 text-green-400" />
                  <Tablet className="h-4 w-4 text-purple-400" />
                </div>
                <span className="ml-2">{connectedDevices} devices</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Owner Account:</div>
              <div className="bg-gray-800 p-2 rounded flex items-center">
                <User className="h-4 w-4 mr-2 text-yellow-400" />
                <span>{ROOT_USER_EMAIL}</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-900 hover:bg-blue-800 p-2 rounded-md flex items-center justify-center text-sm"
              onClick={initializeCloudSync}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Cloud Status
            </button>
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