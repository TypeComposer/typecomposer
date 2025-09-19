import { Ref, ref } from ".";
import { RefContainer } from "./RefContainer";

/**
 * Creates a new reactive list wrapper around a standard array.
 *
 * @param items - The initial array of items.
 * @returns A new instance of RefList.
 */
export function refList<T>(items: T[]): RefList<T> {
  return new RefList(items);
}

// Enables `instanceof refList` to work correctly
Object.defineProperty(refList, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return !!instance && instance instanceof RefList;
  },
});

/**
 * Type alias representing a reactive list of items of type T.
 */
export type refList<T> = RefList<T>;

/**
 * A reactive wrapper for arrays that notifies subscribers on mutation.
 * Inherits from Array and intercepts mutations like push, pop, splice, etc.
 */
export class RefList<T = any> extends Array<T> implements ref<T[]> {
  
  /**
   * Internal container that manages the reactive value and its subscribers.
   */
  private readonly container: RefContainer;
  readonly id: string;


  /**
   * Constructs a new RefList instance with the given items.
   *
   * @param items - The initial items for the list.
   * @param refKey - Optional key used for registration in a central Ref registry.
   */
  constructor(items: T[]) {
    super(...items);
    this.container = new RefContainer(this);
    this.id = this.container.id;
    Ref.set(this.id, this as any);
  }

  /**
   * Emits a change event to all subscribers for a specific mutation.
   *
   * @param propertyName - The type of mutation (e.g., "push", "splice", "value").
   * @param value - The new list value.
   */
  private emit(propertyName: string | symbol, value: any) {
    const oldValue = this.valueOf();
    this.container.emitAll(propertyName, value, oldValue);
  }

  /** Reactive subscription methods **/

  subscribe(target: (value: T[], oldValue: T[]) => void): boolean;
  subscribe(target: (value: T[], oldValue: T[]) => void, onUnsubscribe: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe: Function): boolean;
  subscribe(
    target: object | ((value: T[], oldValue: T[]) => void),
    propertyName: string | symbol | Function,
    onUnsubscribe?: Function
  ): boolean;
  /**
   * Subscribes to list changes and immediately emits the current value.
   */
  subscribe(target: unknown, propertyName?: unknown, onUnsubscribe?: unknown): boolean {
    return this.container.emit(this.container.subscribe(target, propertyName, onUnsubscribe), this, this.valueOf());
  }

  /**
   * Subscribes to future changes without emitting the current value.
   */
  listen(target: (value: T[], oldValue: T[]) => void, onUnsubscribe?: Function): boolean {
    return this.container.subscribe(target, onUnsubscribe) !== undefined;
  }

  /**
   * Unsubscribes a function or object-property pair from list updates.
   */
  unsubscribe(target: (arg: T[]) => void): boolean;
  unsubscribe(target: object, propertyName: string | symbol): boolean;
  unsubscribe(targe: object, propertyName: string | symbol = ""): boolean {
    return this.container.unsubscribe(targe, propertyName);
  }

  /** Reactive mutation overrides **/

  push(...items: T[]): number {
    const oldValue = this.valueOf();
    const n = super.push(...items);
    this.container.emitAll("push", this, oldValue);
    return n;
  }

  pop(): T | undefined {
    const oldValue = this.valueOf();
    const item = super.pop();
    this.container.emitAll("pop", this, oldValue);
    return item;
  }

  shift(): T | undefined {
    const oldValue = this.valueOf();
    const item = super.shift();
    this.container.emitAll("shift", this, oldValue);
    return item;
  }

  unshift(...items: T[]): number {
    const oldValue = this.valueOf();
    const n = super.unshift(...items);
    this.container.emitAll("unshift", this, oldValue);
    return n;
  }

  splice(start: number, deleteCount?: number): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: number, deleteCount: number = 0, ...items: T[]): T[] {
    const oldValue = this.valueOf();
    const deleted = super.splice(start, deleteCount, ...items);
    this.container.emitAll("splice", this, oldValue);
    return deleted;
  }

  sort(compareFn?: (a: T, b: T) => number): this {
    const oldValue = this.valueOf();
    super.sort(compareFn);
    this.container.emitAll("sort", this, oldValue);
    return this;
  }

  reverse(): T[] {
    const oldValue = this.valueOf();
    const reversed = super.reverse();
    this.container.emitAll("reverse", this, oldValue);
    return reversed;
  }

  fill(value: T, start?: number, end?: number): this {
    const oldValue = this.valueOf();
    super.fill(value, start, end);
    this.container.emitAll("fill", this, oldValue);
    return this;
  }

  copyWithin(target: number, start: number, end?: number): this {
    const oldValue = this.valueOf();
    super.copyWithin(target, start, end);
    this.container.emitAll("copyWithin", this, oldValue);
    return this;
  }

  /**
   * Changes the length of the array and emits a change.
   */
  set length(value: number) {
    const oldValue = this.length;
    super.length = value;
    this.container.emitAll("length", this, oldValue);
  }

  /**
   * Clears all elements in the list.
   */
  clear(): void {
    const oldValue = this.length;
    super.length = 0;
    this.container.emitAll("clear", this, oldValue);
  }

  /**
   * Inserts items at a specific index.
   */
  insert(index: number, ...items: T[]): number {
    const oldValue = this.valueOf();
    super.splice(index, 0, ...items);
    this.container.emitAll("insert", this, oldValue);
    return this.length;
  }

  /**
   * Removes a specific item from the list.
   */
  removeItem(value: T): T {
    const index = super.indexOf(value);
    if (index === -1) return value;
    const oldValue = this.valueOf();
    super.splice(index, 1);
    this.container.emitAll("removeValue", this, oldValue);
    return value;
  }

  /**
   * Removes elements starting from an index.
   */
  remove(index: number, count: number = 1): number {
    const oldValue = this.valueOf();
    super.splice(index, count);
    this.container.emitAll("remove", this, oldValue);
    return this.length;
  }

  /**
   * Returns a shallow copy of the current list.
   */
  valueOf(): T[] {
    return Array.from(this);
  }

  get length(): number {
    return super.length;
  }

  /**
   * Synchronizes the children of an HTML element with a list of HTMLElements.
   *
   * @param list - The list of elements to reflect in the container.
   * @param element - The container element whose children will be updated.
   */
  static syncComponentWithList(list: Element[], element: HTMLElement) {
    const currentChildren = Array.from(element.children);
    currentChildren.forEach((child) => {
      if (!list.includes(child as HTMLElement)) {
        element.removeChild(child);
      }
    });
    list.forEach((el) => {
      // @ts-ignore
      if (el instanceof Node && !currentChildren.includes(el)) {
        element.appendChild(el);
      }
    });
    list.forEach((el, index) => {
      if (el instanceof Node && element.children[index] !== el) {
        element.insertBefore(el, element.children[index] || null);
      }
    });
  }

  /**
   * Identifies this object as a custom reactive list in `Object.prototype.toString`.
   */
  get [Symbol.toStringTag]() {
    return "refList";
  }

  /**
   * Ensures Array is returned when using methods like `slice()` or `map()`.
   */
  static get [Symbol.species]() {
    return Array;
  }


  /**
   * Gets the current value of the reactive list.
   * Returns a shallow copy of the internal array to prevent direct mutation.
  */
  get value(): T[] {
    return this.container.value.valueOf();
  }

  /**
   * Replaces the entire contents of the list with a new array of items.
   * If the same array reference is passed, no update or notification occurs.
   *
   * @param value - The new array of items to assign.
   */
  set value(value: T[]) {
    // @ts-ignore
    if (this === value) return;
    super.splice(0, this.length, ...value);
    this.emit("value", value);
  }

  /**
   * Serializes the current list value for JSON output.
   * This ensures only the raw array contents are emitted.
   */
  toJSON() {
    return this.value;
  }

}
