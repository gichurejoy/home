import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  
  topbarColor: 'light' | 'dark';
  setTopbarColor: (color: 'light' | 'dark') => void;
  
  menuColor: 'light' | 'dark';
  setMenuColor: (color: 'light' | 'dark') => void;
  
  sidebarSize: 'default' | 'condensed' | 'hidden' | 'sm-hover' | 'sm-hover-active';
  setSidebarSize: (size: 'default' | 'condensed' | 'hidden' | 'sm-hover' | 'sm-hover-active') => void;
  
  agencyName: string;
  setAgencyName: (name: string) => void;
  brandColor: string;
  setBrandColor: (color: string) => void;
  
  resetSettings: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1280;
    if (isMobile) {
      return { sidebarOpen: !state.sidebarOpen };
    } else {
      const newSize = state.sidebarSize === 'default' ? 'condensed' : 'default';
      return { sidebarSize: newSize };
    }
  }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  settingsOpen: false,
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  
  topbarColor: 'light',
  setTopbarColor: (color) => set({ topbarColor: color }),
  
  menuColor: 'dark',
  setMenuColor: (color) => set({ menuColor: color }),
  
  sidebarSize: 'default',
  setSidebarSize: (size) => set((state) => {
    // If hidden is selected, close sidebarOpen state
    if (size === 'hidden') {
      return { sidebarSize: size, sidebarOpen: false };
    }
    return { sidebarSize: size, sidebarOpen: true };
  }),
  
  agencyName: 'Lahomes',
  setAgencyName: (name) => set({ agencyName: name }),
  brandColor: '#604ae3',
  setBrandColor: (color) => set({ brandColor: color }),
  
  resetSettings: () => set({
    topbarColor: 'light',
    menuColor: 'dark',
    sidebarSize: 'default',
    sidebarOpen: true,
    settingsOpen: false,
    agencyName: 'Lahomes',
    brandColor: '#604ae3'
  })
}));
