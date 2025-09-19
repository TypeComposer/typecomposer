import { Ref, ref } from ".";
import { RefContainer } from "./RefContainer";

/**
 * Creates a reactive wrapper for a Set of values.
 *
 * @param values - Optional array of initial values for the Set.
 * @returns A new instance of RefSet.
 */
export function refSet<U>(values?: readonly U[] | null) {
  return new RefSet<U>(values);
}

// Enables `instanceof refSet` to work with RefSet instances
Object.defineProperty(refSet, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return !!instance && instance instanceof RefSet;
  },
});

/**
 * A type alias representing either a native Set or a reactive RefSet.
 */
export type refSet<U> = Set<U> | RefSet<U>;

/**
 * A reactive wrapper around the native Set object.
 * Notifies subscribers when the contents of the Set are mutated.
 */
export class RefSet<U> extends Set<U> implements ref<Set<U>> {
  /**
   * Internal container that manages the reactive value and subscribers.
   */
  private readonly container: RefContainer = new RefContainer(this);
  readonly id: string;
  /**
   * Constructs a new reactive Set instance.
   *
   * @param values - Optional array of initial values.
   * @param refKey - Optional identifier to register in the global Ref registry.
   */
  constructor(values?: readonly U[] | null) {
    super();
    this.id = this.container.id;
    this.value = new Set<U>(values);
    Ref.set(this.id, this as any);
  }

  /**
   * Emits a change event to all subscribers for a given mutation.
   *
   * @param propertyName - The mutation name (e.g., "add", "delete", "clear").
   * @param value - The current state of the Set.
   */
  // @ts-ignore
  private emit(propertyName: string | symbol, value: any) {
    this.container.emitAll(propertyName, value, this.valueOf());
  }

  /** Reactive subscription methods **/

  subscribe(target: (arg: Set<U>) => void): boolean;
  subscribe(target: (arg: Set<U>) => void, onUnsubscribe: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe: Function): boolean;
  subscribe(
    target: object | ((arg: Set<U>) => void),
    propertyName: string | symbol | Function,
    onUnsubscribe?: Function
  ): boolean;
  /**
   * Subscribes to changes and immediately emits the current Set.
   */
  subscribe(target: unknown, propertyName?: unknown, onUnsubscribe?: unknown): boolean {
    return this.container.emit(this.container.subscribe(target, propertyName, onUnsubscribe), this, this.valueOf());
  }

  /**
   * Subscribes to future changes without emitting the current value.
   *
   * @param target - A callback function to be called on update.
   * @param onUnsubscribe - Optional callback for when unsubscribed.
   * @returns true if subscription was successful.
   */
  listen(target: (arg: Set<U>) => void, onUnsubscribe?: Function): boolean {
    return this.container.subscribe(target, onUnsubscribe) !== undefined;
  }

  /**
   * Unsubscribes a function or object-property pair from receiving updates.
   */
  unsubscribe(target: (arg: Set<U>) => void): boolean;
  unsubscribe(targe: object, propertyName: string | symbol): boolean;
  unsubscribe(targe: object, propertyName: string | symbol = ""): boolean {
    return this.container.unsubscribe(targe, propertyName);
  }

  /** Reactive mutation overrides **/

  /**
   * Adds a new value to the Set and notifies subscribers.
   *
   * @param value - The value to add.
   * @returns The Set instance.
   */
  add(value: U): this {
    const oldValue = this.valueOf();
    const result = super.add(value);
    this.container.emitAll("add", this, oldValue);
    return result;
  }

  /**
   * Removes a value from the Set and notifies subscribers.
   *
   * @param value - The value to remove.
   * @returns True if the value was present and removed.
   */
  delete(value: U): boolean {
    const oldValue = this.valueOf();
    const result = super.delete(value);
    this.container.emitAll("delete", this, oldValue);
    return result;
  }

  /**
   * Removes all values from the Set and notifies subscribers.
   */
  clear(): void {
    const oldValue = this.valueOf();
    super.clear();
    this.container.emitAll("clear", this, oldValue);
  }

  /**
   * Returns a shallow copy of the current Set state.
   */
  valueOf(): Set<U> {
    return new Set<U>(Array.from(this));
  }

  /**
   * Ensures native Set is used in methods like `slice`, `filter`, etc.
   */
  static get [Symbol.species]() {
    return Set;
  }

  /** Value access and serialization **/

  /**
   * Gets the current Set value.
   */
  get value(): Set<U> {
    return this.container.value.valueOf();
  }

  /**
   * Replaces the entire Set with a new Set and notifies subscribers.
   * If the same Set reference is passed, no update is triggered.
   *
   * @param value - A new Set instance to replace the current content.
   */
  set value(value: Set<U>) {
    if (this === value) return;
    super.clear();
    for (const val of value) {
      super.add(val);
    }
    this.emit("value", value);
  }

  /**
   * Serializes the Set to an object with numeric keys for JSON output.
   */
  toJSON() {
    const obj: any = {};
    let i = 0;
    for (const v of this.value) {
      obj[i++] = v;
    }
    return obj;
  }
}
