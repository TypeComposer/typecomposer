import { Ref } from ".";

const refSubscriber = Symbol("refSubscriber");

interface IRefSubscriber {
  target: WeakRef<any> | Function;
  propertyName: string | symbol;
  onUnsubscribe?: Function;
  refSubscriber: typeof refSubscriber;
}

export class RefContainer {
  static #index = 0;

  #subscribers: IRefSubscriber[] = [];
  readonly id = `${Math.random().toString(36).substring(2, 4)}${RefContainer.#index++}`;

  constructor(public value?: any, public readonly root?: RefContainer) {}

  emit(subscriber: IRefSubscriber, value: any, oldValue: any): boolean {
    if (subscriber.target instanceof Function) {
      subscriber.target(value, oldValue);
    } else {
      const target = subscriber.target.deref();
      if (target === undefined) {
        this.#subscribers = this.#subscribers.filter((s) => s !== subscriber);
        return false;
      }
      if (typeof target[subscriber.propertyName] === "function") target[subscriber.propertyName](value, oldValue);
      else if (target[subscriber.propertyName] !== value) {
        target[subscriber.propertyName] = value;
      }
    }
    return true;
  }

  info() {
    console.log("RefContainer info: ", this.value, "subscribers: ", this.#subscribers);
  }

  // @ts-ignore
  emitAll(propertyName: string | symbol, value: any, oldValue: any): any {
    this.#subscribers.forEach((s) => this.emit(s, value, oldValue));
    if (this.root && this.root.emitAll) this.root.emitAll("value", this.root["instance"] ? this.root["instance"]["value"] : this.root.value, oldValue);
    return value;
  }

  getSubscriber(target: object | Function, propertyName: string | symbol | Function): { subscriber?: IRefSubscriber; index: number } {
    const resutl: { subscriber?: IRefSubscriber; index: number } = { subscriber: undefined, index: -1 };
    if (typeof target === "function") {
      const index = this.#subscribers.findIndex((s) => s.target === target);
      resutl.index = index;
      if (index !== -1) resutl.subscriber = this.#subscribers[index];
    } else {
      // @ts-ignore
      const index = this.#subscribers.findIndex((s) => typeof s.target !== "function" && s.target.deref() === target && s.propertyName === propertyName);
      resutl.index = index;
      if (index !== -1) resutl.subscriber = this.#subscribers[index];
    }
    return resutl;
  }

  subscribe(target: any, propertyName: any, onUnsubscribe?: any): IRefSubscriber {
    const resutl = this.getSubscriber(target, propertyName);
    if (propertyName instanceof Function) onUnsubscribe = propertyName;
    if (resutl.subscriber) return resutl.subscriber;
    const subscriber: IRefSubscriber = {
      target: target instanceof Function ? target : new WeakRef(target),
      propertyName: typeof propertyName === "string" ? propertyName : "",
      onUnsubscribe,
      refSubscriber,
    };
    this.#subscribers.push(subscriber);
    // @ts-ignore
    if (typeof target !== "function") Ref.subscribe(target, typeof propertyName === "string" ? propertyName : "", this);
    return subscriber;
  }

  listen(target: (arg: any) => void, onUnsubscribe?: Function): IRefSubscriber {
    return this.subscribe(target, onUnsubscribe);
  }

  unsubscribe(target: object | Function, propertyName: string | symbol): boolean {
    const resutl = this.getSubscriber(target, propertyName);
    if (resutl.subscriber === undefined) return false;
    resutl.subscriber.onUnsubscribe?.();
    this.#subscribers = this.#subscribers.filter((_, i) => i !== resutl.index);
    if (typeof target !== "function") Ref.unsubscribe(target, propertyName);
    return true;
  }

  [Symbol.toPrimitive](hint: string): string {
    if (hint === "string" || hint === "default") {
      return this.value;
    }
    return this.value.valueOf();
  }

  toString(): string {
    if (typeof this.value === "object") {
      return JSON.stringify(this.value);
    } else if (this.value instanceof Object) {
      return "[object Object]";
    }
    return this.value.toString();
  }

  toJSON() {
    try {
      return JSON.parse(JSON.stringify(this.value));
    } catch (e) {
      console.error(e);
      return {};
    }
  }
}
