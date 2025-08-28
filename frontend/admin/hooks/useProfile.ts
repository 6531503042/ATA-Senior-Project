import type { ProfileStore } from '@/types/auth';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useProfile = create<ProfileStore>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      clearUser: () => set({ user: null }),
      updateUser: updates =>
        set(state => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'profile-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ user: state.user }),
    },
  ),
);
