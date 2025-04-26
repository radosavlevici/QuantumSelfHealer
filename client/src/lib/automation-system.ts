/**
 * !!! DNA PROTECTED SERVICE - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - AUTOMATION SYSTEM
 * Front-end automation system for scheduled tasks and self-repair.
 * 
 * FEATURES:
 * - Task scheduling and execution
 * - System self-repair and maintenance
 * - Automated security checks
 * - Quantum-enhanced verification
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import { 
  IMMUTABLE_COPYRIGHT_OWNER,
  IMMUTABLE_COPYRIGHT_EMAIL,
  IMMUTABLE_SYSTEM_VERSION,
  generateDNASignature,
  validateDNASignature
} from './dna-security-core';
import { registerProtectedComponent } from './dna-protection-system';
import { performSystemSelfRepair, ComponentVerification } from '../../../shared/self-repair-system';
import { 
  loadUserSettings, 
  saveUserSettings, 
  addSecurityLog, 
  performSelfRepair as cloudSyncSelfRepair
} from './cloud-sync-service';
import { checkQuantumServicesHealth } from './quantum-interface';

// Register this component with the DNA protection system
const componentId = 'automation-system';
const serviceProtection = registerProtectedComponent(
  componentId, 
  'client-service'
);

/**
 * Interface for a scheduled task
 */
export interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  interval: number; // Interval in minutes
  lastRun: string | null;
  nextRun: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  enabled: boolean;
  execute: () => Promise<any>;
  dnaSignature: string;
  watermark: string;
}

// Store for registered tasks
const registeredTasks: Map<string, ScheduledTask> = new Map();
// Store for task intervals
const taskIntervals: Map<string, number> = new Map();

/**
 * Register a new scheduled task
 * @param name Task name
 * @param description Task description
 * @param interval Interval in minutes
 * @param execute Task execution function
 * @returns Registered task
 */
export function registerTask(
  name: string,
  description: string,
  interval: number,
  execute: () => Promise<any>
): ScheduledTask {
  try {
    // Generate a secure task ID
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const dnaSignature = generateDNASignature(taskId, 'scheduled-task');
    
    // Calculate next run time
    const nextRun = new Date(Date.now() + interval * 60 * 1000).toISOString();
    
    // Create the task
    const task: ScheduledTask = {
      id: taskId,
      name,
      description,
      interval,
      lastRun: null,
      nextRun,
      status: 'idle',
      enabled: true,
      execute,
      dnaSignature,
      watermark: serviceProtection.watermark
    };
    
    // Register the task
    registeredTasks.set(taskId, task);
    
    console.log(`%c TASK REGISTERED: ${name} `, 'background: #003366; color: #66ccff;');
    
    return task;
  } catch (error) {
    console.error('Task registration error:', error);
    
    // Generate an error task
    const errorTaskId = `error-task-${Date.now()}`;
    const errorSignature = generateDNASignature(errorTaskId, 'error');
    
    // Create an error task that does nothing
    const errorTask: ScheduledTask = {
      id: errorTaskId,
      name: `Error: ${name}`,
      description: `Failed to register task: ${error.message}`,
      interval,
      lastRun: null,
      nextRun: new Date(Date.now() + interval * 60 * 1000).toISOString(),
      status: 'failed',
      enabled: false,
      execute: async () => { 
        console.error('Attempted to execute error task'); 
        return { error: 'Task was not properly registered' }; 
      },
      dnaSignature: errorSignature,
      watermark: serviceProtection.watermark
    };
    
    // Register the error task for tracking
    registeredTasks.set(errorTaskId, errorTask);
    
    return errorTask;
  }
}

/**
 * Start a scheduled task
 * @param taskId Task ID
 * @returns Success status
 */
export function startTask(taskId: string): boolean {
  try {
    const task = registeredTasks.get(taskId);
    if (!task) {
      console.error(`Task ${taskId} not found`);
      return false;
    }
    
    // If task is already running, do nothing
    if (task.status === 'running') {
      console.log(`Task ${task.name} is already running`);
      return true;
    }
    
    // If task is not enabled, do nothing
    if (!task.enabled) {
      console.log(`Task ${task.name} is disabled`);
      return false;
    }
    
    // Update task status
    task.status = 'running';
    registeredTasks.set(taskId, task);
    
    // Execute the task
    console.log(`%c EXECUTING TASK: ${task.name} `, 'background: #006633; color: #99ffcc;');
    
    task.execute()
      .then(result => {
        // Update task after execution
        const updatedTask = registeredTasks.get(taskId);
        if (updatedTask) {
          updatedTask.status = 'completed';
          updatedTask.lastRun = new Date().toISOString();
          updatedTask.nextRun = new Date(Date.now() + updatedTask.interval * 60 * 1000).toISOString();
          registeredTasks.set(taskId, updatedTask);
          
          console.log(`%c TASK COMPLETED: ${updatedTask.name} `, 'background: #006633; color: #99ffcc;');
          
          // Log the task completion
          addSecurityLog('task-completed', 'low', { 
            taskId, 
            taskName: updatedTask.name, 
            result 
          });
        }
      })
      .catch(error => {
        // Update task after error
        const updatedTask = registeredTasks.get(taskId);
        if (updatedTask) {
          updatedTask.status = 'failed';
          updatedTask.lastRun = new Date().toISOString();
          updatedTask.nextRun = new Date(Date.now() + updatedTask.interval * 60 * 1000).toISOString();
          registeredTasks.set(taskId, updatedTask);
          
          console.error(`Task ${updatedTask.name} failed:`, error);
          
          // Log the task failure
          addSecurityLog('task-failed', 'medium', { 
            taskId, 
            taskName: updatedTask.name, 
            error: error.message 
          });
        }
      });
    
    return true;
  } catch (error) {
    console.error('Start task error:', error);
    return false;
  }
}

/**
 * Stop a scheduled task
 * @param taskId Task ID
 * @returns Success status
 */
export function stopTask(taskId: string): boolean {
  try {
    const task = registeredTasks.get(taskId);
    if (!task) {
      console.error(`Task ${taskId} not found`);
      return false;
    }
    
    // Clear the task interval if it exists
    if (taskIntervals.has(taskId)) {
      clearInterval(taskIntervals.get(taskId));
      taskIntervals.delete(taskId);
    }
    
    // Update task status
    task.status = 'idle';
    registeredTasks.set(taskId, task);
    
    console.log(`%c TASK STOPPED: ${task.name} `, 'background: #663300; color: #ffcc99;');
    
    return true;
  } catch (error) {
    console.error('Stop task error:', error);
    return false;
  }
}

/**
 * Schedule a task for repeated execution
 * @param taskId Task ID
 * @returns Success status
 */
export function scheduleTask(taskId: string): boolean {
  try {
    const task = registeredTasks.get(taskId);
    if (!task) {
      console.error(`Task ${taskId} not found`);
      return false;
    }
    
    // If task is already scheduled, clear the existing interval
    if (taskIntervals.has(taskId)) {
      clearInterval(taskIntervals.get(taskId));
    }
    
    // Create the interval
    const intervalId = window.setInterval(() => {
      startTask(taskId);
    }, task.interval * 60 * 1000);
    
    // Store the interval ID
    taskIntervals.set(taskId, intervalId);
    
    console.log(`%c TASK SCHEDULED: ${task.name} (every ${task.interval} minutes) `, 
      'background: #333366; color: #9999ff;');
    
    return true;
  } catch (error) {
    console.error('Schedule task error:', error);
    return false;
  }
}

/**
 * Unschedule a task
 * @param taskId Task ID
 * @returns Success status
 */
export function unscheduleTask(taskId: string): boolean {
  try {
    const task = registeredTasks.get(taskId);
    if (!task) {
      console.error(`Task ${taskId} not found`);
      return false;
    }
    
    // Clear the task interval if it exists
    if (taskIntervals.has(taskId)) {
      clearInterval(taskIntervals.get(taskId));
      taskIntervals.delete(taskId);
      
      console.log(`%c TASK UNSCHEDULED: ${task.name} `, 
        'background: #333366; color: #9999ff;');
      
      return true;
    }
    
    console.log(`Task ${task.name} was not scheduled`);
    return false;
  } catch (error) {
    console.error('Unschedule task error:', error);
    return false;
  }
}

/**
 * Get all registered tasks
 * @returns Array of scheduled tasks
 */
export function getAllTasks(): ScheduledTask[] {
  return Array.from(registeredTasks.values());
}

/**
 * Initialize the default system tasks
 */
export function initializeSystemTasks(): void {
  try {
    console.log(
      `%c INITIALIZING SYSTEM AUTOMATION TASKS `,
      'background: #660033; color: #ff99cc; font-weight: bold;'
    );
    
    // Register system health check task
    const systemHealthCheckTask = registerTask(
      'System Health Check',
      'Verifies system integrity and performs self-repair if needed',
      60, // Run every 60 minutes
      async () => {
        // Get registered components for checking
        const components = Array.from(registeredTasks.values()).map(task => ({
          id: task.id,
          name: task.name,
          type: 'scheduled-task',
          dnaSignature: task.dnaSignature,
          watermark: task.watermark
        }));
        
        // Add system components
        components.push({
          id: componentId,
          name: 'Automation System',
          type: 'client-service',
          dnaSignature: generateDNASignature(componentId, 'client-service'),
          watermark: serviceProtection.watermark
        });
        
        // Perform self-repair
        const repairResult = performSystemSelfRepair(components);
        
        // Log the repair result
        await addSecurityLog(
          'system-health-check-completed', 
          repairResult.systemIntegrity < 80 ? 'high' : 'low',
          { 
            systemIntegrity: repairResult.systemIntegrity,
            componentsVerified: repairResult.componentsVerified,
            componentsRepaired: repairResult.componentsRepaired
          }
        );
        
        return repairResult;
      }
    );
    
    // Register cloud sync check task
    const cloudSyncCheckTask = registerTask(
      'Cloud Sync Check',
      'Verifies and repairs cloud synchronization data integrity',
      120, // Run every 120 minutes
      async () => {
        // Perform cloud sync self-repair
        const repairResult = await cloudSyncSelfRepair();
        
        // Log the repair result
        await addSecurityLog('cloud-sync-check-completed', 'low', { 
          issues: repairResult.issues,
          fixed: repairResult.fixed
        });
        
        return repairResult;
      }
    );
    
    // Register quantum services health check task
    const quantumServicesCheckTask = registerTask(
      'Quantum Services Health Check',
      'Verifies connectivity to quantum computing services',
      240, // Run every 240 minutes
      async () => {
        // Check quantum services health
        const healthResult = await checkQuantumServicesHealth();
        
        // Log the health check result
        await addSecurityLog('quantum-services-check-completed', 'low', { 
          ibm: healthResult.ibm,
          azure: healthResult.azure
        });
        
        return healthResult;
      }
    );
    
    // Register user settings sync task
    const userSettingsSyncTask = registerTask(
      'User Settings Sync',
      'Synchronizes user settings to cloud storage',
      180, // Run every 180 minutes
      async () => {
        // Load current settings
        const settings = await loadUserSettings();
        
        // Update last sync timestamp
        const updatedSettings = {
          ...settings,
          lastSync: new Date().toISOString()
        };
        
        // Save updated settings
        const saveResult = await saveUserSettings(updatedSettings);
        
        // Log the sync result
        await addSecurityLog('user-settings-sync-completed', 'low', { 
          success: saveResult,
          timestamp: new Date().toISOString()
        });
        
        return { success: saveResult };
      }
    );
    
    // Schedule all system tasks
    scheduleTask(systemHealthCheckTask.id);
    scheduleTask(cloudSyncCheckTask.id);
    scheduleTask(quantumServicesCheckTask.id);
    scheduleTask(userSettingsSyncTask.id);
    
    // Also run the health check immediately
    startTask(systemHealthCheckTask.id);
    
    console.log(
      `%c SYSTEM AUTOMATION TASKS INITIALIZED AND SCHEDULED `,
      'background: #660033; color: #ff99cc;'
    );
  } catch (error) {
    console.error('Initialize system tasks error:', error);
  }
}

/**
 * Interface for a custom automation task
 */
export interface CustomTaskParams {
  name: string;
  description: string;
  interval: number;
  action: () => Promise<any>;
}

/**
 * Register a custom automation task
 * @param params Custom task parameters
 * @returns Registered task
 */
export function createCustomTask(params: CustomTaskParams): ScheduledTask {
  try {
    // Register the custom task
    const task = registerTask(
      params.name,
      params.description,
      params.interval,
      async () => {
        try {
          // Execute the custom action
          const result = await params.action();
          
          // Log the custom task execution
          await addSecurityLog('custom-task-executed', 'low', { 
            name: params.name,
            success: true,
            result
          });
          
          return result;
        } catch (error) {
          // Log the custom task failure
          await addSecurityLog('custom-task-failed', 'medium', { 
            name: params.name,
            error: error.message
          });
          
          throw error;
        }
      }
    );
    
    // Schedule the custom task
    scheduleTask(task.id);
    
    return task;
  } catch (error) {
    console.error('Create custom task error:', error);
    
    // Generate an error task
    const errorTaskId = `error-custom-task-${Date.now()}`;
    const errorSignature = generateDNASignature(errorTaskId, 'error');
    
    // Create an error task that does nothing
    const errorTask: ScheduledTask = {
      id: errorTaskId,
      name: `Error: ${params.name}`,
      description: `Failed to create custom task: ${error.message}`,
      interval: params.interval,
      lastRun: null,
      nextRun: new Date(Date.now() + params.interval * 60 * 1000).toISOString(),
      status: 'failed',
      enabled: false,
      execute: async () => { 
        console.error('Attempted to execute error task'); 
        return { error: 'Task was not properly created' }; 
      },
      dnaSignature: errorSignature,
      watermark: serviceProtection.watermark
    };
    
    // Register the error task for tracking
    registeredTasks.set(errorTaskId, errorTask);
    
    return errorTask;
  }
}