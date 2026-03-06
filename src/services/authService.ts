import { User } from '../types';

const USERS_KEY = 'marketvibe_users';
const CURRENT_USER_KEY = 'marketvibe_current_user';

// Initial admin users
const DEFAULT_USERS: (User & { password?: string })[] = [
  {
    id: 'admin-1',
    email: 'admin@marketvibe.tn',
    name: 'Admin MarketVibe',
    role: 'admin',
    password: 'admin'
  },
  {
    id: 'admin-amine',
    email: 'aminehasni20@gmail.com',
    name: 'Amine Hasni',
    role: 'admin',
    password: 'admin'
  }
];

export const authService = {
  getUsers: (): (User & { password?: string })[] => {
    const users = localStorage.getItem(USERS_KEY);
    if (!users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsedUsers = JSON.parse(users);
    // Ensure aminehasni20@gmail.com is admin if already in list but not admin
    const updatedUsers = parsedUsers.map((u: any) => 
      u.email === 'aminehasni20@gmail.com' ? { ...u, role: 'admin' } : u
    );
    // If not in list, add it
    if (!updatedUsers.find((u: any) => u.email === 'aminehasni20@gmail.com')) {
      updatedUsers.push(DEFAULT_USERS[1]);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    return updatedUsers;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = authService.getUsers();
    if (users.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser: User & { password?: string } = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: email === 'aminehasni20@gmail.com' ? 'admin' : 'user',
      password
    };
    
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
