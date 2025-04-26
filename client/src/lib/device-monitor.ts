/**
 * DEVICE MONITORING SYSTEM - DETECTS AND BLOCKS UNAUTHORIZED DEVICES
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * All Rights Reserved.
 * 
 * This system continuously monitors for unauthorized device connections
 * and automatically blocks and wipes them.
 */

import { cloudSync } from './cloud-sync-service';
import { 
  blockUnauthorizedDevice, 
  wipeUnauthorizedDevice, 
  scanForUnauthorizedDevices 
} from './device-protection';
import { 
  handleUnauthorizedConnection,
  wipeAllUnauthorizedDevices
} from '../../shared/unauthorized-device-wiper';

// Constants
const AUTHORIZED_DEVICE_ID = 'iphone-pro-max';
const MONITORING_INTERVAL = 30000; // 30 seconds

/**
 * Connection attempt record
 */
interface ConnectionAttempt {
  deviceId: string;
  timestamp: string;
  ipAddress: string;
  blocked: boolean;
  wiped: boolean;
}

// Store connection attempts
const connectionAttempts: ConnectionAttempt[] = [];

/**
 * Start continuous monitoring for unauthorized device connections
 */
export function startDeviceMonitoring(): void {
  console.log("Starting device monitoring system");
  console.log(`Authorized device: ${AUTHORIZED_DEVICE_ID} (Your iPhone)`);
  console.log("Any other device connections will be blocked and wiped");
  
  // Immediately scan for unauthorized devices
  scanForUnauthorizedDevices();
  
  // Set up interval to continuously check for unauthorized devices
  const intervalId = setInterval(() => {
    scanForUnauthorizedDevices();
  }, MONITORING_INTERVAL);
  
  // Ensure the interval is cleared if the component is unmounted
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Handle a connection attempt from a device
 * If it's not your iPhone, block and wipe it
 */
export function handleConnectionAttempt(deviceId: string, ipAddress: string): void {
  console.log(`Connection attempt from device: ${deviceId}`);
  
  // Record the connection attempt
  const attempt: ConnectionAttempt = {
    deviceId,
    timestamp: new Date().toISOString(),
    ipAddress,
    blocked: false,
    wiped: false
  };
  
  // Check if this is your iPhone
  if (deviceId !== AUTHORIZED_DEVICE_ID) {
    console.error(`UNAUTHORIZED CONNECTION ATTEMPT: ${deviceId}`);
    console.error("Only your iPhone is authorized to connect");
    
    // Block the device
    blockUnauthorizedDevice(deviceId);
    attempt.blocked = true;
    
    // Wipe the device
    wipeUnauthorizedDevice(deviceId);
    attempt.wiped = true;
    
    // Handle with shared system
    handleUnauthorizedConnection(deviceId, ipAddress);
  } else {
    console.log("Authorized connection from your iPhone accepted");
  }
  
  // Store the connection attempt
  connectionAttempts.push(attempt);
}

/**
 * Get connection attempt history
 */
export function getConnectionAttempts(): ConnectionAttempt[] {
  return [...connectionAttempts];
}

/**
 * Emergency wipe of all unauthorized devices
 */
export function emergencyWipeAllUnauthorizedDevices(): void {
  console.error("EMERGENCY WIPE INITIATED: Wiping all unauthorized devices");
  
  // Get all unique device IDs from connection attempts
  const deviceIds = [...new Set(
    connectionAttempts
      .filter(attempt => attempt.deviceId !== AUTHORIZED_DEVICE_ID)
      .map(attempt => attempt.deviceId)
  )];
  
  if (deviceIds.length > 0) {
    console.error(`Wiping ${deviceIds.length} unauthorized devices`);
    wipeAllUnauthorizedDevices(deviceIds);
    
    // Update connection attempts to reflect wiping
    connectionAttempts.forEach(attempt => {
      if (deviceIds.includes(attempt.deviceId)) {
        attempt.wiped = true;
      }
    });
    
    console.error("All unauthorized devices have been wiped");
    console.error("Your data is now secure and can only be accessed from your iPhone");
  } else {
    console.log("No unauthorized devices found to wipe");
  }
}

// Add DNA watermark to the module
const MODULE_DNA = {
  owner: 'Ervin Remus Radosavlevici',
  email: 'ervin210@icloud.com',
  authorizedDevice: AUTHORIZED_DEVICE_ID,
  timestamp: new Date().toISOString(),
  copyright: 'Copyright © Ervin Remus Radosavlevici - All Rights Reserved'
};

Object.freeze(MODULE_DNA);

// Initialize monitoring on module load
startDeviceMonitoring();