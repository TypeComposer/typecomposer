import { describe, it, expect, vi } from 'vitest';
import { ref, computed } from '../src';

describe('Computed chains and advanced reactivity', () => {
  describe('chained computed refs', () => {
    it('should propagate through a two-level computed chain', () => {
      const base = ref(2);

      const doubled = computed((obs) => {
        const b = obs.put(base);
        return b * 2;
      });

      const quadrupled = computed((obs) => {
        const d = obs.put(doubled);
        return d * 2;
      });

      expect(doubled.value).toBe(4);
      expect(quadrupled.value).toBe(8);

      base.value = 5;
      expect(doubled.value).toBe(10);
      expect(quadrupled.value).toBe(20);
    });

    it('should recompute when any upstream ref changes in a multi-dep computed', () => {
      const a = ref(1);
      const b = ref(10);
      const c = ref(100);

      const sum = computed((obs) => {
        return obs.put(a) + obs.put(b) + obs.put(c);
      });

      expect(sum.value).toBe(111);

      a.value = 2;
      expect(sum.value).toBe(112);

      b.value = 20;
      expect(sum.value).toBe(122);

      c.value = 200;
      expect(sum.value).toBe(222);
    });

    it('should notify a subscriber on each computed recomputation', () => {
      const price = ref(10);
      const quantity = ref(3);

      const total = computed((obs) => obs.put(price) * obs.put(quantity));

      const listener = vi.fn();
      total.subscribe(listener);

      // subscribe immediately emits the current value
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenLastCalledWith(30, 30);

      price.value = 20;
      expect(total.value).toBe(60);
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenLastCalledWith(60, 30);

      quantity.value = 5;
      expect(total.value).toBe(100);
      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenLastCalledWith(100, 60);
    });
  });

  describe('ref.update helper', () => {
    it('should update a number ref via updater function', () => {
      const count = ref(0);
      count.update((n) => n + 1);
      expect(count.value).toBe(1);
      count.update((n) => n * 3);
      expect(count.value).toBe(3);
    });

    it('should update a string ref via updater function', () => {
      const label = ref('hello');
      label.update((s) => s.toUpperCase());
      expect(label.value).toBe('HELLO');
    });

    it('should update a number ref by direct value', () => {
      const count = ref(5);
      count.update(99);
      expect(count.value).toBe(99);
    });
  });

  describe('ref.listen (no immediate emission)', () => {
    it('should not fire the listener on initial subscription', () => {
      const name = ref('Alice');
      const listener = vi.fn();

      name.listen(listener);
      expect(listener).not.toHaveBeenCalled();

      name.value = 'Bob';
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('Bob', 'Alice');
    });
  });

  describe('unsubscribe', () => {
    it('should stop firing after unsubscribe', () => {
      const counter = ref(0);
      const listener = vi.fn();

      counter.subscribe(listener);
      expect(listener).toHaveBeenCalledTimes(1); // immediate emit

      counter.value = 1;
      expect(listener).toHaveBeenCalledTimes(2);

      counter.unsubscribe(listener);

      counter.value = 2;
      // no additional calls after unsubscribe
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe('computed with boolean ref', () => {
    it('should derive a string label from a boolean toggle', () => {
      const isActive = ref(false);

      const label = computed((obs) => (obs.put(isActive) ? 'active' : 'inactive'));

      expect(label.value).toBe('inactive');

      isActive.value = true;
      expect(label.value).toBe('active');

      isActive.value = false;
      expect(label.value).toBe('inactive');
    });
  });
});