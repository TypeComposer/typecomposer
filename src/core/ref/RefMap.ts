import { Ref, ref } from ".";
import { RefContainer } from "./RefContainer";

/**
 * Creates a new reactive map from the given entries.
 *
 * @param entries - Optional initial key-value pairs.
 * @returns A reactive RefMap instance.
 */
export function refMap<K, V>(entries?: readonly (readonly [K, V])[] | null) {
  return new RefMap<K, V>(entries);
}

// Enables `instanceof refMap` to work correctly
Object.defineProperty(refMap, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return !!instance && instance instanceof RefMap;
  },
});

/**
 * A type representing either a native Map or a reactive RefMap.
 */
export type refMap<K, V> = Map<K, V> | RefMap<K, V>;

/**
 * A reactive wrapper around the native Map object.
 * Supports automatic reactivity and subscription to changes.
 */
export class RefMap<K, V> extends Map<K, V> implements ref<Map<K, V>> {
  /**
   * Internal container managing subscribers and value propagation.
   */
  private readonly container: RefContainer = new RefContainer(this);
  readonly id: string;



  /**
   * Constructs a new reactive map instance.
   *
   * @param entries - Optional initial entries to populate the map.
   * @param refKey - Optional registration key for the Ref registry.
   */
  constructor(entries?: readonly (readonly [K, V])[] | null) {
    super();
    this.id = this.container.id;
    Ref.set(this.id, this as any);
    this.value = new Map<K, V>(entries);
  }

  /**
   * Emits a change event to all subscribers for a given mutation type.
   *
   * @param propertyName - The kind of mutation (e.g., "set", "clear").
   * @param value - The current state of the map.
   */
  // @ts-ignore
  private emit(propertyName: string | symbol, value: any) {
    const oldValue = this.valueOf();
    this.container.emitAll(propertyName, value, oldValue);
  }

  /** Reactive subscription methods **/

  subscribe(target: (value: Map<K, V>, oldValue: Map<K, V>) => void): boolean;
  subscribe(target: (value: Map<K, V>, oldValue: Map<K, V>) => void, onUnsubscribe: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe: Function): boolean;
  subscribe(
    target: object | ((value: Map<K, V>, oldValue: Map<K, V>) => void),
    propertyName: string | symbol | Function,
    onUnsubscribe?: Function
  ): boolean;
  /**
   * Subscribes to changes and immediately emits the current map value.
   */
  subscribe(target: unknown, propertyName?: unknown, onUnsubscribe?: unknown): boolean {
    return this.container.emit(this.container.subscribe(target, propertyName, onUnsubscribe), this, this.valueOf());
  }

  /**
   * Subscribes to future changes without emitting the current value.
   *
   * @param target - Function to call on change.
   * @param onUnsubscribe - Optional callback to invoke on unsubscription.
   */
  listen(target: (value: Map<K, V>, oldValue: Map<K, V>) => void, onUnsubscribe?: Function): boolean {
    return this.container.subscribe(target, onUnsubscribe) !== undefined;
  }

  /**
   * Unsubscribes a function or object-property pair from receiving updates.
   */
  unsubscribe(target: (arg: Map<K, V>) => void): boolean;
  unsubscribe(targe: object, propertyName: string | symbol): boolean;
  unsubscribe(targe: object, propertyName: string | symbol = ""): boolean {
    return this.container.unsubscribe(targe, propertyName);
  }

  /** Reactive mutation overrides **/

  /**
   * Sets a value for a given key and notifies subscribers.
   *
   * @param key - The key to insert or update.
   * @param value - The value to associate with the key.
   * @returns The map itself.
   */
  set(key: K, value: V): this {
    const oldValue = this.valueOf();
    const result = super.set(key, value);
    this.container.emitAll("set", this, oldValue);
    return result;
  }

  /**
   * Deletes a key-value pair and notifies subscribers.
   *
   * @param key - The key to delete.
   * @returns True if the key existed and was removed.
   */
  delete(key: K): boolean {
    const oldValue = this.valueOf();
    const result = super.delete(key);
    this.container.emitAll("delete", this, oldValue);
    return result;
  }

  /**
   * Clears all entries from the map and notifies subscribers.
   */
  clear(): void {
    const oldValue = this.valueOf();
    super.clear();
    this.container.emitAll("clear", this, oldValue);
  }

  /**
   * Returns a shallow copy of the current map state.
   */
  valueOf(): Map<K, V> {
    return new Map<K, V>(Array.from(this));
  }

  /**
   * Ensures native `Map` is returned when using `Map` methods that create new instances.
   */
  static get [Symbol.species]() {
    return Map;
  }

  /**
   * Gets the current value of the reactive map.
   * Returns a shallow copy to prevent unintended mutation.
   */
  get value(): Map<K, V> {
    return this.container.value.valueOf();
  }

  /**
   * Sets the entire contents of the map to match the given Map instance.
   * If the same reference is passed, no update is triggered.
   *
   * @param value - A new Map to replace the current contents.
   */
  set value(value: Map<K, V>) {
    if (this === value) return;
    super.clear();
    for (const [key, val] of value) {
      super.set(key, val);
    }
    this.emit("value", value);
  }

  /**
   * Serializes the map to a plain JavaScript object for JSON output.
   * Note: keys are converted to string.
   */
  toJSON() {
    const obj: any = {};
    for (const [k, v] of this.value) {
      obj[k] = v;
    }
    return obj;
  }
}
