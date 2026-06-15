/**
 * tests/reactive-collections.test.ts
 *
 * Tests for reactive collection types:
 *   - RefList  (src/core/ref/RefList.ts)
 *   - RefMap   (src/core/ref/RefMap.ts)
 *   - RefObject (src/core/ref/RefObject.ts) via refObject()
 *
 * These are pure-JS reactive primitives — no DOM or component lifecycle
 * required, so no render() helper is needed.
 */

import { describe, it, expect, vi } from 'vitest';
import '../src'; // ensures TypeComposer global is registered
import { refList, RefList } from '../src/core/ref/RefList';
import { refMap, RefMap } from '../src/core/ref/RefMap';
import { refObject, ref } from '../src/core/ref/RefObject';

// ═══════════════════════════════════════════════════════════════════════════
// RefList
// ═══════════════════════════════════════════════════════════════════════════

describe('RefList – construction', () => {
  it('creates a RefList from an array', () => {
    const list = refList([1, 2, 3]);
    expect(list).toBeInstanceOf(RefList);
    expect(list.length).toBe(3);
  });

  it('has an id string', () => {
    const list = refList<number>([]);
    expect(typeof list.id).toBe('string');
    expect(list.id.length).toBeGreaterThan(0);
  });

  it('valueOf returns a plain Array copy', () => {
    const list = refList([10, 20]);
    const val = list.valueOf();
    expect(Array.isArray(val)).toBe(true);
    expect(val).toEqual([10, 20]);
  });

  it('value getter returns a copy of the array', () => {
    const list = refList(['a', 'b', 'c']);
    expect(list.value).toEqual(['a', 'b', 'c']);
  });

  it('Symbol.toStringTag is "refList"', () => {
    const list = refList<string>([]);
    expect(list[Symbol.toStringTag]).toBe('refList');
  });
});

describe('RefList – mutation methods', () => {
  it('push appends items and updates length', () => {
    const list = refList([1, 2]);
    list.push(3, 4);
    expect(list.length).toBe(4);
    expect(list.value).toEqual([1, 2, 3, 4]);
  });

  it('pop removes and returns the last item', () => {
    const list = refList([1, 2, 3]);
    const item = list.pop();
    expect(item).toBe(3);
    expect(list.length).toBe(2);
  });

  it('shift removes and returns the first item', () => {
    const list = refList([10, 20, 30]);
    const item = list.shift();
    expect(item).toBe(10);
    expect(list.value).toEqual([20, 30]);
  });

  it('unshift prepends items', () => {
    const list = refList([3, 4]);
    list.unshift(1, 2);
    expect(list.value).toEqual([1, 2, 3, 4]);
  });

  it('splice removes elements', () => {
    const list = refList([1, 2, 3, 4]);
    const removed = list.splice(1, 2);
    expect(removed).toEqual([2, 3]);
    expect(list.value).toEqual([1, 4]);
  });

  it('splice inserts elements', () => {
    const list = refList([1, 4]);
    list.splice(1, 0, 2, 3);
    expect(list.value).toEqual([1, 2, 3, 4]);
  });

  it('sort reorders elements', () => {
    const list = refList([3, 1, 2]);
    list.sort((a, b) => a - b);
    expect(list.value).toEqual([1, 2, 3]);
  });

  it('reverse reverses elements', () => {
    const list = refList([1, 2, 3]);
    list.reverse();
    expect(list.value).toEqual([3, 2, 1]);
  });

  it('fill fills a range with a value', () => {
    const list = refList([0, 0, 0, 0]);
    list.fill(7, 1, 3);
    expect(list.value).toEqual([0, 7, 7, 0]);
  });

  it('clear empties the list', () => {
    const list = refList([1, 2, 3]);
    list.clear();
    expect(list.length).toBe(0);
    expect(list.value).toEqual([]);
  });

  it('insert adds items at a specific index', () => {
    const list = refList([1, 4]);
    list.insert(1, 2, 3);
    expect(list.value).toEqual([1, 2, 3, 4]);
  });

  it('removeItem removes first occurrence of a value', () => {
    const list = refList([1, 2, 3, 2]);
    list.removeItem(2);
    expect(list.value).toEqual([1, 3, 2]);
  });

  it('remove removes count items starting from index', () => {
    const list = refList([1, 2, 3, 4]);
    list.remove(1, 2);
    expect(list.value).toEqual([1, 4]);
  });

  it('value setter replaces entire array', () => {
    const list = refList([1, 2, 3]);
    list.value = [10, 20];
    expect(list.value).toEqual([10, 20]);
  });

  it('update with updater function transforms the list', () => {
    const list = refList([1, 2, 3]);
    list.update((prev) => prev.map((x) => x * 2));
    expect(list.value).toEqual([2, 4, 6]);
  });

  it('update with a direct array replaces the list', () => {
    const list = refList([1, 2, 3]);
    list.update([9, 8]);
    expect(list.value).toEqual([9, 8]);
  });
});

describe('RefList – reactivity (subscribe / listen / unsubscribe)', () => {
  it('subscribe immediately emits current value', () => {
    const list = refList([1, 2, 3]);
    const calls: number[][] = [];
    list.subscribe((v) => calls.push([...v]));
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual([1, 2, 3]);
  });

  it('subscribe notifies on push', () => {
    const list = refList<number>([]);
    const calls: number[][] = [];
    list.subscribe((v) => calls.push([...v]));
    list.push(42);
    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(calls[calls.length - 1]).toContain(42);
  });

  it('listen does NOT emit current value immediately', () => {
    const list = refList([1, 2, 3]);
    const calls: number[][] = [];
    list.listen((v) => calls.push([...v]));
    expect(calls).toHaveLength(0);
  });

  it('listen notifies on future mutations', () => {
    const list = refList<string>([]);
    const received: string[][] = [];
    list.listen((v) => received.push([...v]));
    list.push('hello');
    expect(received).toHaveLength(1);
    expect(received[0]).toContain('hello');
  });

  it('unsubscribe stops future notifications', () => {
    const list = refList<number>([]);
    const calls: number[] = [];
    const handler = (v: number[]) => calls.push(v.length);
    list.subscribe(handler);
    const beforeLen = calls.length;
    list.unsubscribe(handler);
    list.push(1, 2, 3);
    expect(calls.length).toBe(beforeLen); // no new calls after unsubscribe
  });
});

describe('RefList – syncComponentWithList', () => {
  it('adds missing elements to the container', () => {
    const container = document.createElement('div');
    const a = document.createElement('span');
    const b = document.createElement('span');
    RefList.syncComponentWithList([a, b], container);
    expect(container.children.length).toBe(2);
    expect(container.children[0]).toBe(a);
    expect(container.children[1]).toBe(b);
  });

  it('removes elements no longer in the list', () => {
    const container = document.createElement('div');
    const a = document.createElement('span');
    const b = document.createElement('span');
    container.appendChild(a);
    container.appendChild(b);
    RefList.syncComponentWithList([a], container);
    expect(container.children.length).toBe(1);
    expect(container.children[0]).toBe(a);
  });

  it('reorders elements to match list order', () => {
    const container = document.createElement('div');
    const a = document.createElement('span');
    const b = document.createElement('span');
    container.appendChild(b);
    container.appendChild(a);
    RefList.syncComponentWithList([a, b], container);
    expect(container.children[0]).toBe(a);
    expect(container.children[1]).toBe(b);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// RefMap
// ═══════════════════════════════════════════════════════════════════════════

describe('RefMap – construction', () => {
  it('creates an empty RefMap', () => {
    const map = refMap<string, number>();
    expect(map).toBeInstanceOf(RefMap);
    expect(map.size).toBe(0);
  });

  it('creates a RefMap from entries', () => {
    const map = refMap<string, number>([['a', 1], ['b', 2]]);
    expect(map.size).toBe(2);
    expect(map.get('a')).toBe(1);
    expect(map.get('b')).toBe(2);
  });

  it('has an id string', () => {
    const map = refMap<string, number>();
    expect(typeof map.id).toBe('string');
  });

  it('valueOf returns a plain Map copy', () => {
    const map = refMap<string, number>([['x', 10]]);
    const val = map.valueOf();
    expect(val).toBeInstanceOf(Map);
    expect(val.get('x')).toBe(10);
  });
});

describe('RefMap – mutation methods', () => {
  it('set adds a new key-value pair', () => {
    const map = refMap<string, number>();
    map.set('count', 42);
    expect(map.get('count')).toBe(42);
    expect(map.size).toBe(1);
  });

  it('set updates an existing key', () => {
    const map = refMap<string, number>([['k', 1]]);
    map.set('k', 99);
    expect(map.get('k')).toBe(99);
  });

  it('delete removes a key', () => {
    const map = refMap<string, number>([['x', 5]]);
    const result = map.delete('x');
    expect(result).toBe(true);
    expect(map.has('x')).toBe(false);
  });

  it('clear removes all entries', () => {
    const map = refMap<string, number>([['a', 1], ['b', 2]]);
    map.clear();
    expect(map.size).toBe(0);
  });

  it('value setter replaces all entries', () => {
    const map = refMap<string, number>([['a', 1]]);
    map.value = new Map([['x', 10], ['y', 20]]);
    expect(map.size).toBe(2);
    expect(map.get('x')).toBe(10);
    expect(map.has('a')).toBe(false);
  });

  it('update with updater function transforms the map', () => {
    const map = refMap<string, number>([['a', 1], ['b', 2]]);
    map.update((prev) => {
      const next = new Map(prev);
      next.set('c', 3);
      return next;
    });
    expect(map.has('c')).toBe(true);
    expect(map.size).toBe(3);
  });

  it('toJSON serializes to a plain object', () => {
    const map = refMap<string, number>([['x', 1], ['y', 2]]);
    const json = map.toJSON();
    expect(json).toMatchObject({ x: 1, y: 2 });
  });
});

describe('RefMap – reactivity (subscribe / listen / unsubscribe)', () => {
  it('subscribe immediately emits the current map', () => {
    const map = refMap<string, number>([['a', 1]]);
    let received: Map<string, number> | null = null;
    map.subscribe((v) => { received = v; });
    expect(received).not.toBeNull();
    expect((received as unknown as Map<string, number>).get('a')).toBe(1);
  });

  it('subscribe notifies on set()', () => {
    const map = refMap<string, number>();
    const snapshots: number[] = [];
    map.subscribe((v) => snapshots.push(v.size));
    map.set('k', 1);
    expect(snapshots.length).toBeGreaterThanOrEqual(2);
    expect(snapshots[snapshots.length - 1]).toBe(1);
  });

  it('listen does NOT emit current value immediately', () => {
    const map = refMap<string, number>([['a', 1]]);
    const calls: number[] = [];
    map.listen(() => calls.push(1));
    expect(calls).toHaveLength(0);
  });

  it('listen notifies on future mutations', () => {
    const map = refMap<string, number>();
    const events: string[] = [];
    map.listen(() => events.push('change'));
    map.set('x', 5);
    expect(events).toHaveLength(1);
  });

  it('unsubscribe stops notifications', () => {
    const map = refMap<string, number>();
    const calls: number[] = [];
    const handler = (v: Map<string, number>) => calls.push(v.size);
    map.subscribe(handler);
    const base = calls.length;
    map.unsubscribe(handler);
    map.set('a', 1);
    map.set('b', 2);
    expect(calls.length).toBe(base);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// RefObject (via refObject())
// ═══════════════════════════════════════════════════════════════════════════

describe('RefObject (refObject)', () => {
  it('creates a reactive object wrapper', () => {
    const obj = refObject({ name: 'Alice', age: 30 });
    expect(obj).toBeTruthy();
    expect(obj.id).toBeTruthy();
  });

  it('value exposes the wrapped plain object', () => {
    const obj = refObject({ x: 1 });
    expect(obj.value).toBeTruthy();
  });

  it('subscribe emits immediately', () => {
    const obj = refObject({ count: 0 });
    let called = false;
    obj.subscribe(() => { called = true; });
    expect(called).toBe(true);
  });

  it('update with new plain object replaces content', () => {
    const obj = refObject({ a: 1 });
    let lastValue: any = null;
    obj.subscribe((v) => { lastValue = v; });
    obj.update({ b: 2 });
    expect(lastValue).toBeTruthy();
  });

  it('listen does not emit immediately', () => {
    const obj = refObject({ x: 0 });
    let calls = 0;
    obj.listen(() => { calls++; });
    expect(calls).toBe(0);
  });

  it('listen notifies on update', () => {
    const obj = refObject({ x: 0 });
    let notified = false;
    obj.listen(() => { notified = true; });
    obj.update({ x: 1 });
    expect(notified).toBe(true);
  });

  it('unsubscribe stops future emissions', () => {
    const obj = refObject({ n: 0 });
    let calls = 0;
    const handler = () => { calls++; };
    obj.subscribe(handler);
    const base = calls;
    obj.unsubscribe(handler);
    obj.update({ n: 1 });
    expect(calls).toBe(base);
  });

  it('toJSON serializes the object value', () => {
    const obj = refObject({ key: 'value' });
    const json = obj.toJSON();
    expect(typeof json).toBe('object');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ref() factory (auto-dispatch)
// ═══════════════════════════════════════════════════════════════════════════

describe('ref() factory – collection dispatch', () => {
  it('ref([]) creates a RefList', () => {
    const r = ref([1, 2, 3]);
    expect(r).toBeInstanceOf(RefList);
  });

  it('ref(new Map()) creates a RefMap', () => {
    const r = ref(new Map([['a', 1]]));
    expect(r).toBeInstanceOf(RefMap);
  });

  it('RefList from ref() retains array items', () => {
    const r = ref(['x', 'y']);
    expect((r as RefList<string>).length).toBe(2);
  });

  it('RefMap from ref() retains map entries', () => {
    const r = ref(new Map<string, number>([['n', 42]]));
    expect((r as RefMap<string, number>).get('n')).toBe(42);
  });
});