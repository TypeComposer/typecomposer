import { Ref, ref } from ".";

export function refState<T>(refKey: string) {
  return new RefState<T>(refKey);
}

Object.defineProperty(refState, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return !!instance && instance instanceof RefState;
  },
});

export type refState<T> = RefState<T>;
// @ts-ignore
export class RefState<T> implements ref<T> {
  readonly refKey: string;
  #ref: ref<T> | undefined;
  #subscribers: { target: unknown, propertyName?: unknown, onUnsubscribe?: unknown }[] = [];

  constructor(refKey: string) {
    this.refKey = refKey;
    this.#ref = Ref.get(refKey);
    if (!this.#ref) {
      Ref.onCreated(refKey, (ref) => {
        // @ts-ignore
        this.#ref = ref;
        for (const subscriber of this.#subscribers) {
          // @ts-ignore
          this.#ref?.subscribe(subscriber.target, subscriber.propertyName as any, subscriber.onUnsubscribe as any);
        }
        this.#subscribers = undefined as any;
      });
    }
  }

  get status(): ref<string> {
    // @ts-ignore
    return Ref.getStatus(this.refKey);
  }

  get active() {
    return !!this.#ref;
  }

  get ref() {
    return this.#ref;
  }

  // @ts-ignore
  private emit(propertyName: string | symbol, value: any) {
    if (this.ref) {
      // @ts-ignore
      this.ref.value = value;
    }
  }

  subscribe(target: (arg: T) => void): boolean;
  subscribe(target: (arg: T) => void, onUnsubscribe: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe: Function): boolean;
  subscribe(target: object | ((arg: boolean) => void), propertyName: string | symbol | Function, onUnsubscribe?: Function): boolean;
  subscribe(target: unknown, propertyName?: unknown, onUnsubscribe?: unknown): boolean {
    if (this.ref) {
      // @ts-ignore
      return this.ref.subscribe(target, propertyName as any, onUnsubscribe as any);
    }
    this.#subscribers.push({ target, propertyName, onUnsubscribe });
    return true
  }

  listen(target: (arg: T) => void, onUnsubscribe?: Function): boolean {
    return this.subscribe(target, onUnsubscribe);
  }

  unsubscribe(target: (arg: T) => void): boolean;
  unsubscribe(target: object, propertyName: string | symbol): boolean;
  unsubscribe(targe: object, propertyName: string | symbol = ""): boolean {
    if (this.ref) {
      // @ts-ignore
      return this.ref.unsubscribe(targe, propertyName);
    }
    this.#subscribers = this.#subscribers.filter(subscriber => subscriber.target !== targe && subscriber.propertyName !== propertyName);
    return true;
  }


  // @ts-ignore
  get value(): T {
    // @ts-ignore
    return this.ref?.value
  }
  // @ts-ignore

  set value(value: T) {
    if (this.ref) {
      // @ts-ignore
      this.ref.value = value
    }
  }

  valueOf(): T {
    // @ts-ignore
    return this.ref?.valueOf();
  }
  // @ts-ignore
  toJSON() {
    return this.ref?.toJSON() || {}
  }

  toString(): string {
    return "this.ref?.toString() || "
  }

  update(updater: ((previousValue: T) => T) | T) {
    if (typeof updater === "function") {
      // @ts-ignore
      this.value = updater(this.value);
    } else {
      this.value = updater;
    }
  }
}
