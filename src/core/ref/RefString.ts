import { Ref, ref } from ".";
import { RefContainer } from "./RefContainer";

/**
 * Creates a reactive wrapper around a string.
 *
 * @param value - The initial string value.
 * @returns A new instance of RefString.
 */
export function refString(value: string) {
  return new RefString(value);
}

// Allows `instanceof refString` to work properly
Object.defineProperty(refString, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return !!instance && instance instanceof RefString;
  },
});

/**
 * A union type representing either a primitive string or a RefString.
 */
export type refString = string | RefString;

/**
 * A reactive string wrapper that mimics the String API,
 * supports subscriptions to changes, and acts like a primitive.
 */
export class RefString implements ref<string> {
  readonly id: string;
  /**
   * Internal container for value management and subscriptions.
   */
  readonly container: RefContainer;

  /**
   * String index access (e.g., refStr[0]) — readonly.
   */
  readonly [index: number]: string;

  /**
   * Constructs a new RefString instance.
   *
   * @param value - Initial string value.
   * @param refKey - Optional reference key for global registry.
   */
  constructor(value: string) {
    this.container = new RefContainer(value);
    this.id = this.container.id;
    Ref.set(this.id, this as any);
  }

  /** Reactive subscription methods **/

  subscribe(target: (value: string, oldValue: string) => void): boolean;
  subscribe(target: (value: string, oldValue: string) => void, onUnsubscribe?: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe?: Function): boolean;
  subscribe(target: object | ((value: string, oldValue: string) => void), propertyName: string | symbol | Function, onUnsubscribe?: Function): boolean;
  subscribe(target: unknown, propertyName?: unknown, onUnsubscribe?: unknown): boolean {
    return this.container.emit(this.container.subscribe(target, propertyName, onUnsubscribe), this.value, this.valueOf());
  }

  /**
   * Subscribes to future changes without emitting the current value.
   */
  listen(target: (value: string, oldValue: string) => void, onUnsubscribe?: Function): boolean {
    return this.container.subscribe(target, onUnsubscribe) !== undefined;
  }

  /**
   * Unsubscribes a function or object-property pair from updates.
   */
  unsubscribe(target: (arg: string) => void): boolean;
  unsubscribe(targe: object, propertyName: string | symbol): boolean;
  unsubscribe(targe: object, propertyName: string | symbol = ""): boolean {
    return this.container.unsubscribe(targe, propertyName);
  }

  /** Reactive value access **/

  /**
   * Gets the current string value.
   */
  get value(): string {
    return this.container.value.valueOf();
  }

  /**
   * Sets a new value and notifies subscribers if it changed.
   *
   * @param value - The new string value.
   */
  set value(value: string) {
    this.emit("value", value);
  }

  /**
   * Emits a change notification if the value changed.
   */
  // @ts-ignore
  protected emit(propertyName: string | symbol, value: any) {
    if (this.container.value === value.valueOf()) return;
    const oldValue = this.value;
    this.container.emitAll(propertyName, (this.container.value = value.valueOf()), oldValue);
  }

  /**
   * Returns the string value as a primitive.
   */
  [Symbol.toPrimitive](_hint: string): string {
    return this.container.toString();
  }

  /**
   * Ensures String is returned for string operations like concat/slice.
   */
  static get [Symbol.species]() {
    return String;
  }

  /**
   * Returns the primitive string value.
   */
  valueOf(): string {
    return this.container.value.toString();
  }

  /**
   * Returns the string representation of the value.
   */
  toString(): string {
    return this.container.toString();
  }

  /**
   * Returns a JSON-serializable representation of the string.
   */
  toJSON() {
    return this.container.root ? this.value : { value: this.value };
  }

  /**
   * Returns the length of the string.
   */
  get length(): number {
    return this.container.value.length;
  }

  /**
   * Compares this string to another string.
   *
   * @param value - The value to compare with.
   */
  equals(value: string): boolean {
    return this.container.valueOf() === value.valueOf();
  }

  /**
   * Allows iteration over each character in the string.
   */
  [Symbol.iterator](): StringIterator<string> {
    return this.container.value[Symbol.iterator]();
  }

  /** String method wrappers **/

  charAt(pos: number): string {
    return this.container.value.charAt(pos);
  }
  charCodeAt(index: number): number {
    return this.container.value.charCodeAt(index);
  }
  codePointAt(pos: number): number | undefined {
    return this.container.value.codePointAt(pos);
  }
  concat(...strings: string[]): string {
    return this.container.value.concat(...strings);
  }
  indexOf(searchString: string, position?: number): number {
    return this.container.value.indexOf(searchString, position);
  }
  lastIndexOf(searchString: string, position?: number): number {
    return this.container.value.lastIndexOf(searchString, position);
  }
  includes(searchString: string, position?: number): boolean {
    return this.container.value.includes(searchString, position);
  }
  startsWith(searchString: string, position?: number): boolean {
    return this.container.value.startsWith(searchString, position);
  }
  endsWith(searchString: string, endPosition?: number): boolean {
    return this.container.value.endsWith(searchString, endPosition);
  }
  slice(start?: number, end?: number): string {
    return this.container.value.slice(start, end);
  }
  substring(start: number, end?: number): string {
    return this.container.value.substring(start, end);
  }
  substr(from: number, length?: number): string {
    return this.container.value.substr(from, length);
  }
  match(regexp: string | RegExp): RegExpMatchArray | null {
    return this.container.value.match(regexp);
  }
  matchAll(regexp: RegExp): RegExpStringIterator<RegExpExecArray> {
    return this.container.value.matchAll(regexp);
  }
  replace(searchValue: string | RegExp, replacer: string): string {
    return this.container.value.replace(searchValue, replacer);
  }
  replaceAll(searchValue: string, replacer: string | ((substring: string, ...args: any[]) => string)): string {
    // @ts-ignore
    return this.container.value.replaceAll(searchValue, replacer);
  }
  search(searcher: string | RegExp): number {
    return this.container.value.search(searcher);
  }
  split(separator: string | RegExp, limit?: number): string[] {
    return this.container.value.split(separator, limit);
  }
  repeat(count: number): string {
    return this.container.value.repeat(count);
  }
  padStart(maxLength: number, fillString?: string): string {
    return this.container.value.padStart(maxLength, fillString);
  }
  padEnd(maxLength: number, fillString?: string): string {
    return this.container.value.padEnd(maxLength, fillString);
  }
  trim(): string {
    return this.container.value.trim();
  }
  trimStart(): string {
    return this.container.value.trimStart();
  }
  trimEnd(): string {
    return this.container.value.trimEnd();
  }
  trimLeft(): string {
    return this.container.value.trimLeft();
  }
  trimRight(): string {
    return this.container.value.trimRight();
  }
  toLowerCase(): string {
    return this.container.value.toLowerCase();
  }
  toUpperCase(): string {
    return this.container.value.toUpperCase();
  }
  toLocaleLowerCase(locales?: string): string {
    return this.container.value.toLocaleLowerCase(locales);
  }
  toLocaleUpperCase(locales?: string): string {
    return this.container.value.toLocaleUpperCase(locales);
  }
  normalize(form?: string): string {
    return this.container.value.normalize(form);
  }
  localeCompare(that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number {
    return this.container.value.localeCompare(that, locales, options);
  }

  /** Deprecated HTML string methods (still supported in JS) **/

  anchor(name: string): string {
    return this.container.value.anchor(name);
  }
  big(): string {
    return this.container.value.big();
  }
  blink(): string {
    return this.container.value.blink();
  }
  bold(): string {
    return this.container.value.bold();
  }
  fixed(): string {
    return this.container.value.fixed();
  }
  fontcolor(color: string): string {
    return this.container.value.fontcolor(color);
  }
  fontsize(size: number | string): string {
    return this.container.value.fontsize(size.toString());
  }
  italics(): string {
    return this.container.value.italics();
  }
  link(url: string): string {
    return this.container.value.link(url);
  }
  small(): string {
    return this.container.value.small();
  }
  strike(): string {
    return this.container.value.strike();
  }
  sub(): string {
    return this.container.value.sub();
  }
  sup(): string {
    return this.container.value.sup();
  }

  update(updater: ((previousValue: string) => string) | string) {
    if (typeof updater === "function") {
      this.value = updater(this.value);
    } else {
      this.value = updater;
    }
  }
}
