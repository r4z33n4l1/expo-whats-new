import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';

import type {
  WhatsNewAction,
  WhatsNewAnnouncement,
  WhatsNewImagePage,
  WhatsNewListPage,
  WhatsNewMediaSource,
  WhatsNewPage,
  WhatsNewTheme,
} from './types';

const defaultTheme = {
  accentColor: '#2D2D2D',
  backgroundColor: '#F3F0EB',
  foregroundColor: '#2D2D2D',
  mutedColor: '#5C5C5C',
  borderColor: 'rgba(0, 0, 0, 0.08)',
  cardColor: '#E9E4DC',
  buttonForegroundColor: '#F3F0EB',
  cornerRadius: 16,
  nextButtonLabel: 'Continue',
  doneButtonLabel: 'Got it',
};

export type WhatsNewSheetProps = {
  announcement: WhatsNewAnnouncement;
  onDismiss: () => void;
  onAction?: (action: WhatsNewAction, announcement: WhatsNewAnnouncement) => void;
  theme?: WhatsNewTheme;
  bottomInset?: number;
  autoDismissOnUnmount?: boolean;
};

const sfSymbolSource = (name: string) => (name.startsWith('sf:') ? name : `sf:${name}`);

export function WhatsNewSheet({
  announcement,
  onDismiss,
  onAction,
  theme,
  bottomInset = 0,
  autoDismissOnUnmount = false,
}: WhatsNewSheetProps) {
  const didDismissRef = useRef(false);
  const [pageIndex, setPageIndex] = useState(0);
  const resolvedTheme = useMemo(() => ({ ...defaultTheme, ...theme }), [theme]);
  const pages = announcement.pages;
  const activePage = pages[pageIndex];
  const isLastPage = pageIndex >= pages.length - 1;

  const dismiss = useCallback(() => {
    if (didDismissRef.current) {
      return;
    }

    didDismissRef.current = true;
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    return () => {
      if (autoDismissOnUnmount) {
        dismiss();
      }
    };
  }, [autoDismissOnUnmount, dismiss]);

  const goNext = useCallback(() => {
    const nextIndex = Math.min(pageIndex + 1, pages.length - 1);
    setPageIndex(nextIndex);
  }, [pageIndex, pages.length]);

  const handlePrimaryPress = () => {
    if (activePage && 'action' in activePage && activePage.action) {
      onAction?.(activePage.action, announcement);
      return;
    }

    if (isLastPage) {
      dismiss();
      return;
    }

    goNext();
  };

  const primaryLabel =
    activePage && 'action' in activePage && activePage.action
      ? activePage.action.label
      : isLastPage
        ? resolvedTheme.doneButtonLabel
        : resolvedTheme.nextButtonLabel;

  return (
    <View style={[styles.root, { backgroundColor: resolvedTheme.backgroundColor }]}>
      <View style={styles.page}>
        {activePage
          ? renderPage(activePage, {
              announcement,
              dismiss,
              goNext,
              isLastPage,
              theme: resolvedTheme,
            })
          : null}
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, 16) }]}>
        <View style={styles.dots}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === pageIndex
                      ? resolvedTheme.accentColor
                      : resolvedTheme.borderColor,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
          onPress={handlePrimaryPress}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: resolvedTheme.accentColor,
              borderRadius: resolvedTheme.cornerRadius,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, { color: resolvedTheme.buttonForegroundColor }]}>
            {primaryLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function renderPage(
  page: WhatsNewPage,
  context: {
    announcement: WhatsNewAnnouncement;
    dismiss: () => void;
    goNext: () => void;
    isLastPage: boolean;
    theme: Required<WhatsNewTheme>;
  }
) {
  switch (page.type) {
    case 'list':
      return (
        <ListPage
          announcement={context.announcement}
          page={page}
          theme={context.theme}
        />
      );
    case 'image':
      return (
        <ImagePage
          announcement={context.announcement}
          page={page}
          theme={context.theme}
        />
      );
    case 'custom':
      return page.render({
        dismiss: context.dismiss,
        goNext: context.goNext,
        isLastPage: context.isLastPage,
      });
  }
}

function PageHeader({
  announcement,
  theme,
}: {
  announcement: WhatsNewAnnouncement;
  theme: Required<WhatsNewTheme>;
}) {
  return (
    <View style={styles.pageHeader}>
      <Text style={[styles.kicker, { color: theme.mutedColor }]}>What's New</Text>
      {announcement.title ? (
        <Text style={[styles.version, { color: theme.mutedColor }]}>
          {announcement.title}
        </Text>
      ) : null}
    </View>
  );
}

function ListPage({
  announcement,
  page,
  theme,
}: {
  announcement: WhatsNewAnnouncement;
  page: WhatsNewListPage;
  theme: Required<WhatsNewTheme>;
}) {
  return (
    <View style={styles.pageContent}>
      <PageHeader announcement={announcement} theme={theme} />
      <View style={styles.titleRow}>
        {page.rows[0]?.icon ? (
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: theme.cardColor,
                borderRadius: Math.max(theme.cornerRadius, 12),
              },
            ]}
          >
            <Image
              source={sfSymbolSource(page.rows[0].icon)}
              tintColor={theme.foregroundColor}
              style={styles.heroIconImage}
            />
          </View>
        ) : null}
        <Text style={[styles.title, { color: theme.foregroundColor }]}>{page.title}</Text>
      </View>
      {page.body ? (
        <Text style={[styles.description, { color: theme.mutedColor }]}>{page.body}</Text>
      ) : null}

      <View style={styles.rows}>
        {page.rows.map((row, index) => (
          <View key={`${row.title}-${index}`} style={styles.row}>
            <View
              style={[
                styles.iconBubble,
                {
                  backgroundColor: theme.cardColor,
                  borderColor: theme.borderColor,
                  borderRadius: Math.max(theme.cornerRadius - 10, 12),
                },
              ]}
            >
              {row.icon ? (
                <Image
                  source={sfSymbolSource(row.icon)}
                  tintColor={theme.accentColor}
                  style={styles.icon}
                />
              ) : null}
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.foregroundColor }]}>
                {row.title}
              </Text>
              <Text style={[styles.rowDescription, { color: theme.mutedColor }]}>
                {row.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ImagePage({
  announcement,
  page,
  theme,
}: {
  announcement: WhatsNewAnnouncement;
  page: WhatsNewImagePage;
  theme: Required<WhatsNewTheme>;
}) {
  return (
    <View style={styles.pageContent}>
      <PageHeader announcement={announcement} theme={theme} />
      <View
        style={[
          styles.mediaFrame,
          { backgroundColor: theme.cardColor, borderRadius: theme.cornerRadius },
        ]}
      >
        <Image source={page.source} contentFit="cover" style={styles.media} />
      </View>
      <Text style={[styles.title, styles.centerTitle, { color: theme.foregroundColor }]}>
        {page.title}
      </Text>
      <Text style={[styles.description, { color: theme.mutedColor }]}>
        {page.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pageHeader: {
    gap: 6,
  },
  kicker: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  version: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  page: {
    flex: 1,
  },
  pageContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 34,
    gap: 22,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconImage: {
    width: 26,
    height: 26,
  },
  title: {
    flex: 1,
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '800',
    textAlign: 'left',
  },
  centerTitle: {
    flex: 0,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'left',
  },
  rows: {
    gap: 20,
    paddingTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  iconBubble: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 20,
    height: 20,
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  rowDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  mediaFrame: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  button: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },
});
