# TypeComposer Test Suite

This directory contains the Vitest-based unit and integration tests for the
TypeComposer framework. Tests run against the TypeScript source directly (no
build step required) inside a **happy-dom** environment.

---

## Running Tests

| Command | Purpose |
|---|---|
| `npm run test` | Start Vitest in **watch mode** (interactive, re-runs on file change) |
| `npm run test:run` | Single **non-watch pass** — exits with code 0 on success, 1 on failure |

`npm run test:run` is the command used in CI and for a final local check before opening a PR.

---

## Test Structure

```
tests/
├── README.md                     ← this file
├── setup.ts                      ← global setup (MemoryStorage polyfill)
├── utils.ts                      ← render helper + afterEach cleanup
├── reactivity.test.ts            ← core ref / computed basics
├── reactivity-computed.test.ts   ← computed() and derived state
├── reactive-collections.test.ts  ← RefList, RefMap, RefObject, ref() factory
├── component.test.ts             ← DivElement, SpanElement rendering smoke tests
├── composition.test.ts           ← component nesting, HBox/VBox layout
├── lifecycle.test.ts             ← onConnected, onDisconnected, parent hooks
├── events.test.ts                ← DOM event binding and propagation
├── forms.test.ts                 ← CheckBox, TextField, SelectPanel, etc.
├── router.test.ts                ← Router.create, navigation, guards
└── async-components.test.ts      ← ForEach, LazyLoad, VirtualScroll stable tests
```

---

## `tests/utils.ts` — Render Helper

```ts
import { render } from './utils';
```

`render<T extends HTMLElement>(component: T): T`

- Appends the component to `document.body`.
- Registers the element for **automatic cleanup** after each test via an `afterEach` hook — no manual teardown needed.
- Returns the same component reference for inline chaining.

### Example

```ts
import { describe, it, expect } from 'vitest';
import { DivElement } from '../src';
import { render } from './utils';

describe('DivElement', () => {
  it('renders text content', () => {
    const el = render(new DivElement({ text: 'Hello' }));
    expect(el.textContent).toBe('Hello');
    expect(document.body.contains(el)).toBe(true);
    // No teardown needed — utils.ts handles it
  });
});
```

---

## `tests/setup.ts` — Global Setup

Loaded automatically by Vitest (`setupFiles` in `vitest.config.ts`). Provides a
`MemoryStorage` polyfill for `localStorage`/`sessionStorage` (not implemented in
happy-dom) and clears both stores in a `beforeEach` hook.

---

## Recommended Assertion Patterns

### DOM Structure

```ts
expect(document.body.contains(el)).toBe(true);
expect(el).toBeInstanceOf(window.HTMLDivElement);
expect(el.textContent).toBe('Hello');
expect(el.childElementCount).toBe(2);
expect(container.contains(child)).toBe(true);
```

### Styles

```ts
expect(el.style.color).toBe('rgb(255, 0, 0)'); // ✓ computed value
expect(el.style.color).toBe('red');             // ✗ may fail in happy-dom
```

### Reactivity

```ts
// subscribe() fires immediately; listen() fires only on future changes
const calls: number[] = [];
myRef.subscribe((v) => calls.push(v)); // calls.length === 1 now
myRef.value = 42;                      // calls.length === 2
```

### Async / Microtask flush

```ts
const flushPromises = () => new Promise(r => setTimeout(r, 0));
await flushPromises();
expect(el.textContent).toBe('loaded');
```

### happy-dom layout limitations

happy-dom has no layout engine. `offsetWidth`, `clientHeight`,
`getBoundingClientRect()`, and `scrollTop` always return `0`. Do not assert on
these values — test structural and programmatic contracts instead.

If a component requires real layout or `IntersectionObserver` intersection
events, add a `describe.skip` block with a comment pointing to E2E tests.

---

## Configuration Reference

`vitest.config.ts`:

```ts
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
  },
});
```

---

## Adding New Tests

1. Create `tests/<feature>.test.ts`.
2. Import framework exports from `'../src'`.
3. Use `render()` from `'./utils'` for any component that needs to be in the DOM.
4. Run `npm run test:run` before opening a PR.
5. Skip tests that require real layout or `IntersectionObserver` with `describe.skip` and a note pointing to E2E.