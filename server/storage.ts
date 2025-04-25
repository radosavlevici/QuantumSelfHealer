import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Initialize with root users
    this.initializeRootUsers();
  }
  
  private initializeRootUsers() {
    // Add the specified root users
    const rootUsers: InsertUser[] = [
      {
        username: "ervin210",
        password: "quantum-secure-password", // Should be properly hashed in a real app
        email: "ervin210@icloud.com"
      },
      {
        username: "ervin.radosavlevici",
        password: "quantum-secure-password", // Should be properly hashed in a real app
        email: "radosavlevici.ervin@gmail.com"
      }
    ];
    
    // Add each root user to the storage
    rootUsers.forEach(user => {
      const id = this.currentId++;
      const createdUser: User = { 
        ...user, 
        id,
        createdAt: new Date(),
        lastLogin: null
      };
      this.users.set(id, createdUser);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

export const storage = new MemStorage();
