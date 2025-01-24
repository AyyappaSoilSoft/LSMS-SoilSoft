import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'worker' | 'supervisor' | 'manager' | 'accountant';
  factory?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock user data
const mockUsers: Record<string, User> = {
  'worker@example.com': {
    id: '1',
    name: 'John Worker',
    email: 'worker@example.com',
    role: 'worker',
    factory: 'Factory A'
  },
  'supervisor@example.com': {
    id: '2',
    name: 'Sarah Supervisor',
    email: 'supervisor@example.com',
    role: 'supervisor',
    factory: 'Factory A'
  },
  'manager@example.com': {
    id: '3',
    name: 'Mike Manager',
    email: 'manager@example.com',
    role: 'manager',
    factory: 'Factory A'
  },
  'accountant@example.com': {
    id: '4',
    name: 'Alice Accountant',
    email: 'accountant@example.com',
    role: 'accountant'
  },
  'admin@example.com': {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = mockUsers[email.toLowerCase()];
        if (user && password === 'password') {
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);