import { describe, it, expect, vi } from 'vitest';
import { ForEach, LazyLoad, VirtualScroll, DivElement, SpanElement } from '../src';
import { render } from './utils';

/** Flush the microtask queue before asserting on async side-effects. */
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

  it('of getter returns an array type', () => {
    const fe = new ForEach({});
    expect(Array.isArray(fe.of)).toBe(true);
  });

  it('renders into the DOM via render()', () => {
    const fe = render(new ForEach({}));
    expect(document.body.contains(fe)).toBe(true);
  });
});

describe('ForEach – apply() with an empty content template', () => {
  // ForEach.#content is captured from innerHTML at construction time.
  // With programmatic construction the template is always empty, so
  // loop() produces no children — apply() contract is still testable.

  it('apply() does not throw when called with a CSV string', () => {
    const fe = render(new ForEach({}));
    expect(() => fe.apply(fe as any, 'a,b,c')).not.toThrow();
  });

  it('apply() does not throw when called with an empty string', () => {
    const fe = render(new ForEach({}));
    expect(() => fe.apply(fe as any, '')).not.toThrow();
  });

  it('apply() clears innerHTML on each call', () => {
    const fe = render(new ForEach({}));
    fe.innerHTML = '<span>stale</span>';
    fe.apply(fe as any, 'a,b');
    expect(fe.innerHTML).toBe('');
  });

  it('apply() does not throw on this.of access', () => {
    const fe = render(new ForEach({}));
    fe.setAttribute('of', 'x,y');
    expect(() => fe.apply(fe as any, fe.getAttribute('of') ?? '')).not.toThrow();
  });
});

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
  // Spy on Component.lazyLoad before construction to capture the call made
  // when the element's "onConnected" event fires after render().
  it('calls Component.lazyLoad once when rendered and a loader is provided', async () => {
    const { Component } = await import('../src/global/index');
    const lazyLoadSpy = vi.spyOn(Component, 'lazyLoad').mockImplementation(async () => {});

    try {
      const loader = async () => new DivElement({ text: 'async content' });
      const ll = render(new LazyLoad({ loader, loaderProps: { x: 1 } }));
      ll.dispatchEvent(new Event('onConnected'));
      await flushPromises();

      expect(lazyLoadSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
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
  // With scrollTop=0 and clientHeight=0 the visible window collapses to
  // [0, buffer).  These tests assert that deterministic contract.

  it('renders exactly buffer items when items.length >= buffer (default buffer=5)', () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    const vs = render(
      new VirtualScroll({
        items,
        renderItem: (item) => new DivElement({ text: String(item) }),
      })
    );
    vs.dispatchEvent(new Event('onConnected'));
    expect(vs.innerContainer.childElementCount).toBe(5);
  });

  it('renders all items when items.length < buffer', () => {
    const items = [10, 20];
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
    callCount = 0; // reset after construction pass
    vs.dispatchEvent(new Event('onConnected'));
    expect(callCount).toBe(5); // default buffer=5
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

// Scroll-position-dependent windowing requires a real layout engine.
// scrollTop and clientHeight are always 0 in happy-dom.
// Implement as a Playwright E2E test: mount with 1000 items, set scrollTop,
// assert the rendered window shifts accordingly.
describe.skip('VirtualScroll – scroll-position windowing (layout engine required)', () => {
  it('renders items centered around scroll position', () => {
    // Placeholder — implement as E2E test
  });
});