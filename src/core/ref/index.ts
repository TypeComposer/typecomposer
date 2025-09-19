import { RefContainer } from "./RefContainer";
import { ref } from "./RefObject";
export * from "./RefBoolean";
export * from "./RefNumber";
export * from "./RefString";
export * from "./RefMap";
export * from "./RefList";
export * from "./RefSet";
export * from "./RefObject";
export * from "./RefProperty";
export * from "./RefState";
export * from "./Computed";

type PropertyMap = Map<string | symbol, WeakRef<RefContainer>>;
const subscribers = new WeakMap<object, PropertyMap>();

export class Ref {
  private static refs = new Map<string, WeakRef<ref>>();
  private static onCreatedCallbacks = new Map<string, Function[]>();
  private static refsStatus = new Map<string, ref<string>>();

  public static onCreated(refKey: string, action: (ref: ref) => void) {
    Ref.onCreatedCallbacks.set(refKey, [...(Ref.onCreatedCallbacks.get(refKey) || []), action]);
  }

  public static get<T>(refKey: string): ref<T> | undefined {
    const _ref = Ref.refs.get(refKey);
    return _ref?.deref() as ref<T>;
  }

  private static getStatus(refKey: string) {
    if (!Ref.refsStatus.has(refKey)) {
      Ref.refsStatus.set(refKey, ref("0"));
    }
    return Ref.refsStatus.get(refKey);
  }

  public static set<T>(refKey: string, value: ref<any>) {
    Ref.refs.set(refKey, new WeakRef(value));
    for (const callback of Ref.onCreatedCallbacks.get(refKey) || []) {
      callback(value);
    }
    Ref.onCreatedCallbacks.delete(refKey);
  }

  public static unsubscribe(target: object, propertyName: string | symbol) {
    if (!subscribers.has(target)) return;
    const propertyMap = subscribers.get(target)!;
    const containerOld = propertyMap.get(propertyName);
    if (containerOld) containerOld.deref()?.unsubscribe(target, propertyName);
    if (!propertyMap.has(propertyName)) return;
    propertyMap.delete(propertyName);
  }

  public static unsubscribeAll(target: object) {
    if (!subscribers.has(target)) return;
    const propertyMap = subscribers.get(target)!;
    subscribers.delete(target);
    for (const [key, value] of propertyMap) {
      value.deref()?.unsubscribe(target, key);
    }
  }

  // in use
  private static subscribe(target: object, propertyName: string | symbol, container: RefContainer) {
    if (!subscribers.has(target)) subscribers.set(target, new Map());
    const propertyMap = subscribers.get(target)!;
    if (propertyMap.has(propertyName)) {
      const containerOld = propertyMap.get(propertyName);
      if (containerOld) containerOld.deref()?.unsubscribe(target, propertyName);
    }
    propertyMap.set(propertyName, new WeakRef(container));
  }


}

(globalThis as any).Ref = Ref;