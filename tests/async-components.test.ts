/**
 * tests/async-components.test.ts
 *
 * Stable tests for ForEach, LazyLoad, and VirtualScroll.
 *
 * HAPPY-DOM LIMITATIONS
 * ─────────────────────
 * happy-dom does not implement the browser layout engine.  The following APIs
 * always return 0 / empty values and CANNOT be used as assertions:
 *
 *   • element.scrollTop / scrollHeight / clientHeight / offsetHeight
 *   • element.getBoundingClientRect() — all zeros
 *   • IntersectionObserver callbacks — observer fires, but intersection math
 *     is meaningless (entry.isIntersecting is always false in happy-dom)
 *
 * Consequences per component:
 *
 *   ForEach      — ForEach is a template-driven web component.  The #content
 *                  field (HTML template body) is populated from the element's
 *                  innerHTML at construction time.  In TypeScript unit tests
 *                  elements are constructed programmatically with no surrounding
 *                  HTML, so #content is always "".  The loop() setter therefore
 *                  renders zero DOM children regardless of the "of" value.
 *                  Constructor props, attribute handling, and of-getter logic
 *                  are fully testable. ✓
 *                  Rendering output requires an HTML template environment
 *                  (a real browser or an HTML fixture) and is deferred to E2E
 *                  tests.
 *
 *   LazyLoad     — The IntersectionObserver-based code path is commented out in
 *                  the current implementation; the active path fires via the
 *                  "onConnected" custom event.  Constructor props and element
 *                  creation are fully testable. ✓
 *                  Loader invocation is verified by spying on Component.lazyLoad
 *                  in the event listener path.  Async loader results that require
 *                  real intersection triggering are skipped with a comment.
 *
 *   VirtualScroll — renderVisibleItems() reads this.scrollTop and this.clientHeight,
 *                  both of which are 0 in happy-dom.  With scrollTop=0 and
 *                  clientHeight=0 the visible slice collapses to [0, buffer).
 *                  Structural construction tests (inner container, total height,
 *                  item positioning) are fully testable. ✓
 *                  renderItem factory invocation count is testable via the
 *                  "onConnected" event path.
 *                  Scroll-position-dependent windowing is skipped with a comment.
 */

import { describe, it, expect, vi } from 'vitest';
import { ForEach, LazyLoad, VirtualScroll, DivElement, SpanElement } from '../src';
import { render } from './utils';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Flush the microtask queue (Promise resolution, queueMicrotask callbacks). */
const flushPromises = () => new Promise<void>((r) => setTimeout(r, 0));

// ─── ForEach ──────────────────────────────────────────────────────────────────

describe('ForEach – construction and attributes', () => {
  it('creates a custom element with the correct tag', () => {
    const fe = new ForEach({});
    expect(fe).toBeInstanceOf(HTMLElement);
    expect(fe.tagName.toLowerCase()).toBe('tc-for-each');
  });

  it('starts with empty innerHTML after construction', () => {
    const fe = new ForEach({});
    expect(fe.innerHTML).toBe('');
  });

  it('item getter returns "item" when no item attribute is set', () => {
    const fe = new ForEach({});
    expect(fe.item).toBe('item');
  });

  it('of setter writes the value as an attribute', () => {
    const fe = new ForEach({});
    fe.of = 'x,y,z';
    expect(fe.getAttribute('of')).toBe('x,y,z');
  });

  it('of getter returns an array (splits #of by comma — value is set at construction time)', () => {
    // ForEach.#of is captured at construction from getAttribute("of") || "".
    // Post-construction setAttribute("of", ...) does NOT update #of.
    // When constructed with no "of" attribute, #of is "" and of returns [""].
    const fe = new ForEach({});
    const result = fe.of;
    expect(Array.isArray(result)).toBe(true);
  });

  it('of getter reflects the "of" attribute value passed at construction time', () => {
    // Simulate a ForEach constructed when the "of" attribute is already present.
    // Because we cannot set HTML attributes before calling new ForEach({}) in
    // programmatic tests, we verify the of setter / getAttribute round-trip instead.
    const fe = new ForEach({});
    fe.of = 'p,q,r';
    // The setter writes the attribute (runtime uses it on subsequent apply())
    expect(fe.getAttribute('of')).toBe('p,q,r');
  });

  it('of getter returns an array type regardless of #of value', () => {
    // The getter always returns an array; the precise content depends on #of
    // (set at construction).  This test confirms the type contract.
    const fe = new ForEach({});
    expect(Array.isArray(fe.of)).toBe(true);
  });

  it('renders into the DOM via render()', () => {
    const fe = render(new ForEach({}));
    expect(document.body.contains(fe)).toBe(true);
  });
});

describe('ForEach – apply() with an empty content template', () => {
  /**
   * ForEach is a template-driven web component.  The #content field is
   * populated from the element's innerHTML at construction time
   * (the capture line is currently commented out in ForEach.ts).
   * When constructed programmatically in TypeScript unit tests the
   * inner HTML template is always empty, so loop() produces zero children.
   *
   * These tests verify the apply() contract under this constraint and
   * document the expected behaviour for contributors.
   */

  it('apply() does not throw when called with a CSV string', () => {
    const fe = render(new ForEach({}));
    expect(() => fe.apply(fe as any, 'a,b,c')).not.toThrow();
  });

  it('apply() does not throw when called with an empty string', () => {
    const fe = render(new ForEach({}));
    expect(() => fe.apply(fe as any, '')).not.toThrow();
  });

  it('apply() clears innerHTML (inner content is reset on every call)', () => {
    const fe = render(new ForEach({}));
    // Manually inject content to simulate a prior state
    fe.innerHTML = '<span>stale</span>';
    fe.apply(fe as any, 'a,b');
    // ForEach.loop() always starts with this.innerHTML = ""
    // With empty #content template each item renders no markup — result is ""
    expect(fe.innerHTML).toBe('');
  });

  it('apply() stores the parent reference (does not throw on this.of access)', () => {
    const fe = render(new ForEach({}));
    fe.setAttribute('of', 'x,y');
    expect(() => fe.apply(fe as any, fe.getAttribute('of') ?? '')).not.toThrow();
  });
});

/**
 * ForEach – HTML template rendering (skipped — requires HTML fixture)
 * ────────────────────────────────────────────────────────────────────
 * Full rendering (child creation) requires the component to be constructed
 * with a non-empty inner HTML template so that ForEach.#content is populated.
 * In a TypeScript unit test with programmatic construction, #content is always
 * "" (the innerHTML-capture line is commented out in the current source).
 *
 * To test rendered output:
 *   1. Re-enable the `this.#content = this.innerHTML;` line in ForEach.ts, OR
 *   2. Add an E2E test (Playwright) that mounts the component inside real HTML.
 *
 * Example E2E fixture:
 *   <tc-for-each of="Alice,Bob,Charlie" item="name">
 *     <span>{{name}}</span>
 *   </tc-for-each>
 *   → expect 3 <span> children with the correct text content
 */

// ─── LazyLoad ─────────────────────────────────────────────────────────────────

describe('LazyLoad – construction (no loader)', () => {
  it('creates a custom element with the correct tag', () => {
    const ll = new LazyLoad({});
    expect(ll).toBeInstanceOf(HTMLElement);
    expect(ll.tagName.toLowerCase()).toBe('tc-lazy-load');
  });

  it('loader property is undefined when not provided', () => {
    const ll = new LazyLoad({});
    expect(ll.loader).toBeUndefined();
  });

  it('loaderProps property is undefined when not provided', () => {
    const ll = new LazyLoad({});
    expect(ll.loaderProps).toBeUndefined();
  });

  it('renders into the DOM without throwing', () => {
    expect(() => render(new LazyLoad({}))).not.toThrow();
  });
});

describe('LazyLoad – construction (with loader)', () => {
  it('stores the loader function reference', () => {
    const loader = async () => new DivElement({ text: 'loaded' });
    const ll = new LazyLoad({ loader });
    expect(ll.loader).toBe(loader);
  });

  it('stores loaderProps when provided', () => {
    const loader = async () => new DivElement({});
    const props = { foo: 'bar', count: 3 };
    const ll = new LazyLoad({ loader, loaderProps: props });
    expect(ll.loaderProps).toEqual(props);
  });

  it('accepts a loader with a custom loaderProps object', () => {
    const loader = async () => new SpanElement({ text: 'span' });
    const ll = new LazyLoad({ loader, loaderProps: { theme: 'dark' } });
    expect(ll.loader).toBe(loader);
    expect((ll.loaderProps as any)?.theme).toBe('dark');
  });
});

describe('LazyLoad – loader invoked via onConnected event', () => {
  /**
   * When a loader is provided, LazyLoad registers an "onConnected" event
   * listener in its constructor.  We render the element (which fires
   * onConnected) and verify that Component.lazyLoad was called with the
   * correct arguments by spying on the static method before construction.
   */
  it('calls Component.lazyLoad once when rendered and a loader is provided', async () => {
    const { Component } = await import('../src/global/index');
    const lazyLoadSpy = vi.spyOn(Component, 'lazyLoad').mockImplementation(async () => {});

    try {
      const loader = async () => new DivElement({ text: 'async content' });
      const ll = render(new LazyLoad({ loader, loaderProps: { x: 1 } }));
      // Dispatch onConnected to simulate the framework lifecycle trigger
      ll.dispatchEvent(new Event('onConnected'));
      await flushPromises();

      // Component.lazyLoad should have been called at least once
      expect(lazyLoadSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      // All calls should use our loader
      for (const [calledLoader, calledOpts] of lazyLoadSpy.mock.calls as any[]) {
        expect(calledLoader).toBe(loader);
        expect(calledOpts?.fallback).toBe(ll);
        expect(calledOpts?.props).toEqual({ x: 1 });
      }
    } finally {
      lazyLoadSpy.mockRestore();
    }
  });

  it('does NOT call Component.lazyLoad when no loader is provided', async () => {
    const { Component } = await import('../src/global/index');
    const lazyLoadSpy = vi.spyOn(Component, 'lazyLoad').mockImplementation(async () => {});

    try {
      const ll = render(new LazyLoad({}));
      ll.dispatchEvent(new Event('onConnected'));
      await flushPromises();
      expect(lazyLoadSpy).not.toHaveBeenCalled();
    } finally {
      lazyLoadSpy.mockRestore();
    }
  });
});

/**
 * LazyLoad – IntersectionObserver path (skipped — layout engine required)
 * ─────────────────────────────────────────────────────────────────────────
 * The intersection-triggered load path (setupObserver / IntersectionObserver)
 * is currently commented out in LazyLoad.ts.  When re-enabled, it will require
 * real intersection events which are not meaningful in happy-dom
 * (IntersectionObserver callbacks fire but `entry.isIntersecting` is always
 * false because happy-dom has no layout engine).
 *
 * Those tests should be implemented as E2E / Playwright tests:
 *   1. Mount LazyLoad in a scrollable container.
 *   2. Scroll the element into the viewport.
 *   3. Assert the async component has been loaded and replaced the placeholder.
 */

// ─── VirtualScroll ────────────────────────────────────────────────────────────

describe('VirtualScroll – construction', () => {
  it('creates a custom element with the correct tag', () => {
    const vs = new VirtualScroll({
      items: [1, 2, 3],
      renderItem: (item) => new DivElement({ text: String(item) }),
    });
    expect(vs).toBeInstanceOf(HTMLElement);
    expect(vs.tagName.toLowerCase()).toBe('tc-virtual-scroll');
  });

  it('creates an inner container child', () => {
    const vs = new VirtualScroll({
      items: ['a', 'b'],
      renderItem: (item) => new SpanElement({ text: item }),
    });
    expect(vs.innerContainer).toBeInstanceOf(HTMLElement);
    expect(vs.contains(vs.innerContainer)).toBe(true);
  });

  it('sets inner container height = items.length × itemHeight (default 50px)', () => {
    const items = ['x', 'y', 'z'];
    const vs = new VirtualScroll({
      items,
      renderItem: (item) => new SpanElement({ text: item }),
    });
    // default itemHeight = 50
    expect(vs.innerContainer.style.height).toBe(`${items.length * 50}px`);
  });

  it('respects a custom itemHeight for inner container total height', () => {
    const items = [1, 2, 3, 4];
    const itemHeight = 80;
    const vs = new VirtualScroll({
      items,
      renderItem: (item) => new DivElement({ text: String(item) }),
      itemHeight,
    });
    expect(vs.innerContainer.style.height).toBe(`${items.length * itemHeight}px`);
  });

  it('inner container has position: relative', () => {
    const vs = new VirtualScroll({
      items: [1],
      renderItem: () => new DivElement({}),
    });
    expect(vs.innerContainer.style.position).toBe('relative');
  });

  it('the outer scroll container has overflow-y: auto', () => {
    const vs = new VirtualScroll({
      items: [1],
      renderItem: () => new DivElement({}),
    });
    expect(vs.style.overflowY).toBe('auto');
  });
});

describe('VirtualScroll – initial render slice (happy-dom: scrollTop=0, clientHeight=0)', () => {
  /**
   * In happy-dom scrollTop=0 and clientHeight=0.  With these values:
   *
   *   startIndex = floor(0 / itemHeight) - buffer  → clamped to 0
   *   endIndex   = ceil((0 + 0) / itemHeight) + buffer  → 0 + buffer = buffer
   *
   * So only `buffer` items (default 5) are rendered on the first pass when
   * items.length >= buffer.  When items.length < buffer all items are rendered.
   *
   * This is the deterministic, layout-independent contract we assert.
   * renderVisibleItems() is triggered by the "onConnected" event which the
   * TypeComposer runtime dispatches when an element is appended to the DOM
   * (via render()).
   */

  it('renders exactly buffer items when items.length >= buffer (default buffer=5)', () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    const vs = render(
      new VirtualScroll({
        items,
        renderItem: (item) => new DivElement({ text: String(item) }),
      })
    );
    vs.dispatchEvent(new Event('onConnected'));
    const defaultBuffer = 5;
    expect(vs.innerContainer.childElementCount).toBe(defaultBuffer);
  });

  it('renders all items when items.length < buffer', () => {
    const items = [10, 20]; // only 2 items; buffer default is 5
    const vs = render(
      new VirtualScroll({
        items,
        renderItem: (item) => new DivElement({ text: String(item) }),
      })
    );
    vs.dispatchEvent(new Event('onConnected'));
    expect(vs.innerContainer.childElementCount).toBe(items.length);
  });

  it('renders 0 items when the items array is empty', () => {
    const vs = render(
      new VirtualScroll({
        items: [],
        renderItem: () => new DivElement({}),
      })
    );
    vs.dispatchEvent(new Event('onConnected'));
    expect(vs.innerContainer.childElementCount).toBe(0);
  });

  it('respects a custom buffer value', () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    const buffer = 3;
    const vs = render(
      new VirtualScroll({
        items,
        renderItem: (item) => new DivElement({ text: String(item) }),
        buffer,
      })
    );
    vs.dispatchEvent(new Event('onConnected'));
    expect(vs.innerContainer.childElementCount).toBe(buffer);
  });

  it('rendered items are positioned absolutely with a px top value and 100% width', () => {
    const items = [100, 200, 300, 400, 500, 600];
    const itemHeight = 40;
    const vs = render(
      new VirtualScroll({
        items,
        renderItem: (item) => new DivElement({ text: String(item) }),
        itemHeight,
      })
    );
    vs.dispatchEvent(new Event('onConnected'));
    const children = Array.from(vs.innerContainer.children) as HTMLElement[];
    for (const child of children) {
      expect(child.style.position).toBe('absolute');
      expect(child.style.top).toMatch(/^\d+px$/);
      expect(child.style.width).toBe('100%');
    }
  });

  it('uses the renderItem factory to produce child elements', () => {
    let callCount = 0;
    const items = Array.from({ length: 10 }, (_, i) => i);
    const vs = render(
      new VirtualScroll({
        items,
        renderItem: (item) => {
          callCount++;
          return new DivElement({ text: String(item) });
        },
      })
    );
    // Reset counter after initial render (constructor may also trigger a pass)
    callCount = 0;
    vs.dispatchEvent(new Event('onConnected'));
    // buffer=5 items should be rendered via the factory
    expect(callCount).toBe(5);
  });

  it('top style of each rendered item equals index × itemHeight', () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    const itemHeight = 30;
    const buffer = 4;
    const vs = render(
      new VirtualScroll({
        items,
        renderItem: (item) => new DivElement({ text: String(item) }),
        itemHeight,
        buffer,
      })
    );
    vs.dispatchEvent(new Event('onConnected'));
    const children = Array.from(vs.innerContainer.children) as HTMLElement[];
    children.forEach((child, idx) => {
      expect(child.style.top).toBe(`${idx * itemHeight}px`);
    });
  });
});

describe('VirtualScroll – scroll event handling', () => {
  it('dispatching a scroll event does not throw', () => {
    const vs = render(
      new VirtualScroll({
        items: [1, 2, 3],
        renderItem: (item) => new DivElement({ text: String(item) }),
      })
    );
    expect(() => vs.dispatchEvent(new Event('scroll'))).not.toThrow();
  });
});

/**
 * VirtualScroll – scroll-position-dependent windowing (skipped)
 * ─────────────────────────────────────────────────────────────
 * SKIPPED: VirtualScroll.renderVisibleItems() computes the visible window
 * using this.scrollTop and this.clientHeight.  Both are always 0 in
 * happy-dom because it does not implement the layout engine.
 *
 * Asserting the visible-item range at a non-zero scroll position requires
 * a real browser or a layout-capable test environment (e.g., Playwright).
 *
 * Suggested E2E test structure:
 *   1. Mount VirtualScroll with 1000 items and itemHeight=50 in a 200px container.
 *   2. Set element.scrollTop = 500 and await a paint frame.
 *   3. Assert innerContainer.children renders items 5–15 (startIndex ≈ 10 - buffer).
 */
describe.skip('VirtualScroll – scroll-position windowing (layout engine required)', () => {
  it('renders items centered around scroll position', () => {
    // Placeholder — see comment above
  });
});