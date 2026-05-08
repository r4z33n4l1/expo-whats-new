import type { WhatsNewAnnouncement, WhatsNewStorageAdapter } from './types';

const DEFAULT_STORAGE_KEY = '@r4z33n4l1/whats-new-sheet:seen';

type ControllerOptions = {
  storage: WhatsNewStorageAdapter;
  storageKey?: string;
};

const getAnnouncementKey = (announcement: WhatsNewAnnouncement) =>
  announcement.storageKey ?? announcement.version;

const readSeenKeys = async (
  storage: WhatsNewStorageAdapter,
  storageKey: string
): Promise<Set<string>> => {
  const raw = await storage.getItem(storageKey);

  if (!raw) {
    return new Set();
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((item): item is string => typeof item === 'string'));
    }
  } catch {
    return new Set([raw]);
  }

  return new Set();
};

const writeSeenKeys = async (
  storage: WhatsNewStorageAdapter,
  storageKey: string,
  seenKeys: Set<string>
) => {
  await storage.setItem(storageKey, JSON.stringify([...seenKeys]));
};

export function createWhatsNewController({
  storage,
  storageKey = DEFAULT_STORAGE_KEY,
}: ControllerOptions) {
  const getSeenKeys = () => readSeenKeys(storage, storageKey);

  const isSeen = async (announcement: WhatsNewAnnouncement) => {
    const seenKeys = await getSeenKeys();
    return seenKeys.has(getAnnouncementKey(announcement));
  };

  const markSeen = async (announcement: WhatsNewAnnouncement) => {
    const seenKeys = await getSeenKeys();
    seenKeys.add(getAnnouncementKey(announcement));
    await writeSeenKeys(storage, storageKey, seenKeys);
  };

  const reset = async (announcement?: WhatsNewAnnouncement) => {
    if (!announcement) {
      await storage.removeItem(storageKey);
      return;
    }

    const seenKeys = await getSeenKeys();
    seenKeys.delete(getAnnouncementKey(announcement));
    await writeSeenKeys(storage, storageKey, seenKeys);
  };

  const getPendingAnnouncement = async (
    announcements: WhatsNewAnnouncement[],
    currentVersion?: string
  ) => {
    const candidates = currentVersion
      ? announcements.filter((announcement) => announcement.version === currentVersion)
      : announcements;

    for (const announcement of candidates) {
      if (!(await isSeen(announcement))) {
        return announcement;
      }
    }

    return null;
  };

  return {
    getPendingAnnouncement,
    getSeenKeys,
    isSeen,
    markSeen,
    reset,
  };
}
