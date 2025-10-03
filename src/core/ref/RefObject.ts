import { refBoolean, RefNumber, refNumber, refString, RefString, RefBoolean, RefMap, RefList, refMap, refList, Ref, RefState } from ".";
import { RefContainer } from "./RefContainer";
import { RefSet, refSet } from "./RefSet";

class RefObjectContainer extends RefContainer {
  declare root: RefContainer;
  instance: { value: any } = { value: null };
  constructor(value: object, root?: RefContainer) {
    super(value, root as any);
    this.root = root;
    this.value = createObservador(value, this);
    if (isApplyProxy(value)) {
      RefObjectContainer.createObject.bind(this)(this.value, value, this);
    } else this.value = value;
  }

  valueOf() {
    return this.instance.value;
  }

  subscribeAndEmit(target: any, propertyName: any, onUnsubscribe?: any): any {
    const res = this.subscribe(target, propertyName, onUnsubscribe);
    this.emit(res, this.value, this.value);
    return res;
  }

  static createObject(proxy: any, value: any, container: RefObjectContainer) {
    if (Object.getPrototypeOf(proxy) === Object.prototype) {
      for (const key in value) {
        try {
          if (
            Object.getOwnPropertyDescriptor(proxy, key)?.writable === false ||
            Object.getOwnPropertyDescriptor(proxy, key)?.get ||
            Object.getOwnPropertyDescriptor(proxy, key)?.set
          ) {
            continue;
          }
          if (value[key] === undefined || value[key] === null) {
            proxy[key] = value[key];
            continue;
          }
          if (value[key] instanceof Array) {
            // @ts-ignore
            proxy[key] = new RefList(value[key]);
          } else if (value[key] instanceof Set) {
            // @ts-ignore
            proxy[key] = new RefSet(value[key]);
          } else if (value[key] instanceof Map) {
            // @ts-ignore
            proxy[key] = new RefMap(value[key]);
          } else if (typeof value[key] === "string" || value[key] instanceof String) {
            // @ts-ignore
            proxy[key] = new RefString(value[key].valueOf());
          } else if (typeof value[key] === "number" || value[key] instanceof Number) {
            // @ts-ignore
            proxy[key] = new RefNumber(value[key].valueOf());
          } else if (typeof value[key] === "boolean" || value[key] instanceof Boolean) {
            // @ts-ignore
            proxy[key] = new RefBoolean(value[key].valueOf());
          } else if (value[key] instanceof Element) {
            //proxy[key] =
          } else if (value[key] instanceof Object) {
            if (Object.getPrototypeOf(proxy) === Object.prototype) {
              const con = new RefObjectContainer(value[key], (container["root"] || this) as any);
              proxy[key] = con.value;
            } else proxy[key] = value[key];
          }
          if (proxy[key] instanceof ref) {
            // @ts-ignore
            proxy[key]["container"].root = container.root || this;
          }
        } catch (e) {}
      }
    }
  }

  static applyObject(proxy: object, value: object, container: RefContainer) {
    const keysOld = Object.keys(proxy);
    const keys = Object.keys(value);
    const keysRemove = keysOld.filter((k) => !keys.includes(k));
    const keysUpdate = keys.filter((k) => keysOld.includes(k));
    const keysNew = keys.filter((k) => !keysOld.includes(k));
    for (const key of keysRemove) {
      if (!keys.includes(key)) {
        // @ts-ignore
        delete proxy[key];
      }
    }
    for (const key of keysUpdate) {
      // @ts-ignore
      if (proxy[key] instanceof ref) {
        // @ts-ignore
        proxy[key].emit(key, value[key]);
      }
      // @ts-ignore
      else if (!(proxy[key] instanceof Element) && proxy[key] instanceof Object) {
        // @ts-ignore
        RefObjectContainer.applyObject.bind(this)(proxy[key], value[key], container);
      }
    }
    if (keysNew.length === 0) return;
    const newObject = {};
    for (const key of keysNew) {
      // @ts-ignore
      newObject[key] = value[key];
    }
    RefObjectContainer.createObject.bind(this)(proxy, newObject, container);
  }

  emitAll(propertyName: string | symbol, value: any) {
    super.emitAll(propertyName, value, value);
  }
}

function applyProxy<T extends object>(target: any, key: keyof T, value: any, receiver: any, container: RefObjectContainer): any {
  if (target[key] instanceof ref) {
    // @ts-ignore
    target[key].emit(key, value);
  } else if (!(target[key] instanceof Element) && target[key] instanceof Object) {
    if (Object.getPrototypeOf(target[key]) === Object.prototype) RefObjectContainer.applyObject(target[key], value, container);
  } else if (value != null) {
    RefObjectContainer.createObject(target, { [key]: value }, container);
  } else {
    Reflect.set(target, key, value, receiver);
  }
  return receiver;
}

function isApplyProxy(value: any) {
  if (!value) return false;
  if (typeof value !== "object") return true;
  return (
    Object.getPrototypeOf(value) === Object.prototype ||
    Array.isArray(value) ||
    value instanceof Map ||
    value instanceof Set ||
    value instanceof Number ||
    value instanceof Boolean ||
    value instanceof String
  );
}

function createObservador<T extends object>(obj: T, container: RefObjectContainer): refObject<T> {
  const refObject = new Proxy(obj || ({} as T), {
    // @ts-ignore
    get(target, key: keyof T, receiver) {
      if (key == "toString") return JSON.stringify(obj);
      if (key == "toJSON")
        return () => {
          return JSON.parse(JSON.stringify(obj));
        };
      if (key == "valueOf") return JSON.parse(JSON.stringify(obj));
      return Reflect.get(target, key, receiver);
    },
    // @ts-ignore
    set(target, key: keyof T, value, receiver) {
      if (value && value instanceof ref) value = value?.valueOf() || value;
      if (isApplyProxy(value)) receiver = applyProxy(target, key, value, receiver, container);
      else {
        receiver = Reflect.set(target, key, value, receiver);
      }
      container.emitAll(key as string, value);
      return receiver;
    },
  }) as T & { toJSON: () => T };
  container.value = refObject;
  return refObject as refObject<T>;
}

// type refObject<T> = {
//   [K in keyof T]: T[K] extends string | String
//   ? refString
//   : T[K] extends number | Number
//   ? refNumber
//   : T[K] extends boolean | Boolean
//   ? refBoolean
//   : T[K] extends Array<infer U>
//   ? refList<U>
//   : T[K] extends Map<infer MK, infer MV>
//   ? refMap<MK, MV>
//   : T[K] extends Set<infer SU>
//   ? refSet<SU>
//   : T[K] extends object
//   ? refObject<T[K]>
//   : T[K];
// };

type refObject<T> = T extends string | String
  ? refString
  : T extends number | Number
  ? refNumber
  : T extends boolean | Boolean
  ? refBoolean
  : T extends Array<infer U>
  ? refList<U>
  : T extends Map<infer MK, infer MV>
  ? refMap<MK, MV>
  : T extends Set<infer SU>
  ? refSet<SU>
  : T extends object
  ? { [K in keyof T]: refObject<T[K]> }
  : T extends never
  ? T
  : T;

/**
 * Represents a reactive reference object that holds a value of type T,
 * allowing observers to subscribe to changes in that value.
 */
interface RefObject<T> {
  readonly id: string;
  /**
   * The internal reference to another RefObject instance (if applicable).
   */
  value: refObject<T>;

  /**
   * Subscribes a function to be notified whenever the value changes.
   * The subscriber will immediately receive the current value.
   *
   * @param target - A function that will be called with the new value.
   * @returns true if the subscription was successful, false otherwise.
   */
  subscribe(target: (value: T, oldValue: T) => void): boolean;

  /**
   * Subscribes a function to be notified on value change, with an optional unsubscribe callback.
   *
   * @param target - A function that will be called with the new value.
   * @param onUnsubscribe - A callback that will be called when unsubscribed.
   * @returns true if the subscription was successful, false otherwise.
   */
  subscribe(target: (value: T, oldValue: T) => void, onUnsubscribe: Function): boolean;

  /**
   * Subscribes a property of an object to receive updates when the value changes.
   * The property will immediately be set to the current value.
   *
   * @param target - The target object to bind the value to.
   * @param propertyName - The name of the property to update on value change.
   * @returns true if the subscription was successful, false otherwise.
   */
  subscribe(target: object, propertyName: string | symbol): boolean;

  /**
   * Subscribes a property of an object with an optional unsubscribe callback.
   * The property will immediately be set to the current value.
   *
   * @param target - The target object to bind the value to.
   * @param propertyName - The name of the property to update.
   * @param onUnsubscribe - A callback that will be called when unsubscribed.
   * @returns true if the subscription was successful, false otherwise.
   */
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe: Function): boolean;

  /**
   * Overloaded generic subscribe method that supports both function and object property subscriptions.
   * In all cases, the current value will be emitted immediately upon subscription.
   */
  subscribe(target: object | ((args: T) => void), propertyName: string | symbol | Function, onUnsubscribe?: Function): boolean;

  /**
   * Subscribes to value changes without immediately emitting the current value.
   * Use this to listen only for future changes.
   *
   * @param target - A function to be called on future value changes.
   * @returns true if the listener was successfully registered, false otherwise.
   */
  listen(target: (value: T, oldValue: T) => void): boolean;

  /**
   * Subscribes to value changes without emitting the current value,
   * with an optional unsubscribe callback.
   *
   * @param target - A function to be called on future value changes.
   * @param onUnsubscribe - A callback that will be triggered on unsubscription.
   * @returns true if the listener was successfully registered, false otherwise.
   */
  listen(target: (arg: T, oldValue: T) => void, onUnsubscribe?: Function): boolean;

  /**
   * Unsubscribes a previously registered function subscriber.
   *
   * @param target - The function that was subscribed.
   * @returns true if unsubscribed successfully, false otherwise.
   */
  unsubscribe(target: (args: T) => void): boolean;

  /**
   * Unsubscribes a previously registered object property subscriber.
   *
   * @param target - The target object.
   * @param propertyName - The name of the property that was bound to value changes.
   * @returns true if unsubscribed successfully, false otherwise.
   */
  unsubscribe(target: object, propertyName: string | symbol): boolean;

  /**
   * General unsubscribe method supporting both function and object property unsubscriptions.
   */
  unsubscribe(target: object | ((args: T) => void), propertyName: string | symbol): boolean;

  /**
   * Returns a string representation of the current value.
   */
  toString(): string;

  /**
   * Serializes the current value to JSON.
   */
  toJSON(): DynamicJSON<T>;

  /**
   * Returns the raw value of the RefObject.
   */
  valueOf(): T;

  /**
   * Allows iteration over the reference value.
   */
  [Symbol.iterator](): Iterator<T>;
}

type DynamicJSON<T> = T extends object ? T : { value: T };
export type DynamicRef<T> = T extends string | String
  ? RefString
  : T extends number | Number
  ? RefNumber
  : T extends boolean | Boolean
  ? RefBoolean
  : T extends Array<infer U>
  ? RefList<U>
  : T extends Set<infer U>
  ? RefSet<U>
  : T extends Map<infer K, infer V>
  ? RefMap<K, V>
  : T extends object
  ? RefObject<T>
  : never;

export function ref<T = any>(value?: T): DynamicRef<T> {
  // if (value === undefined || value === null) throw new Error("ref: value cannot be null or undefined");
  value = TypeComposer.deepCopy(value);
  if (typeof value === "string" || value instanceof String) {
    return new RefString(value.valueOf()) as any;
  } else if (typeof value === "number" || value instanceof Number) {
    return new RefNumber(value.valueOf()) as any;
  } else if (typeof value === "boolean" || value instanceof Boolean) {
    return new RefBoolean(value.valueOf()) as any;
  } else if (value instanceof Array) {
    return new RefList(value) as any;
  } else if (value instanceof Set) {
    return new RefSet(value as []) as any;
  } else if (value instanceof Map) {
    return new RefMap(value as []) as any;
  }
  const container: RefObjectContainer = new RefObjectContainer(value as object);
  const instance = {
    value: container.value as refObject<T>,
    subscribe: container.subscribeAndEmit.bind(container),
    listen: container.listen.bind(container),
    unsubscribe: container.unsubscribe.bind(container),
    toString: container.toString.bind(container),
    toJSON: container.toJSON.bind(container),
    valueOf: container.valueOf.bind(container),
    id: container.id,
  };
  container["instance"] = instance;
  Object.defineProperty(instance, Symbol.iterator, {
    value: function* (this: refObject<any>) {
      for (const key in instance.value) {
        yield instance.value[key]?.valueOf() || instance.value[key];
      }
    },
  });
  Object.defineProperty(instance, "value", {
    get() {
      return container.value;
    },
    set(value: any) {
      RefObjectContainer.applyObject(container.value, value, container);
      container.emitAll("value", value);
    },
  });
  Object.setPrototypeOf(instance, ref.prototype);
  // @ts-ignore
  Ref.set(container.id, instance);
  return instance as any;
}

export type ref<T = any> = DynamicRef<T>;

Object.defineProperty(ref, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return (
      !!instance &&
      typeof instance === "object" &&
      (instance === ref ||
        Object.getPrototypeOf(instance) === ref.prototype ||
        instance instanceof RefString ||
        instance instanceof RefNumber ||
        instance instanceof RefBoolean ||
        instance instanceof RefList ||
        instance instanceof RefSet ||
        instance instanceof RefMap ||
        instance instanceof RefState)
    );
  },
});

export type refType = RefString | RefNumber | RefBoolean | RefList<any> | RefSet<any> | RefMap<any, any> | RefObject<any> | RefState<any>;

export const Interface = {
  empty: function <T extends Record<string, any>>(): T {
    return {} as T;
  },
};

export type Interface = typeof Interface;
