import { Text, View } from 'react-native';
import type { WhatsNewAnnouncement } from '@r4z33n4l1/whats-new-sheet';

export const announcements: WhatsNewAnnouncement[] = [
  {
    version: '1.2.0',
    title: 'Version 1.2.0',
    pages: [
      {
        type: 'list',
        title: "What's new",
        body: 'A compact summary works best for most updates.',
        rows: [
          {
            icon: 'sparkles',
            title: 'Polished details',
            description: 'Small interface upgrades throughout the app.',
          },
          {
            icon: 'rectangle.stack.fill',
            title: 'Versioned notes',
            description: 'Show the current release once, then keep it dismissed.',
          },
          {
            icon: 'externaldrive.fill',
            title: 'Bring your own storage',
            description: 'Use AsyncStorage, SecureStore, MMKV, or a test adapter.',
          },
        ],
      },
      {
        type: 'image',
        source: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
        title: 'Visual updates',
        description: 'Use an image when the release needs a quick visual cue.',
      },
    ],
  },
  {
    version: '1.1.0',
    title: 'Custom page escape hatch',
    pages: [
      {
        type: 'custom',
        render: ({ dismiss }) => (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              gap: 14,
            }}
          >
            <Text style={{ fontSize: 32, fontWeight: '900', textAlign: 'center' }}>
              Bring one bespoke page.
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24, textAlign: 'center' }}>
              The default data model stays tiny, but custom rendering is there when an
              app needs a special launch moment.
            </Text>
            <Text
              accessibilityRole="button"
              onPress={dismiss}
              style={{ fontSize: 16, fontWeight: '800', paddingTop: 8 }}
            >
              Close from custom content
            </Text>
          </View>
        ),
      },
    ],
  },
];
