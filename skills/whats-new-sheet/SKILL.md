---
name: whats-new-sheet
description: Build, maintain, document, and integrate the @r4z33n4l1/whats-new-sheet Expo/React Native package. Use when working on the package itself, adding release-note page data, wiring the package into an Expo or React Native app, creating an Expo Router form-sheet demo, validating npm packaging, or preserving the lightweight storage/presentation architecture.
---

# Whats New Sheet

## Core Intent

Use this skill to work on `@r4z33n4l1/whats-new-sheet`, a lightweight Expo/RN "What's New" sheet package.

Keep the package data-first and app-owned:

- The package owns presentation, typed announcement data, and seen-state helpers.
- The host app owns routing, storage, announcement delivery, analytics, and backend/admin systems.
- The package must stay lightweight: no bundled storage dependency, no backend, no Expo Video/native optional modules in v1.

## Repository Shape

Expected package repo:

```text
src/
  WhatsNewSheet.tsx
  controller.ts
  index.tsx
  types.ts
  useWhatsNew.ts
example/
  app/
  src/announcements.tsx
  src/storage.ts
README.md
example/README.md
AGENTS.md
package.json
```

Generated `lib/`, `node_modules/`, and `*.tgz` files are not source. Do not edit `lib/` manually.

## Public API Rules

Keep named exports only:

```ts
export { WhatsNewSheet } from './WhatsNewSheet';
export { createWhatsNewController } from './controller';
export { useWhatsNew } from './useWhatsNew';
export type { ... } from './types';
```

Current v1 page types:

- `list`: title, optional body, rows with optional SF Symbol icon, title, description.
- `image`: `expo-image` source, title, description.
- `custom`: render callback escape hatch.

Do not re-add `video` pages unless the user explicitly accepts a native-module requirement or an injected-renderer design.

## Integration Pattern

For Expo Router, create a host-owned route:

```tsx
<Stack.Screen
  name="whats-new"
  options={{
    presentation: 'formSheet',
    sheetGrabberVisible: true,
    sheetAllowedDetents: [0.75, 0.92],
    sheetCornerRadius: 24,
    headerShown: false,
    contentStyle: { backgroundColor: 'transparent' },
  }}
/>
```

Render the package inside the route and call host navigation from `onDismiss`.

Use a storage adapter:

```ts
const storage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
};
```

For demos/tests, use a `Map`-backed memory adapter.

## Design Guidance

Match a premium app release-note feel, not a generic onboarding carousel:

- Short "What's New" badge.
- One strong title.
- Optional short body copy.
- Three concise feature rows when possible.
- Warm neutral surfaces.
- One primary CTA.
- Avoid busy multi-button flows.

If integrating with Ritual, prefer its existing announcement feel: editorial badge, icon-plus-title row, compact feature rows, warm neutral backgrounds, and a strong single CTA.

## Packaging Rules

Package should remain ESM-only with TypeScript declarations:

- `main`: `./lib/module/index.js`
- `types`: `./lib/typescript/src/index.d.ts`
- `exports["."]`: `source`, `types`, `default`
- `sideEffects`: `false`
- `publishConfig.access`: `public`

Peers should stay broad:

```json
{
  "expo": "*",
  "expo-image": "*",
  "react": "*",
  "react-native": "*"
}
```

Do not add `@react-native-async-storage/async-storage` as a dependency or optional peer. Keep storage injected.

## Validation

Before saying package work is done, run from the package root:

```sh
corepack yarn typecheck
corepack yarn prepare
npm pack --dry-run
```

Confirm the dry-run tarball excludes:

- `example/`
- `node_modules/`
- `.git/`
- `.env*`
- generated app artifacts
- test fixtures unless intentionally published

For app integration, also run the host app’s usual typecheck/build when available. If the host repo has unrelated existing errors, report them separately and confirm no diagnostics point at the package integration files.

## Documentation

Keep docs useful to both humans and agents:

- `README.md`: consumer-facing install, quick start, API, theming, publishing, attribution.
- `example/README.md`: how to run and understand the playground.
- `AGENTS.md`: project boundaries and workflow for future agents.

Maintain a brief Notelet attribution in README acknowledgements:

```md
Thanks to [Notelet](https://github.com/mykolaharmash/notelet) by Mykola Harmash for inspiration around small, versioned release-note surfaces.
```
