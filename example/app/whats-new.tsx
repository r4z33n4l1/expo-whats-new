import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createWhatsNewController,
  WhatsNewSheet,
  type WhatsNewAction,
} from '@r4z33n4l1/whats-new-sheet';

import { announcements } from '../src/announcements';
import { memoryStorage } from '../src/storage';

const controller = createWhatsNewController({ storage: memoryStorage });

export default function WhatsNewRoute() {
  const { version, persist } = useLocalSearchParams<{
    version?: string;
    persist?: string;
  }>();
  const insets = useSafeAreaInsets();
  const announcement =
    announcements.find((item) => item.version === version) ?? announcements[0];
  const shouldPersist = persist === '1';

  const dismiss = async () => {
    if (shouldPersist && announcement) {
      await controller.markSeen(announcement);
    }

    router.back();
  };

  const handleAction = (action: WhatsNewAction) => {
    Alert.alert(action.label, `Action id: ${action.id}`);
  };

  if (!announcement) {
    return null;
  }

  return (
    <WhatsNewSheet
      announcement={announcement}
      bottomInset={insets.bottom}
      autoDismissOnUnmount={shouldPersist}
      onDismiss={dismiss}
      onAction={handleAction}
      theme={{
        accentColor: '#171411',
        backgroundColor: '#fffdf8',
        cardColor: '#f2ede4',
        borderColor: '#ded7cc',
        mutedColor: '#61594f',
        cornerRadius: 24,
        nextButtonLabel: 'Continue',
        doneButtonLabel: 'Got it',
      }}
    />
  );
}
