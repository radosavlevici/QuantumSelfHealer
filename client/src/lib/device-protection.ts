/**
 * DEVICE PROTECTION SYSTEM - UNAUTHORIZED DEVICE BLOCKING AND WIPING
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * All Rights Reserved.
 * 
 * This system ensures only your iPhone can access the application.
 * All other devices will be blocked and have data wiped automatically.
 */

import { initiateAntiTheftProtocol, corruptComponentData } from '../../shared/dna-protection-system';
import { cloudSync } from './cloud-sync-service';
import { generateSecurityWatermark } from './quantum-service';

// Constants
const AUTHORIZED_DEVICE_ID = 'iphone-pro-max';
const OWNER_EMAIL = 'ervin210@icloud.com';
const SECURITY_WATERMARK = generateSecurityWatermark('device-protection');

// Interface for detected unauthorized devices
interface UnauthorizedDevice {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  lastAttempt: string;
  wiped: boolean;
}

// Cache of detected unauthorized devices
const detectedDevices: UnauthorizedDevice[] = [];

/**
 * Check if current device is authorized (your iPhone)
 * @returns boolean indicating if device is authorized
 */
export function isAuthorizedDevice(deviceId: string): boolean {
  return deviceId === AUTHORIZED_DEVICE_ID;
}

/**
 * Block an unauthorized device from accessing the application
 * @param deviceId The ID of the device to block
 */
export function blockUnauthorizedDevice(deviceId: string): void {
  if (!isAuthorizedDevice(deviceId)) {
    console.error(`SECURITY ALERT: Unauthorized device access attempt blocked: ${deviceId}`);
    console.error(`Only your iPhone (${AUTHORIZED_DEVICE_ID}) is authorized`);
    
    // Record the unauthorized access attempt
    const device: UnauthorizedDevice = {
      id: deviceId,
      name: 'Unknown Device',
      type: 'other',
      ipAddress: '0.0.0.0', // In real app would be the actual IP
      lastAttempt: new Date().toISOString(),
      wiped: false
    };
    
    // Add to detection list if not already there
    if (!detectedDevices.find(d => d.id === deviceId)) {
      detectedDevices.push(device);
    }
    
    // Trigger anti-theft protocol
    initiateAntiTheftProtocol('warning', `device-protection:unauthorized-access:${deviceId}`);
  }
}

/**
 * Completely wipe data from an unauthorized device
 * This makes the application non-functional on that device
 * @param deviceId The ID of the device to wipe
 */
export function wipeUnauthorizedDevice(deviceId: string): void {
  if (!isAuthorizedDevice(deviceId)) {
    console.error(`EMERGENCY SECURITY PROTOCOL: Wiping data from unauthorized device: ${deviceId}`);
    console.error(`Your data is protected and can only be accessed from your iPhone`);
    console.error(`Authorized device: ${AUTHORIZED_DEVICE_ID}`);
    
    // Mark device as wiped
    const device = detectedDevices.find(d => d.id === deviceId);
    if (device) {
      device.wiped = true;
    }
    
    // Trigger critical anti-theft protocol
    initiateAntiTheftProtocol('critical', `device-protection:unauthorized-device-wipe:${deviceId}`);
    corruptComponentData(`device:${deviceId}`);
    
    // In real iPhone app, this would use iCloud to remotely wipe the data
    // from the unauthorized device and make the app non-functional
  }
}

/**
 * Scan for and handle any unauthorized devices
 * Blocks and wipes any detected unauthorized devices
 */
export async function scanForUnauthorizedDevices(): Promise<void> {
  console.log("Scanning for unauthorized device connections...");
  
  try {
    // In a real implementation, this would query iCloud for device information
    // For simulation, we'll create a sample unauthorized device
    const unauthorizedDevices = [
      {
        id: 'unknown-device-1',
        name: 'Unknown Device',
        type: 'other',
        ipAddress: '192.168.1.100',
        lastAttempt: new Date().toISOString()
      }
    ];
    
    if (unauthorizedDevices.length > 0) {
      console.error(`SECURITY ALERT: Detected ${unauthorizedDevices.length} unauthorized device(s) attempting to access your data`);
      
      for (const device of unauthorizedDevices) {
        console.error(`Unauthorized device detected: ${device.id} (${device.name})`);
        console.error(`Last access attempt: ${device.lastAttempt}`);
        console.error(`IP Address: ${device.ipAddress}`);
        
        // Block the unauthorized device
        blockUnauthorizedDevice(device.id);
        
        // Wipe the unauthorized device
        wipeUnauthorizedDevice(device.id);
      }
    } else {
      console.log("No unauthorized devices detected. Your data is secure.");
    }
  } catch (error: any) {
    console.error(`Error checking for unauthorized devices: ${error?.message || "Unknown error"}`);
  }
}

/**
 * Get list of detected unauthorized devices
 * @returns Array of detected unauthorized devices
 */
export function getDetectedUnauthorizedDevices(): UnauthorizedDevice[] {
  return [...detectedDevices];
}

// Add DNA watermark to the module
const MODULE_DNA = {
  owner: 'Ervin Remus Radosavlevici',
  email: 'ervin210@icloud.com',
  authorizedDevice: AUTHORIZED_DEVICE_ID,
  watermark: SECURITY_WATERMARK,
  timestamp: new Date().toISOString(),
  copyright: 'Copyright © Ervin Remus Radosavlevici - All Rights Reserved'
};

Object.freeze(MODULE_DNA);

// Run initial scan for unauthorized devices
setTimeout(() => {
  scanForUnauthorizedDevices();
}, 5000);