# Edit Account Mode

## Why

The `EditAccountChip` (✏️ "עריכת חשבון") in the menu is inert. Wire it up so a
user can rename an account and change its avatar — the same two fields the
create form already exposes. Reuse the create form so the two stay consistent.

## Decisions (confirmed)

- **Reuse strategy:** extract a shared `AccountForm` (NameField + AvatarPicker +
  submit). `CreateAccount` and `EditAccount` each wrap it with their own title,
  button label, initial values, and submit handler.
- **Editable fields:** name + avatar only. Theme has its own editor; wallets and
  interest are immutable.
- **Which account:** edit always targets the currently selected account
  (`useAccounts().selectedAccountId`). No extra "which account" state needed.

## Architecture touch points

| Layer | Change |
|-------|--------|
| `src/db/data-store.ts` | add `updateAccount(id, { name, avatarId }): Promise<Account \| undefined>` |
| `src/db/json-file-store.ts` | implement it, mirroring `setAccountTheme` (lines 45–59) |
| `src/lib/accounts-store.ts` | add `updateAccount` delegating to the store |
| `src/app/api/accounts/[id]/route.ts` | new `PUT` handler (mirrors `[id]/theme/route.ts`) |
| `src/components/AccountForm/` | **new** shared form (extracted from CreateAccount) |
| `src/components/CreateAccount/CreateAccount.tsx` | becomes a thin wrapper over `AccountForm` |
| `src/components/EditAccount/` | **new** wrapper: `AccountForm` + `useUpdateAccount` |
| `src/components/EditAccount/use-update-account.ts` | **new** hook: `PUT /api/accounts/[id]` |
| `src/components/Home/app-mode-context.ts` | add `editingAccount` to `APP_MODE` |
| `src/components/Menu/AccountsSection/EditAccountChip.tsx` | wire `onClick` → set edit mode |
| `src/components/Home/Home.tsx` | render `EditAccount` overlay; refresh account on save |

## Phases

### Phase 1 — Persistence + lib + API (backend first)
1. `DataStore.updateAccount(id, patch)` interface + `JsonFileStore` impl
   (copy the read-find-mutate-persist shape of `setAccountTheme`; only touch
   `name`/`avatarId`; return updated account or `undefined` if id missing).
2. `AccountsStore.updateAccount(id, patch)` delegating to the store.
3. `PUT /api/accounts/[id]` — validate body has `name` and/or `avatarId`,
   call `AccountsStore.updateAccount`, return updated JSON or `404`.

### Phase 2 — Extract shared AccountForm (refactor, no behavior change)
4. New `src/components/AccountForm/` owning NameField + AvatarPicker + submit.
   Props: `titleIcon`, `title`, `submitLabel`, `initialName`, `initialAvatarId`,
   `onSubmit({ name, avatarId })`, `onCancel`. Internal state seeded from the
   `initial*` props; `canSubmit = name.trim() !== '' && avatarId !== null`.
   `titleIcon` renders next to the title so create vs. edit reads at a glance.
   Move `NameField` from `CreateAccount/` into `AccountForm/`.
5. Rewrite `CreateAccount` as `AccountForm` + `useCreateAccount`. Create flow
   behaves identically (icon: white "+", title "צור חשבון", submit
   "✓ יצירת חשבון", empty initials). Existing CreateAccount tests must stay
   green.

### Phase 3 — EditAccount component + hook
6. `use-update-account.ts` — `PUT /api/accounts/[id]` with `{ name, avatarId }`,
   returns `Promise<Account>`.
7. `EditAccount` — wraps `AccountForm` with the selected account's current
   name + avatar as initials (form opens pre-filled — name typed in, that
   avatar already selected), icon ✏️, title "עריכת חשבון", submit
   "✓ שמירת שינויים", `onSubmit` → `useUpdateAccount`, `onUpdated`/`onCancel`
   callbacks.

### Phase 4 — Wire the mode end to end
8. Add `editingAccount` to `APP_MODE`.
9. `EditAccountChip`: `onClick` closes the menu (`onAccountSelect`, like
   `AddAccountChip`) and `setMode(APP_MODE.editingAccount)`.
10. `Home.tsx`: when `mode === editingAccount`, render `EditAccount` for the
    selected account in the same modal overlay create uses. On save, refresh the
    account in `useAccounts` (so the new name/avatar shows) and reset mode to
    `viewing`; on cancel, reset mode.

## Tests (after each phase's production code is committed)
- Phase 1: `updateAccount` in json-file-store (updates fields, returns
  `undefined` for unknown id, doesn't clobber other accounts/wallets);
  `AccountsStore.updateAccount`; PUT route (200 happy path, 404 unknown id,
  400/validation on empty body).
- Phase 2: `AccountForm` (renders title/label, seeds initials, submit disabled
  until valid, calls `onSubmit` with name+avatarId, `onCancel`). CreateAccount
  tests unchanged and green.
- Phase 3: `useUpdateAccount` (hits PUT, returns account); `EditAccount`
  (pre-fills from account, submit calls update with edited values).
- Phase 4: `EditAccountChip` sets edit mode + closes menu; `Home` renders
  EditAccount in edit mode and refreshes on save.

## Open question for review
- After save, what's the cheapest refresh path in `useAccounts` — does it expose
  a refetch, or do we update the account in place? (Resolve when wiring Phase 4.)

## Out of scope
Deleting accounts; editing theme/wallets/interest; multi-account bulk edit.
