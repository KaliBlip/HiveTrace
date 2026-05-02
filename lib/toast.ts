/**
 * Toast notification system
 * Used for displaying success, error, and info messages
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

class ToastManager {
  private toasts: Map<string, Toast> = new Map();
  private listeners: Set<(toasts: Toast[]) => void> = new Set();

  subscribe(callback: (toasts: Toast[]) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    const toasts = Array.from(this.toasts.values());
    this.listeners.forEach((listener) => listener(toasts));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  show(type: ToastType, message: string, description?: string) {
    const id = this.generateId();
    const toast: Toast = {
      id,
      type,
      message,
      description,
      duration: 4000,
    };

    this.toasts.set(id, toast);
    this.notify();

    // Auto-remove after duration
    if (toast.duration) {
      setTimeout(() => this.remove(id), toast.duration);
    }

    return id;
  }

  success(message: string, description?: string) {
    return this.show('success', message, description);
  }

  error(message: string, description?: string) {
    return this.show('error', message, description);
  }

  info(message: string, description?: string) {
    return this.show('info', message, description);
  }

  warning(message: string, description?: string) {
    return this.show('warning', message, description);
  }

  remove(id: string) {
    this.toasts.delete(id);
    this.notify();
  }

  clear() {
    this.toasts.clear();
    this.notify();
  }

  getAll(): Toast[] {
    return Array.from(this.toasts.values());
  }
}

// Singleton instance
export const toast = new ToastManager();

/**
 * Hook for using toast in React components
 * Usage:
 * const { success, error } = useToast();
 * success('Operation completed!');
 */
export function useToastManager() {
  return {
    show: (type: ToastType, message: string, description?: string) =>
      toast.show(type, message, description),
    success: (message: string, description?: string) =>
      toast.success(message, description),
    error: (message: string, description?: string) =>
      toast.error(message, description),
    info: (message: string, description?: string) =>
      toast.info(message, description),
    warning: (message: string, description?: string) =>
      toast.warning(message, description),
    remove: (id: string) => toast.remove(id),
    clear: () => toast.clear(),
  };
}
