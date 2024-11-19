import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as auth from '@/lib/auth/firebase-auth';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, companyName: string, subdomain: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await auth.signIn(email, password);
          set({ user, isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
          set({ error: errorMessage, isLoading: false, user: null });
          throw error;
        }
      },

      signUp: async (email, password, companyName, subdomain) => {
        set({ isLoading: true, error: null });
        try {
          const user = await auth.signUp(email, password, companyName, subdomain);
          set({ user, isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
          set({ error: errorMessage, isLoading: false, user: null });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await auth.signOutUser();
          set({ user: null, isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await auth.resetUserPassword(email);
          set({ isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updatePassword: async (password) => {
        set({ isLoading: true, error: null });
        try {
          await auth.updateUserPassword(password);
          set({ isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      refreshSession: async () => {
        try {
          const user = await auth.getCurrentUser();
          set({ user, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to refresh session';
          set({ error: errorMessage, user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);