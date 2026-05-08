import type { WhatsNewStorageAdapter } from '@r4z33n4l1/whats-new-sheet';

const store = new Map<string, string>();

export const memoryStorage: WhatsNewStorageAdapter = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => {
    store.set(key, value);
  },
  removeItem: (key) => {
    store.delete(key);
  },
};
