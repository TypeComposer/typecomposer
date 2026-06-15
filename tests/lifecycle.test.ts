import { describe, it, expect, vi } from 'vitest';
import { render } from './utils';
import { DivElement, SpanElement, ButtonElement, ref } from '../src';

import { refList, RefList } from '../src/core/ref/RefList';

// ─── DOM cleanup ─────────────────────────────────────────────────────────────

describe('Component cleanup – DOM removal', () => {
  it('removing a component from the DOM leaves no orphaned nodes', () => {
    const div = render(new DivElement());
    expect(document.body.contains(div)).toBe(true);
    div.remove();
    expect(document.body.contains(div)).toBe(false);
  });

  it('removing a parent also removes its children', () => {
    const parent = render(new DivElement());
    const child = parent.appendChild(new SpanElement());
    expect(document.body.contains(child)).toBe(true);
    parent.remove();
    expect(document.body.contains(child)).toBe(false);
  });

  it('re-appending a removed node restores DOM presence', () => {
    const div = render(new DivElement());
    div.remove();
    document.body.appendChild(div);
    expect(document.body.contains(div)).toBe(true);
    div.remove();
  });
});

// ─── Re-render (swap) ────────────────────────────────────────────────────────

describe('Re-render – swap components in the tree', () => {
  it('replaces one child with another inside a container', () => {
    const container = render(new DivElement());
    const first = container.appendChild(new SpanElement());
    first.textContent = 'first';
    expect(container.children.length).toBe(1);

    container.removeChild(first);
    const second = container.appendChild(new SpanElement());
    second.textContent = 'second';

    expect(container.children.length).toBe(1);
    expect(container.children[0]).toBe(second);
    expect(container.children[0].textContent).toBe('second');
  });

  it('appending multiple swaps works correctly', () => {
    const container = render(new DivElement());
    for (let i = 0; i < 5; i++) {
      while (container.firstChild) container.removeChild(container.firstChild);
      const span = container.appendChild(new SpanElement());
      span.textContent = `item-${i}`;
    }
    expect(container.children.length).toBe(1);
    expect(container.children[0].textContent).toBe('item-4');
  });
});

// ─── Reactive ref → DOM update ────────────────────────────────────────────────

describe('Reactive DOM updates – ref to DOM binding', () => {
  it('subscribing a rendered element property to a ref reflects initial value', () => {
    const label = ref('Hello');
    const span = render(new SpanElement());
    label.subscribe((v) => { span.textContent = v; });
    expect(span.textContent).toBe('Hello');
  });

  it('updating a ref propagates to the bound DOM element', () => {
    const label = ref('initial');
    const span = render(new SpanElement());
    label.subscribe((v) => { span.textContent = v; });
    label.value = 'updated';
    expect(span.textContent).toBe('updated');
  });

  it('multiple ref changes all propagate', () => {
    const counter = ref(0);
    const div = render(new DivElement());
    counter.subscribe((v) => { div.textContent = String(v); });
    counter.value = 1;
    counter.value = 2;
    counter.value = 3;
    expect(div.textContent).toBe('3');
  });

  it('unsubscribing stops DOM updates', () => {
    const r = ref('a');
    const span = render(new SpanElement());
    const handler = (v: string) => { span.textContent = v; };
    r.subscribe(handler);
    r.unsubscribe(handler);
    r.value = 'b';
    expect(span.textContent).toBe('a');
  });

  it('boolean ref controls visibility-like attribute', () => {
    const visible = ref(true);
    const div = render(new DivElement());
    visible.subscribe((v) => {
      div.style.display = v ? 'block' : 'none';
    });
    expect(div.style.display).toBe('block');
    visible.value = false;
    expect(div.style.display).toBe('none');
  });
});

// ─── RefList driving DOM children ─────────────────────────────────────────────

describe('RefList → DOM children (syncComponentWithList)', () => {
  it('initial list populates container children', () => {
    const items = refList([1, 2, 3]);
    const container = render(new DivElement());
    const spans: HTMLElement[] = items.map((v) => {
      const s = document.createElement('span');
      s.textContent = String(v);
      return s;
    });
    RefList.syncComponentWithList(spans, container);
    expect(container.children.length).toBe(3);
  });

  it('pushing to RefList and re-syncing adds a new child', () => {
    const items = refList<number>([]);
    const container = render(new DivElement());
    const makeSpan = (v: number) => {
      const s = document.createElement('span');
      s.textContent = String(v);
      return s;
    };
    const spanMap = new Map<number, HTMLElement>();
    [1, 2].forEach((v) => spanMap.set(v, makeSpan(v)));
    items.push(1, 2);
    RefList.syncComponentWithList(Array.from(spanMap.values()), container);
    expect(container.children.length).toBe(2);

    spanMap.set(3, makeSpan(3));
    items.push(3);
    RefList.syncComponentWithList(Array.from(spanMap.values()), container);
    expect(container.children.length).toBe(3);
  });

  it('removing from list and re-syncing removes the child', () => {
    const a = document.createElement('span');
    const b = document.createElement('span');
    const c = document.createElement('span');
    const container = render(new DivElement());
    RefList.syncComponentWithList([a, b, c], container);
    expect(container.children.length).toBe(3);

    RefList.syncComponentWithList([a, c], container);
    expect(container.children.length).toBe(2);
    expect(container.children[0]).toBe(a);
    expect(container.children[1]).toBe(c);
  });

  it('clearing the list empties the container via sync', () => {
    const spans = [1, 2, 3].map((v) => {
      const s = document.createElement('span');
      s.textContent = String(v);
      return s;
    });
    const container = render(new DivElement());
    RefList.syncComponentWithList(spans, container);
    RefList.syncComponentWithList([], container);
    expect(container.children.length).toBe(0);
  });
});

// ─── Multi-subscriber fan-out ─────────────────────────────────────────────────

describe('Multi-subscriber fan-out', () => {
  it('multiple subscribers on the same ref all receive updates', () => {
    const r = ref(0);
    const received: number[][] = [[], []];
    r.subscribe((v) => received[0].push(v));
    r.subscribe((v) => received[1].push(v));
    r.value = 10;
    expect(received[0]).toContain(10);
    expect(received[1]).toContain(10);
  });

  it('unsubscribing one does not affect the other', () => {
    const r = ref('start');
    const a: string[] = [];
    const b: string[] = [];
    const handlerA = (v: string) => a.push(v);
    const handlerB = (v: string) => b.push(v);
    r.subscribe(handlerA);
    r.subscribe(handlerB);
    r.unsubscribe(handlerA);
    r.value = 'end';
    expect(a).not.toContain('end');
    expect(b).toContain('end');
  });
});

// ─── Component child management ───────────────────────────────────────────────

describe('Component child management', () => {
  it('appended children are accessible via DOM traversal', () => {
    const parent = render(new DivElement());
    const c1 = parent.appendChild(new SpanElement());
    const c2 = parent.appendChild(new SpanElement());
    const c3 = parent.appendChild(new ButtonElement());
    expect(parent.children.length).toBe(3);
    expect(parent.children[2]).toBe(c3);
  });

  it('innerHTML cleared removes all children', () => {
    const parent = render(new DivElement());
    parent.appendChild(new SpanElement());
    parent.appendChild(new SpanElement());
    parent.innerHTML = '';
    expect(parent.children.length).toBe(0);
  });

  it('deeply nested children are in the DOM', () => {
    const grandparent = render(new DivElement());
    const parent = grandparent.appendChild(new DivElement());
    const child = parent.appendChild(new SpanElement());
    expect(document.body.contains(child)).toBe(true);
  });

  it('querySelectorAll finds all appended spans', () => {
    const container = render(new DivElement());
    for (let i = 0; i < 4; i++) {
      const s = document.createElement('span');
      s.textContent = `s${i}`;
      container.appendChild(s);
    }
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(4);
  });
});