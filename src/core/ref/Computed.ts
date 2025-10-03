import { DynamicRef, refType, ref } from "./RefObject";

const computedSymbol = Symbol("computed");

class ComputedSet extends Set<refType> {
  [computedSymbol] = true;
  elements = new Map<string, WeakRef<any>>();

  put(item: refType) {
    if (item && item instanceof ref) {
      this.add(item);
      return item.value;
    }
  }

  cache(key: string) {
    return { key: key, controller: this };
  }

  setCache(key: string, value: any) {
    this.elements.set(key, new WeakRef(value));
  }

  getCache(key: string) {
    const ref = this.elements.get(key);
    if (ref && !ref.deref()) {
      this.elements.delete(key);
    }
    return ref ? ref.deref() : undefined;
  }

  clone() {
    const newSet = new ComputedSet();
    for (const item of this) {
      newSet.add(item);
    }
    return newSet;
  }
}

export function computed<T>(fn: () => Exclude<T, void>): DynamicRef<T>;
export function computed(fn: TemplateStringsArray, ...values: any[]): DynamicRef<string>;
export function computed<T>(fn: any, ...values: any[]): DynamicRef<T> {
  if (typeof fn !== "function") throw new Error("computed: fn must be a function");
  const observers = new ComputedSet();
  for (const v of values) {
    observers.put(v);
  }
  const value = fn(observers);
  const r = ref(value);
  const func = () => {
    const oldObservers = observers.clone();
    observers.clear();
    r.value = fn(observers);
    const observersToRemove = oldObservers.size > 0 ? [...oldObservers].filter((o) => !observers.has(o)) : [];
    const observersToAdd = observers.size > 0 ? [...observers].filter((o) => !oldObservers.has(o)) : [];
    for (const item of observersToRemove) {
      item.unsubscribe(func);
    }
    for (const item of observersToAdd) {
      item.listen(func);
    }
  };
  for (const item of observers) {
    item.listen(func);
  }
  return r as DynamicRef<T>;
}
