import { useCallback, useEffect, useMemo, useState } from 'react';

import { createWhatsNewController } from './controller';
import type { WhatsNewAnnouncement, WhatsNewStorageAdapter } from './types';

type UseWhatsNewOptions = {
  announcements: WhatsNewAnnouncement[];
  storage: WhatsNewStorageAdapter;
  currentVersion?: string;
  storageKey?: string;
};

export function useWhatsNew({
  announcements,
  storage,
  currentVersion,
  storageKey,
}: UseWhatsNewOptions) {
  const [pendingAnnouncement, setPendingAnnouncement] =
    useState<WhatsNewAnnouncement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const controller = useMemo(
    () => createWhatsNewController({ storage, storageKey }),
    [storage, storageKey]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const next = await controller.getPendingAnnouncement(announcements, currentVersion);
    setPendingAnnouncement(next);
    setIsLoading(false);
  }, [announcements, controller, currentVersion]);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    controller
      .getPendingAnnouncement(announcements, currentVersion)
      .then((next) => {
        if (isActive) {
          setPendingAnnouncement(next);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [announcements, controller, currentVersion]);

  const markSeen = useCallback(
    async (announcement: WhatsNewAnnouncement) => {
      await controller.markSeen(announcement);
      await refresh();
    },
    [controller, refresh]
  );

  const dismiss = useCallback(
    async (announcement = pendingAnnouncement) => {
      if (!announcement) {
        return;
      }

      await markSeen(announcement);
    },
    [markSeen, pendingAnnouncement]
  );

  const reset = useCallback(
    async (announcement?: WhatsNewAnnouncement) => {
      await controller.reset(announcement);
      await refresh();
    },
    [controller, refresh]
  );

  return {
    pendingAnnouncement,
    isLoading,
    dismiss,
    reset,
    markSeen,
  };
}
