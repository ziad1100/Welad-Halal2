import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: any | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('wh_token', token);
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('wh_token');
        set({ token: null, user: null });
      },
    }),
    { name: 'wh-auth' },
  ),
);
