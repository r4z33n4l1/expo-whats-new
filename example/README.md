# Example App

This Expo Router app is a small playground for `@r4z33n4l1/whats-new-sheet`.

It is meant to answer three questions quickly:

- What does the sheet feel like in a real Expo route?
- How do announcements look as plain TypeScript data?
- How does seen-state persistence work without choosing a storage library?

## Run

From the package root:

```sh
corepack yarn install
corepack yarn example start
```

Expo Go should be enough for the example because the package only relies on `expo-image` and React Native primitives.

## Screenshots

The root README includes cropped simulator screenshots from this example's sheet UI:

- [`docs/assets/sheet-list.jpg`](../docs/assets/sheet-list.jpg)
- [`docs/assets/sheet-image.jpg`](../docs/assets/sheet-image.jpg)

## Files To Read First

- [`example/app/index.tsx`](./app/index.tsx): home screen with preview and reset buttons.
- [`example/app/whats-new.tsx`](./app/whats-new.tsx): form-sheet route that renders `WhatsNewSheet`.
- [`example/src/announcements.tsx`](./src/announcements.tsx): static list, image, and custom page examples.
- [`example/src/storage.ts`](./src/storage.ts): tiny in-memory `WhatsNewStorageAdapter`.

## Demo Flow

1. Open the app.
2. Tap the current-version button to open the sheet.
3. Tap through the pages.
4. Dismiss the sheet.
5. Notice the current-version button now treats the announcement as seen.
6. Tap reset to clear the in-memory store and preview it again.

The example intentionally keeps data local. A production app can pass announcements from static files, remote JSON, Convex, a CMS, or any other source.

## What The Example Does Not Do

- It does not publish anything to npm.
- It does not configure a backend.
- It does not use AsyncStorage.
- It does not include video pages or native video modules.

Those choices are deliberate: the package should be easy to inspect, easy to test, and safe to drop into an existing Expo app.
