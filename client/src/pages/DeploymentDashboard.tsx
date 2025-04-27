/**
 * !!! DNA PROTECTED COMPONENT - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987), David Cornelius Marshall, and Serena Elizabeth Thorne
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * DEPLOYMENT DASHBOARD WITH REAL CONNECTIONS
 * This component provides a dashboard for deploying the application to:
 * - Apple App Store
 * - Apple Developer Portal
 * - AWS Cloud
 * - GitHub
 * 
 * It uses real connections through the DeploymentService to manage
 * and track deployments to these services. This component is part
 * of the unified security system with DNA-based protection.
 */

import React, { useState, useEffect } from 'react';
import { deploymentService, DeploymentStatus, DeploymentTarget, DeploymentOptions } from '../lib/deployment-service';
import { addDNAWatermark } from '@shared/quantum-dna-security';
import { externalConnections } from '../lib/external-connections';

// Component DNA information
const COMPONENT_ID = 'deployment-dashboard';
const COMPONENT_TYPE = 'dashboard';

const DeploymentDashboard: React.FC = () => {
  // State for deployments
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([]);
  const [activeDeployments, setActiveDeployments] = useState<DeploymentStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  
  // New deployment form state
  const [deploymentTarget, setDeploymentTarget] = useState<DeploymentTarget>(DeploymentTarget.IOS_APP_STORE);
  const [version, setVersion] = useState<string>('1.0.0');
  const [buildNumber, setBuildNumber] = useState<string>('1');
  const [releaseNotes, setReleaseNotes] = useState<string>('');
  
  // Connection status
  const [connectionStatus, setConnectionStatus] = useState<{
    aiConnected: boolean;
    quantumConnected: boolean;
    cloudConnected: boolean;
    allConnected: boolean;
  }>({
    aiConnected: false,
    quantumConnected: false,
    cloudConnected: false,
    allConnected: false
  });
  
  // Initialize services on component mount
  useEffect(() => {
    const initializeServices = async () => {
      setLoading(true);
      
      try {
        // Initialize deployment service if not already initialized
        if (!initialized) {
          console.log('Initializing Deployment Service...');
          await deploymentService.initialize();
          setInitialized(true);
          console.log('Deployment Service initialized successfully');
        }
        
        // Initialize external connections
        console.log('Initializing External Connections...');
        await externalConnections.initialize();
        console.log('External Connections initialized successfully');
        
        // Check connection status
        const aiStatus = externalConnections.getConnectionStatus('openai')?.connected || 
                       externalConnections.getConnectionStatus('anthropic')?.connected || false;
        
        const quantumStatus = externalConnections.getConnectionStatus('ibm-quantum')?.connected || 
                            externalConnections.getConnectionStatus('azure-quantum')?.connected || false;
        
        const cloudStatus = externalConnections.getConnectionStatus('icloud')?.connected || false;
        
        const allConnected = externalConnections.areAllServicesConnected();
        
        setConnectionStatus({
          aiConnected: aiStatus,
          quantumConnected: quantumStatus,
          cloudConnected: cloudStatus,
          allConnected
        });
        
        // Get deployments
        refreshDeployments();
      } catch (error) {
        console.error('Failed to initialize services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeServices();
    
    // Set up interval to refresh deployments
    const interval = setInterval(refreshDeployments, 3000);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [initialized]);
  
  // Function to refresh deployments
  const refreshDeployments = () => {
    try {
      const allDeps = deploymentService.getAllDeployments();
      const activeDeps = deploymentService.getActiveDeployments();
      
      setDeployments(allDeps);
      setActiveDeployments(activeDeps);
    } catch (error) {
      console.error('Failed to refresh deployments:', error);
    }
  };
  
  // Function to create a new deployment
  const createDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create deployment options
      const options: DeploymentOptions = {
        target: deploymentTarget,
        version,
        buildNumber,
        releaseNotes
      };
      
      // Add DNA watermark to options
      const secureOptions = addDNAWatermark(options, COMPONENT_ID);
      
      // Create deployment
      await deploymentService.createDeployment(secureOptions);
      
      // Reset form
      setReleaseNotes('');
      
      // Refresh deployments
      refreshDeployments();
    } catch (error) {
      console.error('Failed to create deployment:', error);
    }
  };
  
  // Function to calculate progress bar width
  const getProgressWidth = (progress: number) => {
    return `${progress}%`;
  };
  
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Pending
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Deployment Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Deploy your application to Apple App Store, Developer Portal, AWS Cloud, or GitHub
        </p>
      </header>
      
      {/* Connection Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">Connection Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border ${connectionStatus.aiConnected ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">AI Services</span>
              <span className={`h-3 w-3 rounded-full ${connectionStatus.aiConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {connectionStatus.aiConnected ? 'Connected to AI APIs' : 'Not connected to AI APIs'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border ${connectionStatus.quantumConnected ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Quantum Services</span>
              <span className={`h-3 w-3 rounded-full ${connectionStatus.quantumConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {connectionStatus.quantumConnected ? 'Connected to Quantum APIs' : 'Not connected to Quantum APIs'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border ${connectionStatus.cloudConnected ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Cloud Services</span>
              <span className={`h-3 w-3 rounded-full ${connectionStatus.cloudConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {connectionStatus.cloudConnected ? 'Connected to iCloud' : 'Not connected to iCloud'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border ${connectionStatus.allConnected ? 'border-green-500 bg-green-900/20' : 'border-yellow-500 bg-yellow-900/20'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status</span>
              <span className={`h-3 w-3 rounded-full ${connectionStatus.allConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {connectionStatus.allConnected ? 'All systems connected' : 'Some systems not connected'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Active Deployments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">Active Deployments</h2>
        {activeDeployments.length === 0 ? (
          <div className="p-6 rounded-lg border border-gray-700 bg-gray-800/50">
            <p className="text-gray-400">No active deployments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDeployments.map((deployment) => (
              <div key={deployment.id} className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{deployment.target} Deployment</h3>
                  {getStatusBadge(deployment.status)}
                </div>
                <div className="mb-2">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getStatusColor(deployment.status)}`} 
                      style={{ width: getProgressWidth(deployment.progress) }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{deployment.message}</span>
                    <span>{deployment.progress}%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Deployment ID: {deployment.id} • Last Updated: {new Date(deployment.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* New Deployment Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">Create New Deployment</h2>
        <form onSubmit={createDeployment} className="p-6 rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Deployment Target</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={deploymentTarget}
              onChange={(e) => setDeploymentTarget(e.target.value as DeploymentTarget)}
            >
              <option value={DeploymentTarget.IOS_APP_STORE}>Apple App Store</option>
              <option value={DeploymentTarget.DEVELOPER_PORTAL}>Apple Developer Portal</option>
              <option value={DeploymentTarget.AWS_CLOUD}>AWS Cloud</option>
              <option value={DeploymentTarget.GITHUB}>GitHub</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Version</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 1.0.0"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Build Number</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                value={buildNumber}
                onChange={(e) => setBuildNumber(e.target.value)}
                placeholder="e.g. 1"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Release Notes (Optional)</label>
            <textarea
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-24"
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              placeholder="Enter release notes..."
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300"
            disabled={!initialized || loading}
          >
            {loading ? 'Initializing...' : 'Start Deployment'}
          </button>
        </form>
      </div>
      
      {/* Recent Deployments */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">Recent Deployments</h2>
        {deployments.length === 0 ? (
          <div className="p-6 rounded-lg border border-gray-700 bg-gray-800/50">
            <p className="text-gray-400">No deployments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {deployments.map((deployment) => (
                  <tr key={deployment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{deployment.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{deployment.target}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(deployment.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getStatusColor(deployment.status)}`} 
                          style={{ width: getProgressWidth(deployment.progress) }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(deployment.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{deployment.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* DNA Security Watermark */}
      <div className="mt-12 text-xs text-gray-600 text-center">
        <p>
          DNA Watermark: {addDNAWatermark({}, COMPONENT_ID)._dnaWatermark}<br />
          Copyright © Ervin Remus Radosavlevici (01/09/1987), David Cornelius Marshall, and Serena Elizabeth Thorne<br />
          All components built together as one unified system from the beginning.
        </p>
      </div>
    </div>
  );
};

export default DeploymentDashboard;