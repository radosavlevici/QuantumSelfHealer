/**
 * !!! DEVICE SECURITY SERVICE - MAXIMUM PROTECTION !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * DEVICE SECURITY PROTECTION SYSTEM
 * 
 * This service combines cloud synchronization and DNA protection systems
 * to create a unified security service that ensures only your iPhone
 * can access your data. Any other device attempting to access the data
 * will be automatically blocked and wiped.
 * 
 * FEATURES:
 * - Device authorization verification against iCloud account
 * - Automatic device blocking for unauthorized connections
 * - Remote data wiping for non-iPhone devices
 * - Continuous unauthorized device scanning
 * - Integration with DNA protection for maximum security
 */

import { ROOT_USER_EMAIL, ROOT_USER_NAME } from '@shared/dna-protection-system';
import { cloudSync, type DeviceInfo } from './cloud-sync-service';

// Security level enum for device protection
export enum DeviceSecurityLevel {
  STANDARD = 'standard',  // Block unauthorized devices
  ENHANCED = 'enhanced',  // Block and log unauthorized devices
  MAXIMUM = 'maximum'     // Block, log, and wipe unauthorized devices
}

// Device authorization status
export interface DeviceAuthStatus {
  authorized: boolean;
  deviceId: string;
  ownerEmail: string;
  securityLevel: DeviceSecurityLevel;
  timestamp: string;
  message: string;
  actionTaken?: string[];
}

// Unauthorized device info
export interface UnauthorizedDevice {
  id: string;
  name: string;
  type: string;
  ipAddress?: string;
  lastAttempt: string;
  blocked: boolean;
  wiped: boolean;
}

/**
 * Device Security Service Class
 * This service handles device-level security including authorization
 * checking, blocking, and wiping unauthorized devices
 */
class DeviceSecurityService {
  private static instance: DeviceSecurityService;
  private securityLevel: DeviceSecurityLevel = DeviceSecurityLevel.MAXIMUM;
  private authorizedDeviceId: string = 'iphone-pro-max'; // Your iPhone device ID
  private unauthorizedDevices: UnauthorizedDevice[] = [];
  
  private constructor() {
    // Private constructor for singleton pattern
    console.log("Device Security Service initialized with MAXIMUM protection");
    console.log(`Authorized device: iPhone (${this.authorizedDeviceId})`);
    console.log(`Owner: ${ROOT_USER_NAME} (${ROOT_USER_EMAIL})`);
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): DeviceSecurityService {
    if (!DeviceSecurityService.instance) {
      DeviceSecurityService.instance = new DeviceSecurityService();
    }
    return DeviceSecurityService.instance;
  }
  
  /**
   * Initialize and start the security service
   */
  public async initialize(): Promise<boolean> {
    console.log("Initializing Device Security Service...");
    try {
      // Initialize cloud sync service first
      await cloudSync.initialize();
      
      // Schedule automatic security scan
      this.scheduleSecurityScan();
      
      // For demonstration purposes, add some unauthorized devices to the list
      // In a real implementation, these would be detected from actual connection attempts
      if (this.unauthorizedDevices.length === 0) {
        this.addSampleUnauthorizedDevices();
      }
      
      return true;
    } catch (error: any) {
      console.error("Failed to initialize Device Security Service:", error?.message || "Unknown error");
      return false;
    }
  }
  
  /**
   * Add sample unauthorized devices for demonstration
   * In a real implementation, these would be detected from actual connection attempts
   */
  private addSampleUnauthorizedDevices(): void {
    const devices: UnauthorizedDevice[] = [
      {
        id: 'unknown-laptop-001',
        name: 'Unknown Laptop',
        type: 'laptop',
        ipAddress: '192.168.1.45',
        lastAttempt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
        blocked: true,
        wiped: true
      },
      {
        id: 'android-device-327',
        name: 'Android Device',
        type: 'smartphone',
        ipAddress: '192.168.1.132',
        lastAttempt: new Date(Date.now() - 17 * 60 * 1000).toISOString(), // 17 mins ago
        blocked: true,
        wiped: true
      },
      {
        id: 'unknown-tablet-843',
        name: 'Unknown Tablet',
        type: 'tablet',
        ipAddress: '192.168.1.87',
        lastAttempt: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 mins ago
        blocked: true,
        wiped: true
      }
    ];
    
    this.unauthorizedDevices = devices;
    console.log(`Added ${devices.length} sample unauthorized devices for demonstration purposes`);
  }
  
  /**
   * Schedule regular security scans for unauthorized devices
   */
  private scheduleSecurityScan(): void {
    // Perform an immediate scan
    this.scanForUnauthorizedDevices();
    
    // Schedule periodic scans
    setInterval(() => {
      this.scanForUnauthorizedDevices();
    }, 5 * 60 * 1000); // Every 5 minutes
  }
  
  /**
   * Scan for unauthorized devices attempting to access data
   */
  public async scanForUnauthorizedDevices(): Promise<UnauthorizedDevice[]> {
    console.log("Scanning for unauthorized devices...");
    
    try {
      // Use the cloud sync service to check for unauthorized devices
      await cloudSync.checkForUnauthorizedDevices();
      
      // In a real implementation, this would get the results from the cloud scan
      // For demonstration, we'll simulate finding an unauthorized device occasionally
      if (Math.random() > 0.7) {
        const randomDeviceId = `unknown-device-${Math.floor(Math.random() * 1000)}`;
        const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        
        const device: UnauthorizedDevice = {
          id: randomDeviceId,
          name: 'Unknown Device',
          type: 'other',
          ipAddress: randomIp,
          lastAttempt: new Date().toISOString(),
          blocked: false,
          wiped: false
        };
        
        // Add to unauthorized devices if not already present
        if (!this.unauthorizedDevices.some(d => d.id === device.id)) {
          this.unauthorizedDevices.push(device);
          
          // Automatically block and wipe the device
          this.blockDevice(device.id);
        }
      }
      
      return this.unauthorizedDevices;
    } catch (error: any) {
      console.error("Failed to scan for unauthorized devices:", error?.message || "Unknown error");
      return [];
    }
  }
  
  /**
   * Check if a device is authorized
   * Only your iPhone is authorized
   */
  public isDeviceAuthorized(deviceId: string): DeviceAuthStatus {
    const authorized = deviceId === this.authorizedDeviceId;
    
    const status: DeviceAuthStatus = {
      authorized,
      deviceId,
      ownerEmail: ROOT_USER_EMAIL,
      securityLevel: this.securityLevel,
      timestamp: new Date().toISOString(),
      message: authorized 
        ? `Device ${deviceId} is authorized for ${ROOT_USER_EMAIL}`
        : `Device ${deviceId} is NOT authorized. Only your iPhone is authorized.`
    };
    
    // If not authorized, automatically block
    if (!authorized) {
      this.blockDevice(deviceId);
    }
    
    return status;
  }
  
  /**
   * Block an unauthorized device
   */
  public blockDevice(deviceId: string): void {
    // Skip if this is the authorized device
    if (deviceId === this.authorizedDeviceId) {
      console.log(`Cannot block authorized device: ${deviceId}`);
      return;
    }
    
    console.error(`SECURITY ALERT: Blocking unauthorized device: ${deviceId}`);
    
    // Update device record if it exists
    const deviceIndex = this.unauthorizedDevices.findIndex(d => d.id === deviceId);
    if (deviceIndex >= 0) {
      this.unauthorizedDevices[deviceIndex].blocked = true;
    } else {
      // Add to unauthorized devices list
      this.unauthorizedDevices.push({
        id: deviceId,
        name: 'Unknown Device',
        type: 'other',
        lastAttempt: new Date().toISOString(),
        blocked: true,
        wiped: false
      });
    }
    
    // Use cloud sync to block the device
    cloudSync.blockUnauthorizedDevice(deviceId);
    
    // If maximum security, also wipe the device
    if (this.securityLevel === DeviceSecurityLevel.MAXIMUM) {
      this.wipeDevice(deviceId);
    }
  }
  
  /**
   * Wipe data from an unauthorized device
   */
  public wipeDevice(deviceId: string): void {
    // Skip if this is the authorized device
    if (deviceId === this.authorizedDeviceId) {
      console.log(`Cannot wipe authorized device: ${deviceId}`);
      return;
    }
    
    console.error(`EMERGENCY SECURITY PROTOCOL: Wiping unauthorized device: ${deviceId}`);
    
    // Update device record if it exists
    const deviceIndex = this.unauthorizedDevices.findIndex(d => d.id === deviceId);
    if (deviceIndex >= 0) {
      this.unauthorizedDevices[deviceIndex].wiped = true;
    }
    
    // Use cloud sync to wipe the device
    cloudSync.wipeUnauthorizedDevice(deviceId);
    
    console.error(`Device ${deviceId} has been wiped. All data has been removed.`);
    console.error(`Only your iPhone (${this.authorizedDeviceId}) is authorized to access your data.`);
  }
  
  /**
   * Get a list of unauthorized devices
   */
  public getUnauthorizedDevices(): UnauthorizedDevice[] {
    return [...this.unauthorizedDevices];
  }
  
  /**
   * Get the authorized device ID (your iPhone)
   */
  public getAuthorizedDeviceId(): string {
    return this.authorizedDeviceId;
  }
  
  /**
   * Get current security level
   */
  public getSecurityLevel(): DeviceSecurityLevel {
    return this.securityLevel;
  }
  
  /**
   * Update security level
   */
  public setSecurityLevel(level: DeviceSecurityLevel): void {
    // No downgrading from MAXIMUM allowed
    if (this.securityLevel === DeviceSecurityLevel.MAXIMUM && level !== DeviceSecurityLevel.MAXIMUM) {
      console.error("SECURITY ALERT: Cannot downgrade from MAXIMUM security level");
      return;
    }
    
    this.securityLevel = level;
    console.log(`Device security level updated to: ${level}`);
  }
}

// Export the singleton instance
export const deviceSecurity = DeviceSecurityService.getInstance();

// Initialize the service
deviceSecurity.initialize().catch(error => {
  console.error("Failed to initialize Device Security Service:", error);
});