import { refBoolean, RefNumber, refNumber, refString, RefString, RefBoolean, RefMap, RefList, refMap, refList, Ref, RefState } from ".";
import { RefContainer } from "./RefContainer";
import { RefSet, refSet } from "./RefSet";

function convertRefValue(value: any): any {
  if (typeof value === "string" || value instanceof String)
    return new RefString(value.valueOf()) as any;
  if (typeof value === "number" || value instanceof Number)
    return new RefNumber(value.valueOf()) as any;
  if (typeof value === "boolean" || value instanceof Boolean)
    return new RefBoolean(value.valueOf()) as any;
  if (value instanceof Array)
    return new RefList(value) as any;
  if (value instanceof Set)
    // @ts-ignore
    return new RefSet(value) as any;
  if (value instanceof Map)
    // @ts-ignore
    return new RefMap(value) as any;
  return value;
}

function convertObjectInObjectRefDeep(target: any) {
  if (Object.getPrototypeOf(target) === Object.prototype) {
    for (const key in target) {
      try {
        if (
          Object.getOwnPropertyDescriptor(target, key)?.writable === false ||
          Object.getOwnPropertyDescriptor(target, key)?.get ||
          Object.getOwnPropertyDescriptor(target, key)?.set
        ) {
          continue;
        }
        if (target[key] === undefined || target[key] === null) {
          continue;
        }
        target[key] = convertRefValue(target[key]);
        if (target[key] instanceof ref) {
          // @ts-ignore
          target[key]["container"].root = this;
        }
        if (target[key] instanceof Object) {
          convertObjectInObjectRefDeep(target[key]);
        }
      } catch (e) { }
    }
  }
}

class NotEmitted {
  constructor(public value: any) { }

  valueOf() {
    return this.value;
  }
}

class RefObjectContainer extends RefContainer {
  declare root: RefContainer;
  instance: { value: any } = { value: null };
  constructor(value: object, root?: RefContainer) {
    super(null, root as any);
    this.root = root;
    this.value = createObservador(value || {}, this);
  }

  valueOf() {
    return this.instance.value;
  }

  subscribeAndEmit(target: any, propertyName: any, onUnsubscribe?: any): any {
    const res = this.subscribe(target, propertyName, onUnsubscribe);
    this.emit(res, this.value, this.value);
    return res;
  }

  update(updater: ((previousValue: any) => any) | any): void {
    const newValue = typeof updater === "function" ? updater(this.value) : updater;
    if (this.value === newValue)
      return;
    function convertValueInNotEmitted(value: any): any {
      for (const key in value) {
        if (value[key] !== null && typeof value[key] === "object" && Object.getPrototypeOf(value[key]) === Object.prototype) {
          convertValueInNotEmitted(value[key]);
        }
        else value[key] = new NotEmitted(value[key]);
      }
      return value;
    }
    Object.assign(this.value, convertValueInNotEmitted(newValue));
    this.emitAll("value", this.valueOf());
  }

  emitAll(propertyName: string | symbol, value: any) {
    super.emitAll(propertyName, value, value);
  }
}


function createObservador<T extends object>(obj: T, container: RefObjectContainer): refObject<T> {
  convertObjectInObjectRefDeep(obj);
  const refObject = new Proxy(obj || ({} as T), {
    // @ts-ignore
    get(target, key: keyof T, receiver) {
      // if (key == "toString") return JSON.stringify(obj);
      // if (key == "toJSON")
      //   return () => {
      //     return JSON.parse(JSON.stringify(obj));
      //   };
      // if (key == "valueOf") return JSON.parse(JSON.stringify(obj));
      return Reflect.get(target, key, receiver);
    },
    // @ts-ignore
    set(target, key: keyof T, value, receiver) {
      const isNotEmitted = value && value instanceof NotEmitted;
      if (isNotEmitted) value = value.value;
      // @ts-ignore
      if (value && value instanceof ref) value = value.valueOf() || value?.value;
      if (target[key] instanceof ref) {
        // @ts-ignore
        target[key].value = value;
      }
      else {
        receiver = Reflect.set(target, key, value, receiver);
      }
      if (!isNotEmitted && !(target[key] !== null && typeof target[key] === "object" && Object.getPrototypeOf(target[key]) === Object.prototype)) {
        console.log("RefObject: emit", {
          key, value, target, receiver
        });
        container.emitAll('value', this.value);
      }
      return receiver;
    },
  }) as T & { toJSON: () => T };
  container.value = refObject;
  return refObject as refObject<T>;
}

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
  readonly value: refObject<T>;

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
   * Updates the current value using either a new value or an updater function.
   *
   * @param updater - A new value or a function that takes the current value and returns the updated value.
   */
  update(updater: ((previousValue: T) => T) | T): void;

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
    update: container.update.bind(container),
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
      container.update(value);
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
