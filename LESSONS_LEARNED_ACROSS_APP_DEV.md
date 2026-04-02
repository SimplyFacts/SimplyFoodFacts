# Lessons Learned Across App Development

## 1. Always Include Full File Paths in Terminal and Claude Code Prompts
Ambiguous paths cause edits to the wrong file. Claude Code launched from the home directory will search for matching filenames and may find a stale copy in Downloads or another location instead of the actual project file. Always specify the full absolute path in every Terminal command and Claude Code edit instruction.

## 2. Splash Screen Issues Require Standalone Builds
Expo Go is insufficient for reproducing or testing splash screen behavior. Always test splash screen changes on a standalone Release build installed via TestFlight or direct Xcode install.

## 3. Prefer Xcode Local Builds Over EAS
EAS free tier has a 30-build monthly limit that gets exhausted quickly during debugging cycles. Always run `eas build:list --platform ios --limit 5` before triggering new EAS builds. Xcode local builds are preferred for production.

## 4. Info.plist Must Use Hardcoded Version Values
Do not use `$(MARKETING_VERSION)` or `$(CURRENT_PROJECT_VERSION)` variables in Info.plist — these cause `CompileAssetCatalogVariant` failures during Xcode archive builds. Always hardcode version and build number values directly.

## 5. Version and Build Numbers Must Be Set Manually
Set version and build number manually in both `app.json` and Xcode target settings (General → Identity) for each release. Do not rely on automatic versioning.

## 6. Grep Must Cover All Directories
Always grep across all directories excluding `node_modules`, not just `src/`. Missing directories like `__create/` has caused repeated failures where changes were made in the wrong place.

## 7. Backend Verification Must Be Part of Any Data Isolation Fix
Do not treat a data isolation fix as complete after frontend changes only. Always verify that `WHERE device_id = ?` (or equivalent) exists in all relevant backend queries. Backend verification is required before the fix is considered done.

## 8. autoSubmit in eas.json Belongs in the Submit Section
Do not put `autoSubmit` in build profiles. It belongs in the submit section of `eas.json`.

## 9. Use brew to Install CocoaPods on Modern Macs
`brew install cocoapods` is the correct approach on modern Macs. Do not use `sudo gem install cocoapods`.

## 10. GUI Certificate Import Can Silently Fail
Importing certificates via the macOS Keychain GUI can silently fail without any error message. Always use `sudo security import` in Terminal instead to ensure certificates are properly installed.

## 11. Do Not Suggest Reverting to a Known Broken Version
Never suggest reverting to a version that is already confirmed to be broken. Always check history before suggesting a rollback.

## 12. Remove __create Scaffolding Before Production Builds
Anything.ai `__create` scaffolding in `metro.config.js` (and elsewhere) can silently corrupt the JS bundle due to ESM/CJS mismatches and remote error reporting calls. Remove all `__create` dependencies from `metro.config.js` before production builds. Do not add new dependencies on `__create/` scaffolding, `route-builder.ts`, `NEXT_PUBLIC_CREATE_ENV`, or create.xyz hosted URLs.

## 13. Do Not Remove the 1500ms setTimeout in hideSplash
The 1500ms `setTimeout` in the `hideSplash` function was intentionally added to fix a splash screen freeze reported by Apple testers in earlier builds. Do not remove it.

## 14. Machine Paths
Carlton works across two machines:
- **Mac Studio** (username: `cg`):
  - SFF: `~/Projects/Apps/SimplyFoodFacts/anything/apps/mobile/`
  - SCF: `~/Projects/Apps/SimplyCosmeticsFacts/apps/mobile/`
- **MacBook Air** (username: `carltongrizzle`):
  - SFF: `~/Projects/Apps/SimplyFoodFacts/apps/mobile/`
  - SCF: not yet cloned — must be cloned before any SCF work on this machine

## 15. Latest Production iOS Version
The latest production iOS version is 26.4. Do not assume any iOS version is beta without confirmation.

## 16. NEVER Overwrite LESSONS LEARNED Without Confirming Twice
NEVER overwrite this file without confirming with Carlton two times first. Always append new lessons — never overwrite existing content.

## 17. Always Review Development History Before Starting Down a New Path
Search past conversations before beginning any new investigation or fix. This avoids repeating work already done, reopening issues already resolved, or going down paths already explored and abandoned.

## 18. Audit and Remove Platform-Specific Dependencies First When Migrating

When migrating away from a platform (e.g., Anything.ai/create.xyz), the first step should be auditing `package.json` and removing all platform-specific packages before doing anything else. In SFF's case, `@anythingai/app` remained as a dependency long after migration began. It brought in a duplicate `expo-router` which caused a `ViewManagerAdapter` duplicate registration crash that froze the splash screen across all production builds. This issue took months to identify because the root cause was hidden inside `node_modules` rather than in any source file. Always run `find node_modules -name "<key-package>" -type d` to check for duplicate packages when experiencing unexplained runtime crashes.
