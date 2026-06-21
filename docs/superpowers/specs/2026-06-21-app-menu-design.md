# App Menu (full-screen) — Design

**Date:** 2026-06-21
**Branch:** `feat/app-menu`
**Scope:** Static menu *shell* only. Interactions (account switching, edit, theme switching, language) are deferred to follow-up features.
**Mockups:** `docs/superpowers/specs/mockup-menu.html` (base), `mockup-menu-edit-chip.html` (edit-as-chip), `mockup-menu-avatar-letter.html` (avatar + letter chip).

## Summary

Add a full-screen menu overlay to the fun-saver app, opened by the existing hamburger button. The overlay renders three sections — Accounts, Appearance, Language — as a faithful static reproduction of the mockup. No section is wired to real behavior in this pass; the structure is built so wiring is a small follow-up change. A shared `Avatar` component is extracted and adopted across the menu, `AvatarPicker`, and `Header`.

## Current State

- `Menu` (`src/components/Menu/Menu.tsx`) renders only the hamburger button with a spin-cross open/close animation and owns an internal `isOpen` state. It renders **no** overlay. It lives inside `Header`, which lives inside `Account` → `Screen`.
- `Screen` is a full-viewport gradient surface (`min-height: 100vh`, `theme.gradients.screen`).
- Only **one** theme exists (`sunshine-quest`); the mockup shows three.
- There is **no** i18n layer; the mockup shows a עברית/EN toggle.
- Avatar image rendering is duplicated: `AvatarPicker` renders it inline (fluid, in a selectable button), and `Header` has its own local `Avatar` (fixed 40px).

## Architecture

**Approach A — Menu owns everything.** `Menu` keeps its single `isOpen` state and additionally renders a `MenuOverlay`. Because the overlay is `position: fixed; inset: 0`, it escapes the `Header` layout, so there are **no prop changes** to `Header` or `Account`, and the menu stays self-contained. Both the header burger and the overlay's close-burger flip/clear the same `isOpen`.

### File structure

```
src/components/
  Avatar/                  ← NEW shared circular avatar image
    Avatar.tsx
    Avatar.test.tsx
    constants.ts
    index.ts
  Menu/
    Menu.tsx               ← button (existing) + renders <MenuOverlay isOpen onClose/>
    constants.ts           ← existing MENU_ICON/MENU_TEST_IDS + overlay/content ids
    index.ts               ← unchanged (exports Menu)
    Menu.test.tsx          ← extended: open/close, Escape
    BurgerIcon/            ← NEW: extracted spin-cross icon (used by the single header toggle)
      BurgerIcon.tsx
      BurgerIcon.test.tsx
      constants.ts
      index.ts
    MenuLabel/             ← NEW: shared uppercase section heading (used by all three sections)
      MenuLabel.tsx
      MenuLabel.test.tsx
      constants.ts
      index.ts
    MenuOverlay/
      MenuOverlay.tsx      ← fixed inset:0 panel, gradient bg, transition, top bar (title only) + section content
      MenuOverlay.test.tsx
      constants.ts
      index.ts
    AccountsSection/       ← "החשבונות": avatar+letter chips, edit chip, add chip
      AccountsSection.tsx
      AccountsSection.test.tsx
      constants.ts
      index.ts
    AppearanceSection/     ← "מראה": 3 static theme swatches
      AppearanceSection.tsx
      AppearanceSection.test.tsx
      constants.ts
      index.ts
    LanguageSection/       ← "שפה": segmented עברית / EN
      LanguageSection.tsx
      LanguageSection.test.tsx
      constants.ts
      index.ts
```

## Shared Avatar component

Renders **only** the circular cover image; selection rings, badges, and wrapping buttons stay with each caller. Two sizing modes:

- `<Avatar avatarId alt size={n} />` — fixed `n`px circle (Header, Menu chip).
- `<Avatar avatarId alt fill sizes="…" />` — fills its parent (AvatarPicker keeps its responsive grid).

Renders via `next/image` with `src={avatarSource(avatarId)}`, `object-fit: cover`, circular, `unoptimized`.

**Adoption (full dedup):**
- `Header` — replace its local `Avatar` with `<Avatar size={HEADER_AVATAR_PROPS.size} />`.
- `AvatarPicker` — its `OptionButton` wraps `<Avatar fill sizes=… />`; ring/hover stay on the button.
- Menu account chip — `<Avatar size>` + corner letter badge + selection ring wrapper.

## MenuOverlay behavior & styling

- **Mounting/visibility:** always mounted; a `data-open` attribute (matching the existing `IconBox` pattern) drives the transition.
- **Positioning:** `position: fixed; inset: 0`, `z-index` above app content, `overflow-y: auto`. Background = `theme.gradients.screen` to match the mockup.
- **Transition:** closed = `opacity: 0; transform: scale(.92)`, `transform-origin: top right` (RTL top-start), `pointer-events: none`; open = `opacity: 1; transform: scale(1); pointer-events: auto`; ~300ms ease. Values live in the overlay's `constants.ts`.
- **Top bar:** status-bar spacer + centered title "תפריט" (balanced by start/end spacers); no separate close control.
- **Single toggle (revised after feedback):** there is **one** morphing hamburger/X — the header toggle. It floats above the overlay (`z-index` above the panel via `MENU_TOGGLE.zIndex`) so the same icon both opens and closes the menu. The overlay does **not** render its own close button.
- **Close affordances:** (1) the floating header toggle (hamburger ↔ X); (2) **Escape** keydown calls `onClose`.
- **Accessibility:** overlay `role="dialog"` + `aria-label="תפריט"`; header toggle keeps `aria-expanded`.
- **Out of scope (noted follow-ups):** body scroll lock; focus trap.

## Sections (static content)

Each renders a `menu-label` heading + body; strings, placeholder data, and `*_TEST_IDS` live in the section's `constants.ts`. All non-interactive this pass.

1. **AccountsSection — "החשבונות"** — one row:
   - **Account chips** — circular `Avatar` (real `avatarSource` SVG) with the name's first letter in a small purple pill **badge** at the bottom-start corner; selected chip gets the gold outline ring. Static placeholders: `נ` (selected) + `מ`, each paired with a placeholder avatar id.
   - **Edit chip** — `✏️` in a translucent circle (same style as add), acts on the *selected* account. Inert.
   - **Add chip** — `＋` in a translucent circle. Inert.
2. **AppearanceSection — "מראה"** — three static swatches (gradient `linear-gradient(135deg,#FFC34D,#E94E89)` / `#2E7D67` / `#3D5AFE`), first marked selected with a white ring. Colors are mockup placeholders in the section's `constants.ts`, not yet tied to the theme registry.
3. **LanguageSection — "שפה"** — segmented control `עברית | EN`; `עברית` marked selected (gradient fill + white text), `EN` muted. Inert.

## Testing

Jest + RTL; `data-testid` queries; `render()` in `beforeEach`; constants for ids/content; centralized `__mocks__/next/image`.

- **Avatar** — correct `src`/`alt`; fixed `size` dimensions in size mode; `fill` in fill mode.
- **BurgerIcon** — reflects `isOpen` (cross vs. bars) via `data-open`.
- **MenuOverlay** — `role="dialog"` + label; `data-open` reflects `isOpen`; close click calls `onClose`; Escape calls `onClose`.
- **Menu** (extended) — header button toggles overlay; close-burger closes; Escape closes; `aria-expanded` tracks state.
- **AccountsSection** — chip per placeholder account (avatar + letter badge); selected chip `data-selected="true"`; edit + add chips render.
- **AppearanceSection** — three swatches; first `data-selected="true"`.
- **LanguageSection** — two segments; `עברית` `data-selected="true"`.
- **Refactor coverage** — `Header` and `AvatarPicker` tests pass after swapping in `Avatar`; adjust only what the swap requires.

Implementation follows the project's strict per-step TDD workflow: production code approved and committed first, then tests one at a time.

## Assumptions

- The phone frame in the mockup is presentation scaffolding; the real overlay covers the full viewport.
- Static placeholder content (account initials/avatars, swatch colors, language labels) is acceptable for this pass and will be replaced when each section's backing feature lands.
- Hebrew/RTL is the only direction this pass; the EN toggle is visual only.

## Out of scope (follow-ups)

- Wiring account switching, edit-account, theme switching, and language toggle to real state/persistence.
- A real i18n layer and additional themes in the registry.
- Body scroll lock and focus trap for the overlay.
