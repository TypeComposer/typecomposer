import { describe, it, expect, vi } from 'vitest';
import { ref, computed } from '../src';

describe('TypeComposer Reactivity', () => {
  it('should initialize refs with primitive values', () => {
    const stringRef = ref('Hello');
    const numberRef = ref(42);
    const booleanRef = ref(true);

    expect(stringRef.value).toBe('Hello');
    expect(numberRef.value).toBe(42);
    expect(booleanRef.value).toBe(true);
  });

  it('should trigger subscriptions on value changes', () => {
    const stringRef = ref('Hello');
    const listener = vi.fn();

    stringRef.subscribe(listener);

    // Initial subscription triggers immediately
    expect(listener).toHaveBeenCalledWith('Hello', 'Hello');

    stringRef.value = 'World';
    expect(listener).toHaveBeenLastCalledWith('World', 'Hello');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should support computed derived values using observers', () => {
    const first = ref('John');
    const last = ref('Doe');

    // Using the observers collection passed to the callback to put/track dependencies
    const full = computed((obs) => {
      const f = obs.put(first);
      const l = obs.put(last);
      return `${f} ${l}`;
    });

    expect(full.value).toBe('John Doe');

    first.value = 'Jane';
    expect(full.value).toBe('Jane Doe');

    last.value = 'Smith';
    expect(full.value).toBe('Jane Smith');
  });
});