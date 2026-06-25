# Menu → Header unification

**Date:** 2026-06-23
**Branch:** `feat/menu-header` (off `origin/main`)
**Mockup:** `docs/superpowers/specs/mockup-menu.html` — closed bar = `.ribbon` (lines 116–122), open bar = transparent `.menu-bar` (lines 160–166). Design spec: `docs/superpowers/specs/2026-06-21-app-menu-design.md`.

## Problem

There are two stacked bars today:

- `Header` (`src/components/Header/Header.tsx`) — the real app bar: `surface` card + shadow, holding `[burger] [centered name] [avatar]`. Open/close state lives one level down in `Menu`.
- `MenuOverlay`'s own `TopBar` — a second, transparent bar drawn on top when open: `[spacer] [centered "תפריט"] [spacer]`, with only the burger button poking through via `MENU_TOGGLE.zIndex` (60) over the overlay's `zIndex` (50).

The burger and the title only *approximately* line up between the two bars because alignment depends on matching spacer widths by hand.

## Goal

Collapse the two bars into **one**. The real `Header` becomes the single bar for both states. Because it is the same DOM element in the same place, the burger and title are aligned horizontally and vertically between closed and open with no spacer-matching.

- **Closed:** `surface` bg + shadow, centered **name**, avatar at the end, hamburger icon.
- **Open:** **transparent** bg, no shadow, centered **"תפריט"** title, avatar faded out (its box reserved so the title stays centered), icon morphed to **X**.

## The hamburger

Only the burger button is elevated above the overlay today, which is why the rest of the header gets covered and a second bar is needed. Fix: elevate the **whole `Header` bar** above the overlay and **lift `isOpen` state into `Header`**. A single hamburger then lives in the header, always on top, morphing hamburger↔X — it both opens and closes. The overlay drops its own top bar and just scales its gradient + sections in behind the floating header.

## Decisions

- **State owner:** `Header` owns `isOpen`. `Menu` is repurposed as a controlled toggle.
- **Transition:** crossfade — name ↔ "תפריט" crossfade in the centered slot; avatar fades out (box reserved). Overlay still scales in behind.
- **Component rename:** `src/components/Menu` → `MenuToggle` (controlled toggle button only). Keep `MENU_TEST_IDS` (`menu-button`, `menu-icon`) so the e2e driver stays valid.

## Phases

### Phase 1 — Lift state, controlled `MenuToggle`
- Rename `Menu/` → `MenuToggle/`; `MenuToggle.tsx` is the existing `ToggleButton` + `BurgerIcon`, now controlled via props `isOpen: boolean` and `onToggle: () => void` (no internal state, no overlay render).
- `Header` gains `isOpen` state + `toggle`/`close` callbacks; renders `<MenuToggle isOpen onToggle>` and `<MenuOverlay isOpen onClose>`.
- Keep `MENU_TEST_IDS` ids unchanged.

### Phase 2 — Morphing Header bar
- `Bar` gets `data-open`: transparent bg + no shadow when open; `position: relative` + z-index above the overlay (new `HEADER_LAYOUT` z-index constant = 60, retiring the toggle-only z-index).
- Centered slot holds both name and "תפריט" stacked (absolute), opacity-crossfaded by `data-open`.
- Avatar wrapped so it fades opacity 1→0 on open while its box keeps reserving width (title stays centered).
- Move menu title text + `menu-title` testid from `MenuOverlay/constants.ts` into `Header/constants.ts`.

### Phase 3 — Slim the overlay
- Remove `TopBar`, `ToggleSpacer`, `Title` from `MenuOverlay`. Keep the gradient `Panel`, the Escape effect, and section `Content`.
- Add top padding to `Content`/`Panel` so sections clear the floating header.

## Test impact (handled per TDD workflow, after prod code per phase)
- Unit: `MenuToggle.test.tsx` (was `Menu.test.tsx`), `MenuOverlay.test.tsx`, `Header.test.tsx`, `Account.test.tsx`.
- e2e: `e2e/driver/menu-driver.ts`, `e2e/menu-morph.visual.ts` — remain valid as long as `MenuToggle` keeps `MENU_TEST_IDS`.

## Out of scope
- Section wiring (accounts/appearance/language), body scroll lock, focus trap — unchanged from prior plan.
