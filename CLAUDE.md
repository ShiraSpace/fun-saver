@AGENTS.md

## Skill Usage

Before invoking any superpowers skill, ask the user for approval first. Do not auto-trigger skills.

# CLAUDE.md

This file provides **critical workflow and coding guidelines** for Claude Code when working in this repository.

For technical details (commands, architecture, dependencies), see [DEVELOPMENT.md](./DEVELOPMENT.md).

---

# ⚠️ CRITICAL WORKFLOW - MUST FOLLOW EVERY TIME

**BLOCKING REQUIREMENT**: You MUST wait for **explicit user approval** at each checkpoint below.

## Stop Signals - When to WAIT

**STOP immediately if you see:**
- ❌ No explicit approval words from user
- ❌ User asks questions (they're reviewing, not approving)
- ❌ User opens files in IDE (they're reviewing)
- ❌ Silence after you show work (wait for feedback)
- ❌ User says "wait", "hold on", "not yet"

**ONLY proceed when you see explicit approval:**
- ✅ "approved" / "looks good" / "proceed" / "commit" / "yes" / "continue" / "go ahead" / "next"
- ✅ "let's commit" / "ready to commit" / "commit it"
- ✅ "move on" / "next step" / "next test"

## Workflow Checkpoints (MANDATORY)

### Phase 0: Branch Setup (MANDATORY before any new feature)
0a. Run `git status` and `git branch --show-current` in the target repo BEFORE planning
0b. **Default**: new features start from a fresh branch off updated master:
- `git fetch origin`
- `git checkout -b <feature-branch> origin/master` (use `origin/main` if the repo's default is `main`)
  0c. If uncommitted changes exist from prior work:
- **STOP** and ask user how to handle (stash, move to new branch, discard)
- Do NOT auto-stash, auto-commit, or auto-discard
  0d. Skip Phase 0 ONLY if user explicitly says "stay on this branch", "continue current branch", or names a specific existing branch

### Phase 1: Planning
1. Create a plan for every new non-trivial feature
2. **STOP** - Wait for user to review plan phase by phase
3. **STOP** - Wait for explicit approval of the plan
4. Exit plan mode, copy plan to `.plans/` directory

### Phase 2: Implementation (Per Phase/Step)
5. Outline the specific phase/step plan
6. **STOP** - Wait for user approval to start implementation
7. Implement production code only (no tests yet)
8. **STOP** - Wait for user review and refactoring feedback
9. **STOP** - Wait for explicit approval: "commit" or "approved to commit"
10. Commit the production code

### Phase 3: Testing (Per Phase/Step)
11. Write the FIRST test case only
12. Run the test, make it pass
13. **STOP** - Wait for user approval of first test
14. Refactor if needed after approval
15. **STOP** - Wait for approval to move to next test
16. Write next test case (one at a time)
17. Run test, make it pass
18. **STOP** - Wait for approval
19. Repeat steps 16-18 for each remaining test case
20. **STOP** - Wait for approval: "commit tests"
21. Commit all tests
22. **STOP** - Wait for approval: "push" or "next phase"

### Phase 4: Continue
23. Push to remote only if user explicitly requests
24. **STOP** - Wait for approval before moving to next phase/step
25. Go back to step 5 for next phase/step

## Key Workflow Rules

- **NEVER** commit without explicit "commit" approval
- **NEVER** write tests before production code is approved and committed
- **NEVER** write multiple tests at once - one test at a time
- **NEVER** move to next phase without explicit approval
- **NEVER** push to remote unless explicitly requested
- **NEVER** start a new feature on top of an unrelated branch — Phase 0 is mandatory
- **ALWAYS** start new features from a fresh branch off updated master, unless user explicitly says otherwise
- **ALWAYS** stop and wait after showing work
---

## Code Style Guidelines

### Mandatory Code Standards

1. **Quotes**: Use single quotes throughout
2. **Exports**: Use named exports ONLY (no default exports)
3. **Return Types**: Add explicit return types to ALL functions
4. **Component Composition**: Extract to small, focused components when needed
5. **ESLint Rules**: Never modify ESLint configuration to suppress warnings or errors — always fix the code itself
6. Files should not pass 200 lines, if it does trigger a question what to do to refactor it.
7. Hard coded values should be a dedicated constant file.
8. **No comments**: Never add comments. Code must explain itself through clear naming and structure. If a comment seems necessary, refactor the code to make it unnecessary instead.
9. **File naming**: Server, logic, and test files (`src/lib`, `src/db`, `src/hooks`, `src/i18n`, API routes, everything under `e2e/`, and `*.test.ts`) use kebab-case (`memory-store.ts`, `daily-rate.ts`, `create-account.e2e.ts`). React components and their co-located test files use PascalCase (`WalletHero.tsx`, `WalletHero.test.tsx`).

### TypeScript

- All functions must have explicit return types (`JSX.Element`, `void`, `number`, etc.)
- Use strict mode
- Prefer interfaces for props and types

### Testing

- Each component has a dedicated test file
- Use `data-testid` for element selection in tests
- Store test IDs and content in constants file
- Place `render()` in `beforeEach` block
- Use `getByTestId` for element queries
- Mock dependencies appropriately
- Use centralized mocks in `__mocks__/` directory for shared module mocks (e.g., `__mocks__/next/image.tsx`) — do not
  duplicate `jest.mock()` calls across test files

### Code Formatting

- **Prettier** is configured for automatic code formatting
- Configuration (`.prettierrc`):
    - Single quotes for strings (`singleQuote: true`)
    - Semicolons required (`semi: true`)
    - Tab width: 2 spaces
    - Print width: 100 characters
    - Trailing commas: ES5 style
    - Arrow function parentheses: always
- Integrated with ESLint via `eslint-plugin-prettier`
- Formatting happens automatically when running `npm run lint`
- ESLint will both check and fix code style and formatting issues

## Architecture

### Framework & Routing

- **Next.js 16 App Router** — all routes live under `src/app/`
- **`src/app/page.tsx`** — main UI shell, mark `"use client"` if it uses state or events
- **`src/app/api/`** — one folder per API endpoint (e.g. `src/app/api/search/route.ts`)
- **`src/components/`** — shared UI components; add `"use client"` to any that use state/events. Each component lives in
  its own folder:

```
src/components/
  MyComponent/
    MyComponent.tsx       ← component implementation
    MyComponent.test.tsx  ← dedicated test file
    constants.ts          ← test IDs, string literals, and other constants for this component
    index.ts              ← named re-export only
```

- **`src/hooks/`** — shared custom React hooks (React-specific, not framework-agnostic). If a hook is only used by one
  component, co-locate it inside that component's folder instead. Only move to `src/hooks/` when reused across two or
  more places.
- **`src/lib/`** — all business logic, framework-agnostic; this is what gets unit-tested
- **`src/db/`** — persistence layer (DB file, storage module, etc.)

### Key Rule: Keep API Routes Thin

API routes should only: validate input → call a `src/lib` function → return JSON. No business logic in route handlers.

```ts
// src/app/api/search/route.ts
import {searchMovies} from '@/lib/movies';

export async function GET(req: Request): Promise<Response> {
    const {searchParams} = new URL(req.url);
    const query = searchParams.get('q') ?? '';
    const results = await searchMovies(query);
    return Response.json(results);
}
```

---

## Interview Context

### Before Writing Any Code

1. Read the brief in full
2. If anything is ambiguous, state your assumption in the README under "Assumptions" — do not silently guess
3. Write a short plan to `.plans/building-app-plan.md` listing features in order of priority
4. Confirm the plan covers every required feature before touching code

### Step-by-Step Workflow (one feature at a time)

1. Write a Jest test for the core logic in `src/lib/__tests__/`
2. Run `npm test` — confirm it **fails**
3. Implement minimal code in `src/lib/` to make it pass
4. Run `npm test` — confirm it **passes**
5. Write the thin API route in `src/app/api/`
6. Wire up the UI component + tests
7. Verify all tests pass
8. Simultaneously: trigger code-review skill + Ask user to verify in the browser
9. Update readme and the plan.mp files with the progress
10. Commit and push: `git commit -m "[FEAT]: [feature name]"`

### Code Quality Checklist (before submitting)

- [ ] Errors surface to the user — nothing swallowed silently
- [ ] Loading states shown while data is fetching
- [ ] README has working setup instructions a stranger can follow
- [ ] No .gitkeep files, delete unused files.
- [ ] `npm run dev` works on a fresh clone
- [ ] If the brief requires API keys: stored in `.env.local` (never committed), `.env.example` has key names with empty
  values

### Next.js 16 Pitfalls

**1. Missing `"use client"`** — any component using `useState`, `useEffect`, `onClick`, or browser APIs needs
`"use client"` at the top. Without it you get a cryptic runtime error.

**2. Importing a Server Component into a Client Component** — breaks at runtime. Pass server content as `children`
instead.

**3. Fetch caching** — Next.js may cache `fetch()` calls. For calls that must be fresh:

```ts
fetch(url, {cache: 'no-store'});
```

### What should be kept

| Dimension        | What to check for                                                                                 |
|------------------|---------------------------------------------------------------------------------------------------|
| **It works**     | All features run on a fresh clone; error states handled                                           |
| **Architecture** | Clear FE / API / lib separation; intentional choices                                              |
| **Code quality** | Keeping each method concise, clear, readable, doing one thing, aligns with clean code guidelines. |
