# SimplyFoodFacts

A React Native/Expo app for scanning food products and flagging ingredients of concern,
powered by Open Food Facts data.

## Tech Stack

- React Native / Expo 54 (Expo Router)
- Zustand (state management)
- TanStack Query v5 (data fetching)
- lucide-react-native (icons)
- Hono (backend, hosted on Anything/create.xyz platform)
- Neon (Postgres database)

## TanStack Query v5 Note

Use `isPending && !isError` instead of `isLoading` for loading states. In v5,
`isLoading` stays true during retries and can block empty/error states from rendering.

## Backend

- URL: `ab9205c2-9df6-4033-b222-734e5dfa9662.created.app`
- Database tables: `products`, `scan_history`, `alerts` (all include `device_id` column)
- External: Open Food Facts (world.openfoodfacts.org) for product lookups
- ⚠️ Backend device ID filtering not yet verified — confirm `WHERE device_id = ?`
  exists in all relevant backend queries before next major release

## Planned Migration: Away from Anything.ai

The backend is currently hosted on the Anything.ai/create.xyz platform.
This dependency is being removed. Do NOT add new dependencies on:
- `__create/` scaffolding
- `route-builder.ts`
- `NEXT_PUBLIC_CREATE_ENV`
- create.xyz hosted URLs

Migration backlog:
1. Replace route-builder.ts with standard React Router file-based routing
2. Fix @/ path aliases that break at Node runtime
3. Remove __create/ scaffolding (fetch.ts, stripe.ts, integrations proxy, auth)
4. Delete stale ssr-test route
5. Clean up NEXT_PUBLIC_CREATE_ENV references
6. Deploy to Vercel or alternative platform (Railway was explored and ruled out —
   do not suggest it)

## Environment Variables

- `EXPO_PUBLIC_BASE_URL` / `EXPO_PUBLIC_HOST` — create.xyz hosted domain
- `EXPO_PUBLIC_PROXY_BASE_URL` — auth WebView
- `EXPO_PUBLIC_PROJECT_GROUP_ID` — used in JWT auth headers
- `EXPO_PUBLIC_REVENUE_CAT_*` — RevenueCat (tip jar / in-app purchases)

## Two Machines

- **Mac Studio** (username: `cg`) — primary dev machine; paths use `anything/`
  subdirectory (e.g. `~/Projects/Apps/SimplyFoodFacts/anything/apps/mobile/`)
- **MacBook Air** (username: `carltongrizzle`) — secondary machine; paths do NOT
  use `anything/` (e.g. `~/Projects/Apps/SimplyFoodFacts/apps/mobile/`)

## Build Process (Xcode — Primary for Production)

Xcode is the primary build method. EAS is no longer used for production builds.

### Version & Build Number Workflow

Update BOTH files before every archive. Use Terminal — do not rely on the Xcode GUI
as it may not save correctly.

**Step 1 — Update Info.plist (hardcoded values required — do NOT use variables):**
```bash
sed -i '' 's/<string>OLD_VERSION<\/string>/<string>NEW_VERSION<\/string>/' \
  ios/SimplyFoodFacts/Info.plist
sed -i '' 's|<string>OLD_BUILD</string>|<string>NEW_BUILD</string>|' \
  ios/SimplyFoodFacts/Info.plist
```

⚠️ Do NOT use `$(MARKETING_VERSION)` or `$(CURRENT_PROJECT_VERSION)` variables in
Info.plist — this causes CompileAssetCatalogVariant failures at archive time.
Always use hardcoded values.

**Step 2 — Update project.pbxproj:**
```bash
sed -i '' 's/MARKETING_VERSION = OLD;/MARKETING_VERSION = NEW;/g' \
  ios/SimplyFoodFacts.xcodeproj/project.pbxproj
sed -i '' 's/CURRENT_PROJECT_VERSION = OLD;/CURRENT_PROJECT_VERSION = NEW;/g' \
  ios/SimplyFoodFacts.xcodeproj/project.pbxproj
```

**Step 3 — Update app.json version to match.**

**Step 4 — Verify in Xcode General tab** that Version and Build show correctly.

**Step 5 — Commit all three files:**
```bash
git add ios/SimplyFoodFacts/Info.plist \
        ios/SimplyFoodFacts.xcodeproj/project.pbxproj \
        app.json
git commit -m "Bump version to X.X.X build N"
git push
```

### Build Number Convention
- Build numbers increment globally — never reset between versions
- Last submitted build: 13 (version 1.1.3)
- Check App Store Connect → TestFlight → iOS for full build history

### Archive Steps
1. **Product → Clean Build Folder** (Shift + Cmd + K)
2. **Product → Archive**
3. In Organizer → **Distribute App** → upload to App Store Connect
4. Install via TestFlight on a physical device and test before submitting for review
5. In App Store Connect, attach build to submission manually — easy to miss

### Signing
- Use **manual signing** on the **Release tab** in Signing & Capabilities
- Automatic signing fails for distribution builds
- Distribution certificate fingerprint: `736AEBDBC2E94673911DCE3DAB578FB612CF77C1`
- Provisioning profile: `*[expo] com.createinc.ab9205c29df64033...`

### EAS Notes
- EAS is no longer used for production builds — Xcode archive is preferred
- If EAS is ever used, run `eas build:list --platform ios --limit 5` first
- Monthly EAS free tier quota is easily exhausted during iterative debugging
- `appVersionSource: remote` is still in eas.json but is irrelevant for Xcode builds

### Important Xcode Quirks
- `expo-updates` must be disabled — it conflicts with local Xcode builds.
  `EXUpdates` must be purged from Pods.
- Use `DevSettings.reload()` not `Updates.reloadAsync()` in DeviceErrorBoundary
  files — expo-updates is removed.
- Remove any Metro cache-wiping blocks from `metro.config.js` — they break
  production builds in Xcode's sandbox.
- `babel-plugin-module-resolver` is required for `@/` path aliases to resolve
  in Xcode's sandbox. Metro does not read `tsconfig.json` paths. Already
  configured — do not remove it.
- Always run `pod install` from the `ios/` directory after adding or removing
  native dependencies.

## Splash Screen

### Known Issue
`SplashScreen.hideAsync()` returns `undefined` on the first call in release
builds on physical iOS devices. The splash screen stays frozen until
`hideAsync()` actually succeeds. This is a known `expo-splash-screen` bug.

### Fix (applied in `_layout.jsx`)
```js
const hideSplash = async () => {
  let attempts = 0;
  while (attempts < 10) {
    const result = await SplashScreen.hideAsync();
    if (result !== undefined) break;
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }
};
```
- Call `hideSplash()` instead of `SplashScreen.hideAsync()` everywhere
- Also call via `setTimeout(hideSplash, 1500)` as a failsafe
- The render gate (`if (!isReady) return null`) has been removed — it caused
  permanent blank screens if async init hung

## Device Isolation

Scan history and alerts are keyed by `device_id` stored in AsyncStorage under
`"simplyfoodfacts_device_id"`. Each physical device generates a random UUID on
first launch via `src/utils/deviceId.js`.

All API calls append `?deviceId=<uuid>` via `appendDeviceId()`. No API call
should fetch or write user data without a device ID.

### Data Isolation Verification Checklist
When fixing any bug related to data isolation, always verify in this order:
1. Backend filters data by device ID (`WHERE device_id = ?` in every relevant query)
2. Frontend sends device ID on every request (no unguarded API calls)
3. End-to-end test with two real physical devices — confirm data does not bleed across

Sending `deviceId` on the frontend means nothing if the backend ignores it.
Always verify the backend first.

## Path Aliases

`@/` path aliases require `babel-plugin-module-resolver` to resolve during
Xcode archive builds. Already configured — do not remove it.

## Alert Toggles

Food-specific settings tracked in `alertMatching.js`:
- `showArtificialIngredients`
- `showArtificialColors`
- `showSweeteners`

## Known Issues (Non-Blocking)

- 40 expo packages out of date — run `npx expo install --check` to review
- `.expo/` directory not in `.gitignore` — add it
- Missing peer deps for `expo-three`: `expo-asset`, `expo-file-system`
- Duplicate native deps: `expo-glass-effect`, `expo-location`, `react`,
  `react-native-safe-area-context`
- Backend device ID filtering not yet verified — confirm `WHERE device_id = ?`
  exists in all relevant backend queries
