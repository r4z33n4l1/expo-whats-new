import type { ReactNode } from 'react';

export interface WhatsNewStorageAdapter {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

export type WhatsNewMediaSource = string | number | { uri: string };

export type WhatsNewAction = {
  id: string;
  label: string;
};

export type WhatsNewListRow = {
  icon?: string;
  title: string;
  description: string;
};

export type WhatsNewListPage = {
  type: 'list';
  title: string;
  body?: string;
  rows: WhatsNewListRow[];
  action?: WhatsNewAction;
};

export type WhatsNewImagePage = {
  type: 'image';
  source: WhatsNewMediaSource;
  title: string;
  description: string;
  action?: WhatsNewAction;
};

export type WhatsNewCustomPageContext = {
  isLastPage: boolean;
  goNext: () => void;
  dismiss: () => void;
};

export type WhatsNewCustomPage = {
  type: 'custom';
  render: (context: WhatsNewCustomPageContext) => ReactNode;
};

export type WhatsNewPage =
  | WhatsNewListPage
  | WhatsNewImagePage
  | WhatsNewCustomPage;

export type WhatsNewAnnouncement = {
  version: string;
  title?: string;
  pages: WhatsNewPage[];
  storageKey?: string;
};

export type WhatsNewTheme = {
  accentColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  mutedColor?: string;
  borderColor?: string;
  cardColor?: string;
  buttonForegroundColor?: string;
  cornerRadius?: number;
  nextButtonLabel?: string;
  doneButtonLabel?: string;
};
