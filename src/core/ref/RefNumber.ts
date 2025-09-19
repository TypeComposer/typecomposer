import { Ref, ref } from ".";
import { RefContainer } from "./RefContainer";

/**
 * Creates a reactive wrapper for a numeric value.
 *
 * @param value - The initial number value.
 * @returns A new instance of RefNumber.
 */
export function refNumber(value: number) {
  return new RefNumber(value);
}

// Enables `instanceof refNumber` to return true for RefNumber instances
Object.defineProperty(refNumber, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return !!instance && instance instanceof RefNumber;
  },
});

/**
 * A union type representing either a primitive number or a reactive RefNumber.
 */
export type refNumber = number | RefNumber;

/**
 * A reactive wrapper for numbers that behaves like a Number object.
 * Allows subscriptions to value changes and integrates with primitive operations.
 */
export class RefNumber implements Number, ref<number> {
  /**
   * The container holding the internal value and managing subscriptions.
   */
  private readonly container: RefContainer;
  readonly id: string;


  /**
   * Constructs a new reactive number wrapper.
   *
   * @param value - The initial number value.
   */
  constructor(value: number) {
    this.container = new RefContainer(value);
    this.id = this.container.id;
    Ref.set(this.id, this as any);
  }

  /**
   * Emits a change notification if the value has changed.
   *
   * @param propertyName - The name of the property being updated (usually "value").
   * @param value - The new number value to assign.
   */
  // @ts-ignore
  private emit(propertyName: string | symbol, value: any) {
    if (this.value === value.valueOf()) return;
    const oldValue = this.valueOf();
    this.container.emitAll(propertyName, (this.container.value = value.valueOf()), oldValue);
  }

  /** Reactive subscription methods **/

  subscribe(target: (value: number, oldValue: number) => void): boolean;
  subscribe(target: (value: number, oldValue: number) => void, onUnsubscribe: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe: Function): boolean;
  subscribe(
    target: object | ((value: number, oldValue: number) => void),
    propertyName: string | symbol | Function,
    onUnsubscribe?: Function
  ): boolean;
  /**
   * Subscribes to value changes and immediately emits the current number.
   */
  subscribe(target: unknown, propertyName?: unknown, onUnsubscribe?: unknown): boolean {
    return this.container.emit(this.container.subscribe(target, propertyName, onUnsubscribe), this.value, this.valueOf());
  }

  /**
   * Subscribes to future value changes without emitting the current number.
   *
   * @param target - A function to be called on future updates.
   * @param onUnsubscribe - Optional callback to be called upon unsubscription.
   * @returns true if successfully subscribed.
   */
  listen(target: (value: number, oldValue: number) => void, onUnsubscribe?: Function): boolean {
    return this.container.subscribe(target, onUnsubscribe) !== undefined;
  }

  /**
   * Unsubscribes a function or object property from receiving value updates.
   */
  unsubscribe(target: (arg: number) => void): boolean;
  unsubscribe(targe: object, propertyName: string | symbol): boolean;
  unsubscribe(targe: object, propertyName: string | symbol = ""): boolean {
    return this.container.unsubscribe(targe, propertyName);
  }

  /** Value access and primitives **/

  /**
   * Gets the current number value.
   */
  get value(): number {
    return this.container.value;
  }

  /**
   * Sets a new number value and notifies subscribers if it changed.
   *
   * @param value - The new number to set.
   */
  set value(value: number) {
    this.emit("value", value);
  }

  /**
   * Returns the primitive number value.
   */
  valueOf(): number {
    return this.value.valueOf();
  }

  /**
   * Converts the value to a string using an optional radix.
   *
   * @param radix - An integer between 2 and 36 specifying the base.
   */
  toString(radix?: number): string {
    return this.value.toString(radix);
  }

  /**
   * Converts the value to fixed-point notation.
   *
   * @param fractionDigits - Number of digits after the decimal point.
   */
  toFixed(fractionDigits?: number): string {
    return this.value.toFixed(fractionDigits);
  }

  /**
   * Converts the value to exponential notation.
   *
   * @param fractionDigits - Number of digits after the decimal point.
   */
  toExponential(fractionDigits?: number): string {
    return this.value.toExponential(fractionDigits);
  }

  /**
   * Formats the number to a specified precision.
   *
   * @param precision - Total number of significant digits.
   */
  toPrecision(precision?: number): string {
    return this.value.toPrecision(precision);
  }

  /**
   * Formats the number according to locale-specific rules.
   *
   * @param locales - A locale string or array of locale strings.
   * @param options - Formatting options.
   */
  toLocaleString(locales?: string, options?: Intl.NumberFormatOptions): string {
    return this.value.toLocaleString(locales, options);
  }

  /**
   * Supports automatic type coercion to a number in JS expressions.
   *
   * @param hint - Either "number", "string", or "default".
   */
  [Symbol.toPrimitive](hint: string): number {
    if (hint === "number" || hint === "default") {
      return this.value;
    }
    return this.valueOf();
  }

  /**
   * Identifies this class as a subtype of `Number`.
   */
  static get [Symbol.species]() {
    return Number;
  }

  /**
   * Serializes the current value for JSON output.
   * If this instance is the root ref, emits the raw value, otherwise wraps it.
   */
  toJSON() {
    return this.container.root ? this.value : { value: this.value };
  }
}
