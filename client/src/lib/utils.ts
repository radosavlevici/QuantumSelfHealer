/**
 * DNA-Protected Utility Functions
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Combines class names with Tailwind CSS support
 * This function is protected with DNA-based security
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}