import { User } from '../types/auth';

class LocalDB {
  private users: { [key: string]: User } = {};

  constructor() {
    // Load initial data from localStorage
    const savedUsers = localStorage.getItem('users_db');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  private save() {
    localStorage.setItem('users_db', JSON.stringify(this.users));
  }

  async createUser(user: User): Promise<User> {
    const normalizedEmail = user.email.toLowerCase();
    if (this.users[normalizedEmail]) {
      throw new Error('User already exists');
    }

    this.users[normalizedEmail] = {
      ...user,
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    this.save();
    return this.users[normalizedEmail];
  }

  async getUser(email: string): Promise<User | null> {
    return this.users[email.toLowerCase()] || null;
  }

  async updateUser(email: string, data: Partial<User>): Promise<User> {
    const normalizedEmail = email.toLowerCase();
    if (!this.users[normalizedEmail]) {
      throw new Error('User not found');
    }

    this.users[normalizedEmail] = {
      ...this.users[normalizedEmail],
      ...data,
      lastLogin: new Date().toISOString()
    };

    this.save();
    return this.users[normalizedEmail];
  }

  async getAllUsers(): Promise<User[]> {
    return Object.values(this.users);
  }

  async getUserStats() {
    const users = Object.values(this.users);
    return {
      totalUsers: users.length,
      trialUsers: users.filter(u => u.plan === 'trial').length,
      lifetimeUsers: users.filter(u => u.plan === 'lifetime').length,
      revenueTotal: users.filter(u => u.plan === 'lifetime').length * 7
    };
  }
}

export const db = new LocalDB();