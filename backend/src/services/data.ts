import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
}

interface User {
  id: number;
  username: string;
  password: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  userId: number;
}

export class DataService {
  private static instance: DataService;
  private users: User[] = [];
  private tasks: Task[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private loadData() {
    try {
      // Ensure data directory exists
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      // Initialize files with empty arrays if they don't exist
      if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
      }
      if (!fs.existsSync(TASKS_FILE)) {
        fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
      }

      // Load data from files
      this.users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      this.tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    } catch (error) {
      console.error('Error loading data:', error);
      this.users = [];
      this.tasks = [];
      // Create empty files if they don't exist
      this.saveData()
  }
}
  private saveData() {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2));
      fs.writeFileSync(TASKS_FILE, JSON.stringify(this.tasks, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // User methods
  async createUser(username: string, password: string): Promise<Omit<User, 'password'>> {
    const existingUser = this.users.find(u => u.username === username);
    if (existingUser) {
      throw new Error('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: this.users.length + 1,
      username,
      password: hashedPassword
    };

    this.users.push(newUser);
    this.saveData();

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = this.users.find(u => u.username === username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Task methods
  createTask(task: Omit<Task, 'id'>): Task {
    const newTask = {
      ...task,
      id: this.tasks.length + 1
    };

    this.tasks.push(newTask);
    this.saveData();
    return newTask;
  }

  getTasks(userId: number): Task[] {
    return this.tasks.filter(task => task.userId === userId);
  }

  updateTask(taskId: number, userId: number, updates: Partial<Omit<Task, 'id' | 'userId'>>): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId && t.userId === userId);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates
    };

    this.saveData();
    return this.tasks[taskIndex];
  }

  deleteTask(taskId: number, userId: number): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId && t.userId === userId);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    this.saveData();
    return true;
  }
}