import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWhatsNew } from '@r4z33n4l1/whats-new-sheet';

import { announcements } from '../src/announcements';
import { memoryStorage } from '../src/storage';

export default function Home() {
  const insets = useSafeAreaInsets();
  const currentVersion = '1.2.0';
  const { pendingAnnouncement, isLoading, reset } = useWhatsNew({
    announcements,
    currentVersion,
    storage: memoryStorage,
  });

  const previewItems = useMemo(
    () =>
      announcements.map((announcement) => ({
        label: announcement.title ?? `Version ${announcement.version}`,
        id: announcement.version,
      })),
    []
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 24) },
      ]}
    >
      <StatusBar style="dark" />
      <Text style={styles.eyebrow}>Standalone Expo Playground</Text>
      <Text style={styles.title}>A tiny Notelet-style sheet for RN apps.</Text>
      <Text style={styles.body}>
        The package owns rendering and seen-state helpers. Your app owns data,
        routing, and storage.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current version</Text>
        <Pressable
          style={[styles.primaryButton, !pendingAnnouncement && styles.disabledButton]}
          disabled={!pendingAnnouncement || isLoading}
          onPress={() => {
            if (pendingAnnouncement) {
              router.push({
                pathname: '/whats-new',
                params: { version: pendingAnnouncement.version, persist: '1' },
              });
            }
          }}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading
              ? 'Checking...'
              : pendingAnnouncement
                ? `Show ${pendingAnnouncement.version}`
                : `${currentVersion} already seen`}
          </Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => reset()}>
          <Text style={styles.secondaryButtonText}>Reset seen state</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preview all page types</Text>
        {previewItems.map((item) => (
          <Pressable
            key={item.id}
            style={styles.previewButton}
            onPress={() => {
              router.push({
                pathname: '/whats-new',
                params: { version: item.id, persist: '0' },
              });
            }}
          >
            <Text style={styles.previewButtonText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#7b6f61',
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    color: '#171411',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#61594f',
  },
  section: {
    gap: 12,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171411',
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#171411',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  disabledButton: {
    opacity: 0.42,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#f0ece4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#171411',
    fontSize: 15,
    fontWeight: '800',
  },
  previewButton: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ded7cc',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  previewButtonText: {
    color: '#171411',
    fontSize: 15,
    fontWeight: '700',
  },
});
