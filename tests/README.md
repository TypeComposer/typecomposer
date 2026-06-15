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

`npm run test:run` is the command used in CI and for a final local check before
opening a PR.  Use `npm run test` during development for instant feedback.

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
- Registers the element for **automatic cleanup** after each test — no manual
  teardown is needed in individual tests.
- Returns the same component reference so it can be chained inline.

### Cleanup Behaviour

`utils.ts` registers an `afterEach` hook that:
1. Removes every element that was passed to `render()` from the DOM.
2. Clears the internal mount registry.
3. Sets `document.body.innerHTML = ''` as a final reset.

This means each test starts with a clean DOM without any explicit `beforeEach`
setup in the test file itself.

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

`setup.ts` is loaded by Vitest before every test file (configured in
`vitest.config.ts` → `setupFiles`). It:

1. **Provides a `MemoryStorage` polyfill** for `localStorage` and
   `sessionStorage` — happy-dom does not implement the Storage API, so this
   shim makes storage-dependent code work in tests.
2. **Clears both stores in a `beforeEach` hook**, so each test starts with
   empty storage regardless of what a previous test wrote.

You do not need to import `setup.ts` manually; Vitest loads it automatically.

---

## Recommended Assertion Patterns

### DOM Structure

```ts
// Presence in document
expect(document.body.contains(el)).toBe(true);

// Instance type
expect(el).toBeInstanceOf(window.HTMLDivElement);

// Text content
expect(el.textContent).toBe('Hello');

// Child count
expect(el.childElementCount).toBe(2);

// Specific child
expect(el.children[0].textContent).toBe('first');

// Containment
expect(container.contains(child)).toBe(true);
```

### Styles

```ts
// Always use computed / inline-style values, not shorthand strings
expect(el.style.color).toBe('rgb(255, 0, 0)');   // ✓
expect(el.style.color).toBe('red');               // ✗ — may fail in happy-dom
```

### Reactivity

```ts
// subscribe() fires immediately; listen() fires only on future changes
const calls: number[] = [];
myRef.subscribe((v) => calls.push(v));   // calls.length === 1 now
myRef.value = 42;                        // calls.length === 2
```

### Async / Microtask flush

When testing code that defers work via `Promise.resolve()` or
`queueMicrotask()`, flush the microtask queue before asserting:

```ts
import { flushPromises } from './utils'; // see below
await flushPromises();
expect(el.textContent).toBe('loaded');
```

`flushPromises` is a simple helper: `() => new Promise(r => setTimeout(r, 0))`.

### Avoiding Brittle Layout / Timing Assumptions

happy-dom does **not** implement the layout engine.  The following properties
always return `0` or empty values:

- `element.offsetWidth / offsetHeight`
- `element.clientWidth / clientHeight`
- `element.getBoundingClientRect()` (returns all zeros)
- `element.scrollTop / scrollHeight`
- `IntersectionObserver` callbacks (observer fires but viewport math is meaningless)

**Do not write assertions that depend on these values.**  Instead, test the
logical / structural contract:

```ts
// ✓ Test that the right number of children were rendered
expect(container.childElementCount).toBe(items.length);

// ✓ Test attribute / style values that were set programmatically
expect(el.style.top).toBe('100px');

// ✗ Test that an element is "visible" via offsetHeight > 0  ← always 0 in happy-dom
```

---

## Configuration Reference

`vitest.config.ts`:

```ts
export default defineConfig({
  test: {
    environment: 'happy-dom',    // simulated browser DOM
    globals: true,               // describe/it/expect available globally
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
4. Run `npm run test:run` before opening a PR to confirm no regressions.
5. If a component is not testable under happy-dom (e.g., it requires real layout
   or `IntersectionObserver` intersection events), add a `describe.skip` block
   with a comment explaining the limitation.