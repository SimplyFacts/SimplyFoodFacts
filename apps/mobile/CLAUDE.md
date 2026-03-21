# SimplyFoodFacts

A React Native/Expo app for scanning food products and flagging ingredients of concern,
powered by Open Food Facts data.

## Project Structure

This repo contains TWO `apps/mobile` directories — do not confuse them:

- `anything/apps/mobile/` — ✅ THIS IS SimplyFoodFacts (the active codebase)
- `apps/mobile/` — ⚠️ stale create.xyz platform scaffold, still on v1.0.0; ignore

Always work in `anything/apps/mobile/` unless explicitly told otherwise.

## Tech Stack

- React Native / Expo (Expo Router)
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

## Environment Variables

- `EXPO_PUBLIC_BASE_URL` / `EXPO_PUBLIC_HOST` — create.xyz hosted domain
- `EXPO_PUBLIC_PROXY_BASE_URL` — auth WebView
- `EXPO_PUBLIC_PROJECT_GROUP_ID` — used in JWT auth headers
- `EXPO_PUBLIC_REVENUE_CAT_*` — RevenueCat (tip jar / in-app purchases)

## Device Isolation

Scan history and alerts are keyed by `device_id` stored in AsyncStorage under
`"simplyfoodfacts_device_id"`. Each physical device generates a random UUID on
first launch. Note: Expo Go simulators may share AsyncStorage in cloned environments
— this is a dev artifact and does not affect production builds.

## EAS Build Notes

- Owner: `carlton.grizzle`
- EAS project ID: `5dd931aa-...` (carlton.grizzle account)
- `appVersionSource` is set to `remote` in `eas.json` — do NOT manually set
  `buildNumber` in `app.json`, EAS manages this automatically
- `autoSubmit` is enabled in the production profile — `eas build` will
  automatically submit to App Store Connect after building
- Always run `eas build` from `anything/apps/mobile/`
- Build must be manually attached to the submission in App Store Connect after
  each new build — easy to miss

## Apple Developer

- Team: David Carlton Grizzle (5MG8AK45K9)
- Bundle ID: `com.createinc.ab9205c29df64033b222734e5dfa9662`
- Expo account: `carlton.grizzle`
- GitHub org: SimplyFacts

## Alert Toggles

Food-specific settings tracked in `alertMatching.js`:

- `showArtificialIngredients`
- `showArtificialColors`
- `showSweeteners`

## Known Issues (Non-Blocking)

- 40 expo packages out of date — run `npx expo install --check` to review
- `.expo/` directory not in `.gitignore` — add it
- `expo-splash-screen` out of date (31.0.10 vs 31.0.13)
- Missing peer deps for `expo-three`: `expo-asset`, `expo-file-system`
- Duplicate native deps: `expo-glass-effect`, `expo-location`, `react`,
  `react-native-safe-area-context`
- `/ios` not in `.easignore` — EAS may not be syncing native config correctly
