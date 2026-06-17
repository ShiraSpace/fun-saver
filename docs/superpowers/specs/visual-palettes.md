# fun-saver — Visual Palettes

The chosen palette is **Sunshine Quest** (Palette C). Palettes A and B are kept as reference for future redesigns. All values verified WCAG AA on listed surfaces. Reference mockup of the home screen: [`mockup-home-screen.html`](./mockup-home-screen.html).

## Palette C — "Sunshine Quest" · CHOSEN

Warm gradient background, white rounded cards, gamified-but-disciplined tone. Inspired by `public/inspiration/Screenshot 2026-06-17 at 22.17.06.png`.

### Background

| Token          | Value                                                         | Use                              |
| -------------- | ------------------------------------------------------------- | -------------------------------- |
| appBg          | `linear-gradient(160deg,#FFC34D 0%,#FF8A4C 40%,#E94E89 100%)` | Page/screen background           |
| stage          | `#0a0a0a`                                                     | Outside the app frame (web only) |
| surface        | `#FFFFFF`                                                     | Cards                            |
| surfaceSoft    | `#FFF6E0`                                                     | Deposit cell, balance pills      |
| surfaceCallout | `#FFF8E0` + dashed `#FFD23F`                                  | Daily interest callout           |
| surfaceGain    | `#E1F4E5`                                                     | Interest-gain cell               |

### Brand colors

| Token          | Hex       | Use                             |
| -------------- | --------- | ------------------------------- |
| primary        | `#6B2C8E` | Primary CTA, app accent         |
| primaryHi      | `#8A3AAE` | Top of CTA gradient             |
| primaryShadow  | `#4A1A6E` | CTA drop shadow (3D base)       |
| accentGold     | `#FFD23F` | Stars, callout borders          |
| accentGoldDark | `#E69B00` | Star stroke                     |
| success        | `#2E7D32` | Interest gains, positive deltas |
| successSoft    | `#5BA570` | Success currency symbol         |

### Text colors

| Token      | Hex       | Use                              |
| ---------- | --------- | -------------------------------- |
| text       | `#3a1f5a` | Primary text on white surfaces   |
| textOnDark | `#FFFFFF` | Text on the warm gradient        |
| textMuted  | `#8A7AA7` | Secondary/meta text              |
| textGold   | `#7A5A0A` | Text inside gold-callout regions |

### Pot accents

| Pot         | Soft gradient                             | Used on                 |
| ----------- | ----------------------------------------- | ----------------------- |
| חיסכון      | `linear-gradient(135deg,#FFE6B0,#FFC34D)` | Hero illustration block |
| בזבוזים     | `linear-gradient(135deg,#FFD8C7,#FF8A4C)` | Card icon background    |
| מעשים טובים | `linear-gradient(135deg,#FBC4DA,#E94E89)` | Card icon background    |

### Typography

- **Display / headings**: `'Fredoka', 'Rubik', sans-serif`, weight 600–700
- **Body**: `'Rubik', 'Roboto', sans-serif`, weight 400–600
- **Numbers**: tabular figures (`font-variant-numeric: tabular-nums`)

### Currency display

The shekel sign sits at the **lower-left** of the number, ~40% size of the digits, opacity 0.65, with `position:relative; top:0.35em` for the subscript offset. The number wrapper uses `direction: ltr` to keep ordering correct in an RTL container.

### Coin visualisation (for daily interest)

A single coin design — silver radial gradient with the `₪` glyph centered. Used in two forms:

- **Full coin** — full circle.
- **Half coin** — D-shape (path `M 50 4 A 46 46 0 0 1 50 96 L 50 4 Z`), with a thin darker strip on the flat side to signal a broken edge. The `₪` glyph is clip-pathed to the right half so it visually matches the coin shape. **No `½` text is drawn on the coin.**

Display logic: round the actual daily interest to the nearest half-shekel, then render `floor(amount)` full coins + one half coin if `amount % 1 === 0.5`. Hide the daily row when the rounded value is 0.

### Reference assets

- Home-screen mockup: `mockup-home-screen.html`
- Inspiration source: `public/inspiration/Screenshot 2026-06-17 at 22.17.06.png`

## Shared Design Tokens

- Border radius: 12px (small), 16px (cards), 18–24px (hero/cards-with-shadow), 999px (pills/CTA)
- Card "lifted" shadow: `0 6px 0 rgba(0,0,0,0.06)` for hero, `0 3–4px 0 rgba(0,0,0,0.06)` for secondary
- CTA shadow: `0 5px 0 #4A1A6E, 0 10px 18px rgba(107,44,142,0.45)`
- Page padding (mobile): `theme.spacing(2)` (16px)
- Card padding: `theme.spacing(2.25)` (18px)
- Stack gap between supporting cards: `theme.spacing(1)` (8px)

## Palette A — "Mint Ledger"

Calm, ageless, slightly editorial. Recommended as the safe default.

| Token         | Hex                     | Use                                 |
| ------------- | ----------------------- | ----------------------------------- |
| primary       | `#2E7D67`               | App primary, FAB, active tab        |
| primaryShadow | `rgba(46,125,103,0.35)` | FAB / button shadow                 |
| secondary     | `#F2B544`               | Accents, highlights                 |
| success       | `#3FA66B`               | Positive deltas (interest, +amount) |
| warning       | `#E07A3C`               | Withdrawals, attention copy         |
| background    | `#FAF8F3`               | App background                      |
| surface       | `#FFFFFF`               | Cards                               |
| text          | `#1F2A2E`               | Primary text                        |
| textMuted     | `#7A8891`               | Secondary / meta text               |

Pot accents:

| Pot         | Accent    | Soft (chip / icon bg) |
| ----------- | --------- | --------------------- |
| חיסכון      | `#2E7D67` | `#DFF0E9`             |
| בזבוזים     | `#5B7BD9` | `#E3E9FA`             |
| מעשים טובים | `#D26A8E` | `#F8E1E9`             |

## Palette B — "Sunny Modern"

Warmer, more visibly kid-leaning, still unisex.

| Token         | Hex                    | Use                          |
| ------------- | ---------------------- | ---------------------------- |
| primary       | `#3D5AFE`              | App primary, FAB, active tab |
| primaryShadow | `rgba(61,90,254,0.35)` | FAB / button shadow          |
| secondary     | `#FFB300`              | Accents, highlights          |
| success       | `#2E7D32`              | Positive deltas              |
| warning       | `#EF6C00`              | Withdrawals, attention copy  |
| background    | `#FFFDF7`              | App background               |
| surface       | `#FFFFFF`              | Cards                        |
| text          | `#1A1A2E`              | Primary text                 |
| textMuted     | `#7A8891`              | Secondary / meta text        |

Pot accents:

| Pot         | Accent    | Soft (chip / icon bg) |
| ----------- | --------- | --------------------- |
| חיסכון      | `#0288D1` | `#DBEEFB`             |
| בזבוזים     | `#F4511E` | `#FDE2D6`             |
| מעשים טובים | `#7CB342` | `#E2EFD2`             |

## Shared Design Tokens

- Font family: `'Rubik', 'Roboto', 'Helvetica', sans-serif`
- Pot icons: 🐷 חיסכון · 🛍️ בזבוזים · ⭐ מעשים טובים
- App chrome icons: Material Symbols (rounded variant) from `@mui/icons-material`
- Border radius: 12px (small), 16px (cards), 22px (drawer top)
- Card elevation: `0 1px 2px rgba(0,0,0,0.04)` (mobile-first, prefer borders + soft shadow over MUI's stock elevation)
- Page padding: `theme.spacing(2)` (16px)
- Card padding: `theme.spacing(2.5)` (20px)
- Stack gap between pots: `theme.spacing(1.5)` (12px)

## Notes

- All palettes intentionally avoid pink-dominant or pastel-everything to read unisex and age past 6 years old.
- A third candidate palette ("Sunshine Quest") is being explored based on a playful-gradient inspiration; will be added here if selected.
