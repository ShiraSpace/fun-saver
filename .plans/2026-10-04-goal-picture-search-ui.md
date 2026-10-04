# GoalPictureSearch UI — plan (split out of PR 4b)

**Branch:** `feat/goal-picture-search-ui` (worktree `fun-saver-goal-picture-search-ui`, off `a47859a`).
**Spec:** `docs/superpowers/specs/2026-10-03-saving-goal-design.md` (Image search v1; New components, row `GoalPictureSearch`, frame 1b).
**Mockup:** `mockups/saving-goal.html`, frame 1b.

The search sheet, built on its own and not rendered anywhere. PR 4b puts it inside `SetGoal`.
Out of scope: API routes, `AccountSummary`, `MenuGoal`, `SetGoal`, and wiring it into any screen. Those
belong to PR 2 and PR 4b.

**Status:** the plan was approved with the decisions below. The production code is written and passes `tsc`
and `eslint`. It is uncommitted and awaiting review. Tests have not been written.

## Decisions (approved 2026-10-04)

1. **Typing stays responsive:** the input updates on every keystroke, and `matchingPictures` runs on
   `useDeferredValue(query)`, so React searches when it has time. This replaced an earlier 200 ms
   debounce hook (decided on #189). No dependency, no timer.
2. **Tile colour:** the existing `colors.softBg`. No new `ThemeColors` fields, because the celebration lane
   edits the theme files.
3. **Starting picture:** `picture: GoalPicture | null`. `null` means none chosen yet, and the sheet then
   starts with `DEFAULT_GOAL_PICTURE` (🎯) as the chosen picture. That constant goes in
   `src/lib/goal/constants.ts`, the spec's place for it, which did not have it yet.
4. **Copy:** the proposed Hebrew, to be reviewed at the code checkpoint.
5. **Closing:** ✕, a tap on the scrim, and Escape (`useEscapeKey`) call `onClose`. Phone Back, swipe-down,
   the grabber and a focus trap are left to 4b.
6. **בחירה** only calls `onChange`. `SetGoal` closes the sheet.
7. **Screenshots:** none in this PR, and no harness. PR 4b shoots the sheet in place.
8. **Glossary:** the picture-tile row is added in this PR.

## What the sheet does

- It opens already searching for the goal name. Editing the text searches again, through `useDeferredValue`.
- The word list loads with `import()` when the sheet mounts and is indexed once with `indexPictureWords`.
  `matchingPictures(searchedQuery, picturesByTerm)` is memoised on both. There is no module-level cache:
  reopening the sheet re-indexes in milliseconds.
- Picture tiles fill a 3-column grid. The grid is as tall as it is wide (`aspect-ratio: 1`), so three rows
  of square tiles show and the rest scroll.
- Tapping a tile chooses it, shown with a ✓. **בחירה** sends `{ kind: 'emoji', emoji: chosenPicture }`
  through `onChange`. A picture is always chosen (🎯 at first when `picture` is null), so **בחירה** is never
  disabled.
- Nothing in the sheet says "emoji".

### States (the grid area shows exactly one)

| When | Shows | Copy |
|---|---|---|
| Word list loading (`REQUEST_STATE.pending`) | status line | `מחפשים תמונות…` |
| Load failed (`REQUEST_STATE.failed`) | `NoPicturesReason` in `alertText` | `אופס, התמונות לא נטענו. סגרו ונסו שוב.` |
| Loaded, query blank after trim | `NoPicturesReason` (nothing typed) | `כתבו מה רוצים לחפש` |
| Loaded, no match | no-match line naming the query | `לא מצאנו תמונה ל„{query}”. נסו מילה אחרת.` |
| Loaded, matches | the tiles | — |

## Files (as built)

| File | Lines | Holds |
|---|---|---|
| `src/lib/goal/constants.ts` | +5 | `DEFAULT_GOAL_PICTURE` (🎯) |
| `docs/glossary.md` | +1 | the picture-tile row |
| `GoalPictureSearch/GoalPictureSearch.tsx` | 118 | the sheet, plus three small parts in the same file: `SheetHeading` (title and ✕), `QueryField` and `ChooseButton` |
| `GoalPictureSearch/GoalPictureSearch.styles.ts` | 72 | `Scrim`, `Sheet`, `TitleRow`, `SheetTitle`, `CloseButton`, `SearchBox` |
| `GoalPictureSearch/use-goal-picture-search.ts` | 51 | the sheet's state: the query, the deferred `searchedQuery`, `chosenPicture`, `confirmChoice` |
| `GoalPictureSearch/use-matching-pictures.ts` | 37 | loads, indexes and matches; returns `{ pictures, requestState }` |
| `GoalPictureSearch/constants.ts` | 4 | test ids |
| `GoalPictureSearch/index.ts` | 2 | named re-exports |
| `GoalPictureSearch/PictureTiles/PictureTiles.tsx` | 85 | `whyNoPictures({ pictures, requestState, query })` and the found pictures |
| `GoalPictureSearch/PictureTiles/PictureTiles.styles.ts` | 64 | `FoundPictures`, `PictureTile`, `NoPicturesReason` |
| `GoalPictureSearch/PictureTiles/constants.ts` | 13 | test ids, copy (single-use style values sit inline in the `.styles.ts`) |
| `GoalPictureSearch/PictureTiles/index.ts` | 1 | named re-export |

All component files live under `src/components/Goal/`. The largest function is `GoalPictureSearch`, at the
40-line limit after the three parts were taken out.

## Names

```ts
export interface GoalPictureSearchProps {
  goalName: string;
  picture: GoalPicture | null;
  onChange: (picture: GoalPicture) => void;
  onClose: () => void;
}
```

- `picture` and `onChange` pair as in `NameField` and `TransactionTypeToggle`. `onClose` matches
  `TransactionDrawer`.
- A tile tap is `chosenPicture` / `onChoosePicture`. **בחירה** is `ChooseButton`'s `onChoose`, and only it
  changes the goal's picture. `QueryField` hands the typed text up through `editQuery`.
- The hook returns `pictures` and does not shadow the lib's `matchingPictures`.

## Look

- Every colour comes from a theme token. The scrim uses `tints.shade`, the sheet `colors.surface` with
  `shadows.deep`, and the search box `colors.walletTrack`. The tiles use `colors.softBg`. The chosen tile's
  outline and ✓ badge use `colors.selectionRing`, with the tick in `textOnPrimary`.
- The scrim and sheet are both at `LAYERS.modalForeground`, above `SetGoal`'s overlay at `modal`.
- The sheet is `role="dialog"` with `aria-modal`, labelled by its title through `useId`. The ✕ has
  `aria-label="סגירה"`. The search box is `type="search"` and is not auto-focused.

## Tests (next step, after the production code is committed)

The first three go in `PictureTiles/PictureTiles.test.tsx` (props only). Each test must redden on its own
break, using the snapshot method from AGENTS.md.

| # | File | Test | Break |
|---|---|---|---|
| 1 | PictureTiles | one tile per matching picture, in order | render `pictures.slice(1)` |
| 2 | PictureTiles | only the chosen picture is `aria-pressed` | compare with `pictures[0]` |
| 3 | PictureTiles | tapping a tile chooses its picture | `onChoosePicture(pictures[0])` |
| 4 | PictureTiles | loading shows the loading line and no tiles | drop the `pending` branch |
| 5 | PictureTiles | a failed load shows the error line | treat `failed` like `idle` |
| 6 | PictureTiles | no match names the typed words | leave `{query}` out |
| 7 | PictureTiles | a blank query shows the hint | fold blank into no-match |
| 8 | PictureTiles | on `jungleQuest` the chosen tile is ringed in `selectionRing` | ring with `primary` |
| 9 | use-matching-pictures | `pending` until the list loads, then `idle` | start at `idle` |
| 10 | use-matching-pictures | "האופניים" finds 🚲 from the real list | match `''` |
| 11 | use-matching-pictures.failed | a list that fails to load gives `failed` | delete the `.catch` |
| 13 | GoalPictureSearch | opens searching for the goal name, with 🚲 a tile for "אופניים" | `useState('')` |
| 14 | GoalPictureSearch | typing "כלב" shows 🐶 and no ❤️ after the delay | input not wired |
| 15 | GoalPictureSearch | opened with `picture: null`, בחירה sends 🎯 | start from `''` |
| 16 | GoalPictureSearch | choose 🚲, then בחירה sends `{ kind: 'emoji', emoji: '🚲' }` once | send `pictures[0]` |
| 17 | GoalPictureSearch | opened with a picture, that tile shows chosen | ignore `picture` |
| 18 | GoalPictureSearch | ✕ calls `onClose` and not `onChange` | wire ✕ to `confirmChoice` |
| 19 | GoalPictureSearch | a tap on the scrim closes | drop the scrim's `onClick` |
| 20 | GoalPictureSearch | Escape closes | drop `useEscapeKey` |
| 21 | GoalPictureSearch | the dialog is named by its title | drop `aria-labelledby` |

Risk: the plan assumes next/jest turns `import()` of the JSON into a `require`. If it does not, the
fallback is `jest.mock` of the JSON path with a small word list.
