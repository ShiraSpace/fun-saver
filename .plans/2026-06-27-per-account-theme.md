# Per-account theme

Persist each account's theme on the account record (source of truth = data store).
Delete the global `fs-theme` cookie machinery. Theme is resolved server-side from the
already-loaded selected account, so there is no first-paint flicker. The only visible
theme change is on account switch — a deliberate client transition.

## Phase 0 — Horizontal scroll fix (done, committed `4de7fc5`)

`overflow-x: hidden` on `html, body` in `globals.css` — the hero corner-star bleeds
off the card and, in RTL, past the left viewport edge.

## Phase 1 — Data model & store

1. `src/lib/types.ts` — add `themeId: ThemeId` to `Account`.
2. `src/lib/accounts-store.ts` — `createAccount` sets `themeId: DEFAULT_THEME_ID`;
   add `setTheme(id, themeId)` (assert account exists, call store).
3. `src/db/data-store.ts` — add `setAccountTheme(id, themeId): Promise<void>`.
4. Implement `setAccountTheme` in `json-file-store.ts` and `memory-store.ts`.
5. `src/db/data.json` — give the seed accounts distinct themes so per-account theming
   is visible when verifying.

## Phase 2 — Move theme resolution off the cookie

6. Move `resolveThemeId` from `theme-cookie.ts` into `registry.ts`.
7. Delete `theme-cookie.ts` and `theme-cookie.test.ts`.
8. `ThemeController.tsx` — drop the `document.cookie` write in `select()`; keep
   `useThemeId` / `useSetThemeId`.
9. `layout.tsx` — remove the cookie read and the `ThemeController` wrapper
   (keep `EmotionStyleRegistry`).
10. `page.tsx` — `initialThemeId = resolveThemeId(selectedAccount?.themeId)`; render
    `<ThemeController initialThemeId>{<Home/>}</ThemeController>` so `Home` is inside it.

## Phase 3 — Wire theme to account selection

11. `Home.tsx` `selectAccount(id)` — also `setThemeId(resolveThemeId(target.themeId))`.
12. `AppearanceSection.tsx` — on swatch click: `setThemeId(id)` + `PUT
    /api/accounts/<selectedAccountId>/theme` + `router.refresh()`; surface save errors.

## Phase 4 — API

13. `src/app/api/accounts/[id]/theme/route.ts` (`PUT`) — parse + validate `themeId`,
    call `AccountsStore.setTheme`, 404 if account missing. Thin route.

## Tests (per feature, after each prod step is approved)

- store `setAccountTheme` round-trips (json + memory)
- `accounts-store`: new accounts default to `DEFAULT_THEME_ID`; `setTheme` updates
- `registry`: `resolveThemeId` validates / falls back
- `AppearanceSection`: swatch click posts to the right account + sets theme
- account switch applies the target account's theme
- update `ThemeController.test.tsx` (no cookie write); `render.tsx` harness unchanged

## Notes

- `account.themeId` typed as `ThemeId`; every read passes through `resolveThemeId` so
  legacy/invalid data falls back safely.
- Fixed overlays (drawer, menu, create) are `position: fixed` and unaffected.

## Known limitations

- Stale-theme race (accepted): picking a swatch saves and calls `router.refresh()`,
  which updates the `accounts` prop asynchronously. Picking a theme on account A then
  rapid-switching A→B→A within the sub-second refresh window makes `selectAccount` read
  A's pre-save `themeId` and revert the view until the next full load. The data store is
  always correct; this is a transient client-view glitch only. Fix path if it ever
  matters: hold an in-session `themeByAccountId` overlay in `Home` that `selectAccount`
  reads before falling back to `account.themeId`.
