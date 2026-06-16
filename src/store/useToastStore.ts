import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface PromptOptions {
  title?: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
  
  confirmState: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    resolve?: (value: boolean) => void;
  } | null;
  
  promptState: {
    isOpen: boolean;
    title: string;
    message: string;
    defaultValue: string;
    placeholder: string;
    confirmText: string;
    cancelText: string;
    resolve?: (value: string | null) => void;
  } | null;
  
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
  closeConfirm: (result: boolean) => void;
  closePrompt: (result: string | null) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: (message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    if (duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, duration);
    }
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  confirmState: null,
  promptState: null,
  
  confirm: (options) => {
    return new Promise<boolean>((resolve) => {
      set({
        confirmState: {
          isOpen: true,
          title: options.title || 'Confirm Action',
          message: options.message,
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          resolve,
        },
      });
    });
  },
  
  prompt: (options) => {
    return new Promise<string | null>((resolve) => {
      set({
        promptState: {
          isOpen: true,
          title: options.title || 'Input Required',
          message: options.message,
          defaultValue: options.defaultValue || '',
          placeholder: options.placeholder || '',
          confirmText: options.confirmText || 'Submit',
          cancelText: options.cancelText || 'Cancel',
          resolve,
        },
      });
    });
  },
  
  closeConfirm: (result) => {
    const state = get().confirmState;
    if (state?.resolve) {
      state.resolve(result);
    }
    set({ confirmState: null });
  },
  
  closePrompt: (result) => {
    const state = get().promptState;
    if (state?.resolve) {
      state.resolve(result);
    }
    set({ promptState: null });
  },
}));

export const toast = {
  success: (msg: string, dur?: number) => useToastStore.getState().showToast(msg, 'success', dur),
  error: (msg: string, dur?: number) => useToastStore.getState().showToast(msg, 'error', dur),
  warning: (msg: string, dur?: number) => useToastStore.getState().showToast(msg, 'warning', dur),
  info: (msg: string, dur?: number) => useToastStore.getState().showToast(msg, 'info', dur),
};
