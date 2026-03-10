import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        localStorage.removeItem('vaniga-auth'); // Clear on logout
      },
    }),
    {
      name: 'vaniga-auth', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);