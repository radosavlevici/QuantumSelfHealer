/**
 * !!! ROOT ACCESS PANEL - DNA PROTECTED COMPONENT !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * ROOT ACCESS CONTROL INTERFACE
 * 
 * This component provides an interface for the copyright owner 
 * to monitor and control activity across all authorized devices.
 * It maintains the same DNA-based security as the rest of the system
 * and only allows access to the true copyright owner.
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Activity, 
  Cloud, 
  Lock, 
  RefreshCw, 
  Settings,
  UploadCloud,
  DownloadCloud,
  Clock
} from 'lucide-react';

import { cloudSync, type DeviceInfo, type ActivityRecord } from '../lib/cloud-sync-service';

// Root Access Panel Component
const RootAccessPanel: React.FC = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [hasRootAccess, setHasRootAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'devices' | 'activity' | 'settings'>('devices');
  const [lastSync, setLastSync] = useState<string | null>(null);
  
  // Load data on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize cloud sync service
        await cloudSync.initialize();
        
        // Check if user has root access
        const rootAccess = cloudSync.hasRootAccess();
        setHasRootAccess(rootAccess);
        
        if (rootAccess) {
          // Load devices and activity data
          const deviceList = cloudSync.getConnectedDevices();
          const activityList = cloudSync.getActivityLog();
          
          setDevices(deviceList);
          setActivities(activityList);
          setLastSync(new Date().toISOString());
        }
      } catch (error: any) {
        console.error("Failed to initialize root access panel:", error?.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);
  
  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Refresh data from cloud
  const refreshData = async () => {
    setIsLoading(true);
    
    try {
      await cloudSync.initialize();
      const deviceList = cloudSync.getConnectedDevices();
      const activityList = cloudSync.getActivityLog();
      
      setDevices(deviceList);
      setActivities(activityList);
      setLastSync(new Date().toISOString());
    } catch (error: any) {
      console.error("Failed to refresh data:", error?.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get icon for device type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'iPhone':
        return <Smartphone className="h-5 w-5 text-blue-500" />;
      case 'Mac':
        return <Laptop className="h-5 w-5 text-gray-500" />;
      case 'iPad':
        return <Tablet className="h-5 w-5 text-purple-500" />;
      default:
        return <Smartphone className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'inactive':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get activity icon
  const getActivityIcon = (action: string) => {
    if (action.includes('sync-to-cloud')) {
      return <UploadCloud className="h-4 w-4 text-blue-400" />;
    } else if (action.includes('retrieve-from-cloud')) {
      return <DownloadCloud className="h-4 w-4 text-green-400" />;
    } else if (action.includes('initialize')) {
      return <RefreshCw className="h-4 w-4 text-purple-400" />;
    } else if (action.includes('update-config')) {
      return <Settings className="h-4 w-4 text-yellow-400" />;
    } else {
      return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // If user doesn't have root access, show access denied
  if (!hasRootAccess && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-black rounded-lg text-red-500">
        <Shield className="h-16 w-16 mb-4" />
        <h2 className="text-xl font-bold mb-2">Root Access Denied</h2>
        <p className="text-center mb-4">
          This panel is only accessible to the copyright owner:
          <br />
          <span className="text-white">Ervin Remus Radosavlevici (ervin210@icloud.com)</span>
        </p>
        <div className="bg-red-900/30 p-4 rounded-lg">
          <p className="text-sm">
            For security reasons, this component maintains strict access control.
            Only the original copyright owner can access root features.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-6 w-6 mr-2 text-yellow-400" />
            <h2 className="text-lg font-bold">Root Access Control</h2>
          </div>
          <div className="flex items-center text-xs text-gray-300">
            <Lock className="h-4 w-4 mr-1 text-green-400" />
            <span>Owner: Ervin Remus Radosavlevici</span>
          </div>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-300">
          <Cloud className="h-4 w-4 mr-1" />
          <span>iCloud Sync Active</span>
          {lastSync && (
            <>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>Last Sync: {formatTime(lastSync)}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'devices' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveTab('devices')}
        >
          Devices
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'activity' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity Log
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'settings' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : activeTab === 'devices' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Connected Devices</h3>
              <button
                className="text-xs flex items-center text-blue-400 hover:text-blue-300"
                onClick={refreshData}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </button>
            </div>
            {devices.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No devices connected
              </div>
            ) : (
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="bg-gray-800 p-3 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getDeviceIcon(device.type)}
                        <div className="ml-3">
                          <div className="font-medium">{device.name}</div>
                          <div className="text-xs text-gray-400">{device.osVersion}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(device.syncStatus)}`} />
                        <div className="text-xs">{device.syncStatus.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Last Sync: {formatTime(device.lastSync)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'activity' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Activity Log</h3>
              <button
                className="text-xs flex items-center text-blue-400 hover:text-blue-300"
                onClick={refreshData}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </button>
            </div>
            {activities.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No activity recorded
              </div>
            ) : (
              <div className="space-y-2">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className={`bg-gray-800 p-2 rounded-lg shadow-sm ${
                      activity.status === 'failure' ? 'border-l-2 border-red-500' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      {getActivityIcon(activity.action)}
                      <div className="ml-2 flex-1">
                        <div className="font-medium text-sm">{activity.action}</div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Device: {activity.deviceId}</span>
                          <span>{formatTime(activity.timestamp)}</span>
                        </div>
                      </div>
                      <div className={`text-xs ml-2 ${
                        activity.status === 'success' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {activity.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Sync Settings</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Backup Frequency</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
                  defaultValue="realtime"
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Encryption Level</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
                  defaultValue="maximum"
                  disabled
                >
                  <option value="standard">Standard</option>
                  <option value="enhanced">Enhanced</option>
                  <option value="maximum">Maximum (Required for root access)</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Maximum encryption is required for root access and cannot be changed.
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="syncEnabled"
                  className="h-4 w-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="syncEnabled" className="ml-2 text-sm">
                  Enable iCloud synchronization
                </label>
              </div>
            </div>
            
            <h3 className="text-sm font-medium mt-4">Owner Information</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm opacity-75"
                  value="Ervin Remus Radosavlevici"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm opacity-75"
                  value="ervin210@icloud.com"
                  disabled
                />
              </div>
              <p className="text-xs text-yellow-400 flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                Owner information is protected and cannot be modified.
              </p>
            </div>
            
            <div className="bg-blue-900/30 p-4 rounded-lg mt-4">
              <h4 className="text-sm font-medium mb-2">Secure iCloud Synchronization</h4>
              <p className="text-xs text-gray-300">
                All data is securely synchronized across your devices using iCloud with
                DNA-protected encryption. Only the copyright owner (Ervin Remus Radosavlevici)
                has access to this data.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-800 p-2 flex justify-between items-center text-xs text-gray-400">
        <div>
          © Ervin Remus Radosavlevici
        </div>
        <div>
          DNA Protected • Root Access
        </div>
      </div>
    </div>
  );
};

export default RootAccessPanel;