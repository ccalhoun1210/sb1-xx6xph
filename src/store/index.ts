import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORE_VERSION = 1;

interface AppState {
  version: number;
  initialized: boolean;
  theme: 'light' | 'dark';
  initialize: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      version: STORE_VERSION,
      initialized: false,
      theme: 'light',
      initialize: () => set({ initialized: true }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        initialized: state.initialized,
        theme: state.theme,
      }),
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          return {
            ...persistedState,
            version: STORE_VERSION,
            initialized: false,
            theme: persistedState.theme || 'light',
          };
        }
        return persistedState as AppState;
      },
    }
  )
);