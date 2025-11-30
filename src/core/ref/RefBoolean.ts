import { Ref, ref } from ".";
import { RefContainer } from "./RefContainer";

/**
 * Creates a new reactive boolean reference.
 *
 * @param value - The initial boolean value.
 * @returns A new instance of RefBoolean.
 */
export function refBoolean(value: boolean) {
  return new RefBoolean(value);
}

// Customizes instanceof behavior for type checking
Object.defineProperty(refBoolean, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return !!instance && instance instanceof RefBoolean;
  },
});

/**
 * Union type for accepting both primitive booleans and RefBoolean instances.
 */
export type refBoolean = boolean | RefBoolean;

/**
 * Reactive wrapper for a boolean value, supporting subscriptions and reactivity.
 */
export class RefBoolean implements Boolean, ref<boolean> {
  /**
   * Internal container that manages subscribers and the current value.
   */
  private readonly container: RefContainer;
  readonly id: string;



  /**
   * Constructs a reactive boolean wrapper.
   *
   * @param value - The initial boolean value.
   * @param refKey - Optional key used for registration in a central Ref registry.
   */
  constructor(value: boolean) {
    this.container = new RefContainer(value);
    this.id = this.container.id;
    // Registers in Ref registry if key is provided
    Ref.set(this.id, this);
  }

  /**
   * Emits a change if the new value differs from the current value.
   *
   * @param propertyName - The property being updated (typically "value").
   * @param value - The new value being set.
   */
  // @ts-ignore
  private emit(propertyName: string | symbol, value: any) {
    if (this.value === value) return;
    const oldValue = this.valueOf();
    this.container.emitAll(propertyName, (this.container.value = value.valueOf()), oldValue);
  }

  /**
   * Subscribes to value changes and immediately emits the current value.
   */
  subscribe(target: (value: boolean, oldValue: boolean) => void): boolean;
  subscribe(target: (value: boolean, oldValue: boolean) => void, onUnsubscribe: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe: Function): boolean;
  subscribe(
    target: object | ((value: boolean, oldValue: boolean) => void),
    propertyName: string | symbol | Function,
    onUnsubscribe?: Function
  ): boolean;
  subscribe(target: unknown, propertyName?: unknown, onUnsubscribe?: unknown): boolean {
    return this.container.emit(this.container.subscribe(target, propertyName, onUnsubscribe), this.value, this.value);
  }

  /**
   * Subscribes to value changes without emitting the current value.
   *
   * @param target - Callback function to be invoked on future value changes.
   * @param onUnsubscribe - Optional callback to be invoked when unsubscribed.
   * @returns true if subscription was successful.
   */
  listen(target: (value: boolean, oldValue: boolean) => void, onUnsubscribe?: Function): boolean {
    return this.container.subscribe(target, onUnsubscribe) !== undefined;
  }

  /**
   * Unsubscribes a function or object-property pair from receiving value changes.
   */
  unsubscribe(target: (arg: boolean) => void): boolean;
  unsubscribe(target: object, propertyName: string | symbol): boolean;
  unsubscribe(targe: object, propertyName: string | symbol = ""): boolean {
    return this.container.unsubscribe(targe, propertyName);
  }

  /**
   * Provides primitive conversion support for the boolean wrapper.
   *
   * @param hint - The conversion context ("default", "number", "string", etc.)
   * @returns The primitive boolean value.
   */
  [Symbol.toPrimitive](hint: string): boolean {
    if (hint === "boolean" || hint === "default") {
      return this.value;
    }
    return this.valueOf();
  }

  /**
   * Specifies the primitive type associated with this object.
   */
  static get [Symbol.species]() {
    return Boolean;
  }

  /**
   * Gets the current boolean value.
   */
  get value(): boolean {
    return this.container.value.valueOf();
  }

  /**
   * Sets a new boolean value and notifies subscribers if changed.
   */
  set value(value: boolean) {
    this.emit("value", value);
  }

  /**
   * Returns the primitive boolean value.
   */
  valueOf(): boolean {
    return this.value.valueOf();
  }

  /**
   * Returns a JSON-serializable representation of this boolean.
   * If this is a root ref, only the value is returned. Otherwise, a wrapped object is returned.
   */
  // @ts-ignore
  toJSON() {
    return this.container.root ? this.value : { value: this.value };
  }

  /**
   * Returns a string representation of the current value.
   */
  toString(): string {
    return this.container.toString();
  }

  update(updater: ((previousValue: boolean) => boolean) | boolean) {
    if (typeof updater === "function") {
      this.value = updater(this.value);
    } else {
      this.value = updater;
    }
  }
  /** 
   * Toggles the boolean value.
   */
  toggle() {
    this.value = !this.value;
  }
}
