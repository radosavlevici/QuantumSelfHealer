import { storage } from '../storage';

// Root email addresses array (not exposed publicly)
const ROOT_EMAILS = [
  'ervin210@icloud.com',
  'radosavlevici.ervin@gmail.com'
];

/**
 * Check if an email is a root user email
 * @param email Email to check
 * @returns Boolean indicating if the email belongs to a root user
 */
export function isRootEmail(email: string): boolean {
  return ROOT_EMAILS.includes(email.toLowerCase());
}

/**
 * Check if a user ID has root privileges
 * @param userId User ID to check
 * @returns Promise<boolean> indicating if the user is a root user
 */
export async function hasRootPrivileges(userId: number): Promise<boolean> {
  try {
    const user = await storage.getUser(userId);
    if (!user) return false;
    
    return isRootEmail(user.email);
  } catch (error) {
    console.error('Error checking root privileges:', error);
    return false;
  }
}

/**
 * Authenticate a user based on email
 * @param email Email to authenticate
 * @returns Object with authentication result and user info (if found)
 */
export async function authenticateByEmail(email: string): Promise<{
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  isRoot?: boolean;
}> {
  try {
    // Find user by email (in a real app, this would be more sophisticated)
    const allUsers = await storage.getAllUsers();
    const user = allUsers.find((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return {
        authenticated: false
      };
    }
    
    const isRoot = isRootEmail(email);
    
    // Return authenticated user info without exposing password
    const { password, ...userWithoutPassword } = user;
    
    return {
      authenticated: true,
      user: userWithoutPassword,
      isRoot
    };
  } catch (error) {
    console.error('Error authenticating user by email:', error);
    return {
      authenticated: false
    };
  }
}