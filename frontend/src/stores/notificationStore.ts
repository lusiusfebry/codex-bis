import { create } from "zustand";

export type NotificationType = "sukses" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

type NotificationStore = {
  notifications: Notification[];
  addNotification: (type: NotificationType, title: string, message: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (type, title, message) =>
    set((state) => ({
      notifications: [
        {
          id: crypto.randomUUID(),
          type,
          title,
          message,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
  clearAll: () => set({ notifications: [] }),
}));
