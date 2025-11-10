import "./safari-polyfill";
import { EventComponent, EventHandler } from "../core/event";
import { ElementType, computed, InputElement, ref, RefBoolean, refBoolean, RefList, RefMap, RefNumber, RefSet, RefString, refString, StyleProperties, InjectedType } from "../";

function deepCopy<T>(obj: T, cache = new WeakMap()): T {
  // @ts-ignore
  if (obj instanceof ref) obj = obj.valueOf();
  if (obj === null || typeof obj !== "object") return obj;
  if (cache.has(obj)) return cache.get(obj);
  if (obj instanceof Node) return obj;
  if (typeof obj === "function") return obj;
  if (Object.getPrototypeOf(obj) === null) return obj;

  if (Array.isArray(obj)) {
    const arr = obj.map((item) => deepCopy(item, cache));
    cache.set(obj, arr);
    return arr as unknown as T;
  }
  if (obj instanceof Date) return new Date(obj) as unknown as T;
  if (obj instanceof RegExp) return new RegExp(obj) as unknown as T;
  if (obj instanceof Map) {
    const map = new Map();
    cache.set(obj, map);
    for (const [k, v] of obj) map.set(deepCopy(k, cache), deepCopy(v, cache));
    return map as unknown as T;
  }
  if (obj instanceof Set) {
    const set = new Set();
    cache.set(obj, set);
    for (const v of obj) set.add(deepCopy(v, cache));
    return set as unknown as T;
  }

  const clonedObj = Object.create(Object.getPrototypeOf(obj));
  cache.set(obj, clonedObj);
  for (const key of Reflect.ownKeys(obj)) {
    (clonedObj as any)[key] = deepCopy((obj as any)[key], cache);
  }
  if (Object.isFrozen(obj)) Object.freeze(clonedObj);
  else if (Object.isSealed(obj)) Object.seal(clonedObj);
  return clonedObj as T;
}

(globalThis as any).deepCopy = deepCopy;
// // safari-polyfill
// if (/^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent) || /iP(hone|od|ad)/.test(navigator.userAgent)) {
//   const { keys: e } = Object,
//     t = !0,
//     r = !1,
//     n = "querySelectorAll",
//     o = "querySelectorAll",
//     { document: l, Element: s, MutationObserver: a, Set: c, WeakMap: u } = self,
//     /// @ts-ignore
//     i = (e) => o in e,
//     { filter: d } = [];
//   /// @ts-ignore
//   var h = (e) => {
//     const h = new u(),
//       /// @ts-ignore
//       f = (t, r) => {
//         let n;
//         if (r)
//           for (let o, l = ((e) => e.matches || e.webkitMatchesSelector || e.msMatchesSelector)(t), s = 0, { length: a } = p; s < a; s++)
//             l.call(t, (o = p[s])) && (h.has(t) || h.set(t, new c()), (n = h.get(t)), n.has(o) || (n.add(o), e.handle(t, r, o)));
//         else
//           h.has(t) &&
//             ((n = h.get(t)),
//             h.delete(t),
//             /// @ts-ignore
//             n.forEach((n) => {
//               e.handle(t, r, n);
//             }));
//       },
//       /// @ts-ignore
//       g = (e, t = !0) => {
//         for (let r = 0, { length: n } = e; r < n; r++) f(e[r], t);
//       },
//       { query: p } = e,
//       b = e.root || l,
//       y = ((e, o = document, l = MutationObserver, s = ["*"]) => {
//         /// @ts-ignore
//         const a = (r, o, l, s, c, u) => {
//             for (const i of r)
//               (u || n in i) && (c ? l.has(i) || (l.add(i), s.delete(i), e(i, c)) : s.has(i) || (s.add(i), l.delete(i), e(i, c)), u || a(i[n](o), o, l, s, c, t));
//           },
//           c = new l((e) => {
//             if (s.length) {
//               const n = s.join(","),
//                 o = new Set(),
//                 l = new Set();
//               for (const { addedNodes: s, removedNodes: c } of e) a(c, n, o, l, r, r), a(s, n, o, l, t, r);
//             }
//           }),
//           { observe: u } = c;
//         return (c.observe = (e) => u.call(c, e, { subtree: t, childList: t }))(o), c;
//       })(f, b, a, p),
//       { attachShadow: w } = s.prototype;
//     return (
//       w &&
//         (s.prototype.attachShadow = function (e) {
//           const t = w.call(this, e);
//           return y.observe(t), t;
//         }),
//       p.length && g(b[o](p)),
//       {
//         /// @ts-ignore
//         drop: (e) => {
//           for (let t = 0, { length: r } = e; t < r; t++) h.delete(e[t]);
//         },
//         flush: () => {
//           const e = y.takeRecords();
//           for (let t = 0, { length: r } = e; t < r; t++) g(d.call(e[t].removedNodes, i), !1), g(d.call(e[t].addedNodes, i), !0);
//         },
//         observer: y,
//         parse: g,
//       }
//     );
//   };
//   const { customElements: f, document: g, Element: p, MutationObserver: b, Object: y, Promise: w, Map: m, Set: S, WeakMap: v, Reflect: A } = self,
//     { createElement: E } = g,
//     { define: M, get: O, upgrade: q } = f,
//     { construct: k } = A || {
//       /// @ts-ignore
//       construct(e) {
//         return e.call(this);
//       },
//     },
//     { defineProperty: N, getOwnPropertyNames: $, setPrototypeOf: P } = y,
//     C = new v(),
//     j = new S(),
//     V = new m(),
//     L = new m(),
//     R = new m(),
//     T = new m(),
//     /// @ts-ignore
//     W = [],
//     /// @ts-ignore
//     _ = [],
//     /// @ts-ignore
//     x = (e) => T.get(e) || O.call(f, e),
//     { parse: D } = h({
//       /// @ts-ignore
//       query: _,
//       /// @ts-ignore
//       handle: (t, r, n) => {
//         const o = R.get(n);
//         if (r && !o.isPrototypeOf(t)) {
//           const r = ((t) => {
//             const r = e(t),
//               /// @ts-ignore
//               n = [],
//               o = new Set(),
//               { length: l } = r;
//             for (let e = 0; e < l; e++) {
//               n[e] = t[r[e]];
//               try {
//                 delete t[r[e]];
//               } catch (t) {
//                 o.add(e);
//               }
//             }
//             return () => {
//               /// @ts-ignore
//               for (let e = 0; e < l; e++) o.has(e) || (t[r[e]] = n[e]);
//             };
//           })(t);
//           B = P(t, o);
//           try {
//             new o.constructor();
//           } finally {
//             (B = null), r();
//           }
//         }
//         const l = (r ? "" : "dis") + "connectedCallback";
//         l in o && t[l]();
//       },
//     }),
//     { parse: F } = h({
//       /// @ts-ignore
//       query: W,
//       /// @ts-ignore
//       handle(e, t) {
//         /// @ts-ignore
//         C.has(e) && (t ? j.add(e) : j.delete(e), _.length && G.call(_, e));
//       },
//     }),
//     { attachShadow: H } = p.prototype;
//   H &&
//     (p.prototype.attachShadow = function (e) {
//       const t = H.call(this, e);
//       return C.set(this, t), t;
//     });
//   /// @ts-ignore
//   const I = (e) => {
//       if (!L.has(e)) {
//         let t,
//           r = new w((e) => {
//             t = e;
//           });
//         L.set(e, { $: r, _: t });
//       }
//       return L.get(e).$;
//     },
//     z = ((e, t) => {
//       /// @ts-ignore
//       const r = (e) => {
//           for (let t = 0, { length: r } = e; t < r; t++) n(e[t]);
//         },
//         /// @ts-ignore
//         n = ({ target: e, attributeName: t, oldValue: r }) => {
//           e.attributeChangedCallback(t, r, e.getAttribute(t));
//         };
//       /// @ts-ignore
//       return (o, l) => {
//         const { observedAttributes: s } = o.constructor;
//         return (
//           s &&
//             e(l).then(() => {
//               new t(r).observe(o, {
//                 attributes: !0,
//                 attributeOldValue: !0,
//                 attributeFilter: s,
//               });
//               for (let e = 0, { length: t } = s; e < t; e++) o.hasAttribute(s[e]) && n({ target: o, attributeName: s[e], oldValue: null });
//             }),
//           o
//         );
//       };
//     })(I, b);
//   /// @ts-ignore
//   let B = null;
//   /// @ts-ignore
//   function G(e) {
//     const t = C.get(e);
//     /// @ts-ignore
//     D(t.querySelectorAll(this), e.isConnected);
//   }
//   $(self)
//     .filter((e) => /^HTML.*Element$/.test(e))
//     .forEach((e) => {
//       /// @ts-ignore
//       const t = self[e];
//       function r() {
//         /// @ts-ignore
//         const { constructor: e } = this;
//         if (!V.has(e)) throw new TypeError("Illegal constructor");
//         const { is: r, tag: n } = V.get(e);
//         if (r) {
//           /// @ts-ignore
//           if (B) return z(B, r);
//           const t = E.call(g, n);
//           return t.setAttribute("is", r), z(P(t, e.prototype), r);
//         }
//         /// @ts-ignore
//         return k.call(this, t, [], e);
//       }
//       P(r, t), N((r.prototype = t.prototype), "constructor", { value: r }), N(self, e, { value: r });
//     }),
//     /// @ts-ignore
//     (g.createElement = function (e, t) {
//       const r = t && t.is;
//       if (r) {
//         const t = T.get(r);
//         if (t && V.get(t).tag === e) return new t();
//       }
//       const n = E.call(g, e);
//       return r && n.setAttribute("is", r), n;
//     }),
//     (f.get = x),
//     (f.whenDefined = I),
//     (f.upgrade = function (e) {
//       /// @ts-ignore
//       const t = e.getAttribute("is");
//       if (t) {
//         const r = T.get(t);
//         if (r) return void z(P(e, r.prototype), t);
//       }
//       q.call(f, e);
//     }),
//     (f.define = function (e, t, r) {
//       if (x(e)) throw new Error(`'${e}' has already been defined as a custom element`);
//       /// @ts-ignore
//       let n;
//       const o = r && r.extends;
//       V.set(t, o ? { is: e, tag: o } : { is: "", tag: e }),
//         o
//           ? ((n = `${o}[is="${e}"]`), R.set(n, t.prototype), T.set(e, t), _.push(n))
//           : /// @ts-ignore
//             (M.apply(f, arguments), W.push((n = e))),
//         I(e).then(() => {
//           o
//             ? /// @ts-ignore
//               (D(g.querySelectorAll(n)), j.forEach(G, [n]))
//             : /// @ts-ignore
//               F(g.querySelectorAll(n));
//         }),
//         L.get(e)._(t);
//     });
// }
const styleRef = Symbol("styleRef");
const parentComponentSymbol = Symbol("parentComponent");
const variantAll = Symbol("variantAll");
const variants = new Map<ComponentType, Map<string, (element?: IComponent) => void>>();
const mergeVariants = new Map<ComponentType, Map<string | typeof variantAll, ComponentType>>();

Object.defineProperty(Element.prototype, "extendedStyle", {
  get: function () {
    const el = this as Element;
    return {
      add(tag: string) {
        const tags = (el.getAttribute("tc-style") || "").split(/\s+/).filter(Boolean);
        if (!tags.includes(tag)) {
          tags.push(tag);
          el.setAttribute("tc-style", tags.join(" "));
        }
      },
      remove(tag: string) {
        const tags = (el.getAttribute("tc-style") || "").split(/\s+/).filter(Boolean);
        const i = tags.indexOf(tag);
        if (i !== -1) {
          tags.splice(i, 1);
          el.setAttribute("tc-style", tags.join(" "));
        }
      },
      has(tag: string) {
        return (el.getAttribute("tc-style") || "").split(/\s+/).filter(Boolean).includes(tag);
      },
      toggle(tag: string) {
        this.has(tag) ? this.remove(tag) : this.add(tag);
      },
      clear() {
        el.removeAttribute("tc-style");
      },
      toString() {
        return el.getAttribute("tc-style") || "";
      },
      getReferences() {
        return (el.getAttribute("tc-style") || "")
          .split(/\s+/)
          .filter(Boolean)
          .map((tag) => customElements.get(tag))
          .filter(Boolean);
      },
    };
  },
  configurable: true,
});

const controllerInjects = new Map<any, any>();
const injectService = Symbol("injectService");

const TypeComposer = {
  defineElement(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): void {
    if (customElements.get(name)) {
      return;
    }
    Component.mergeVariant(constructor, Object.getPrototypeOf(constructor.prototype).constructor);
    customElements.define(name, constructor, options);
  },
  createElement: (tag: any, props: any, ...children: any[]): any => {
    const isComponent = tag?.prototype instanceof Node;
    const parentElement = props?.[TypeComposer.parentComponentSymbol];
    if (props) {
      delete props[TypeComposer.parentComponentSymbol];
    }
    if (typeof tag === "string" || isComponent) {
      if (tag === "fragment") {
        const fragment = document.createDocumentFragment();
        fragment['onCreate'] = props?.onCreate || (() => {});
        fragment[parentComponentSymbol] = parentElement;
        for (const child of children) {
          if (Array.isArray(child)) {
            fragment.append(...child);
          } else if (child instanceof Node || typeof child === "string") {
            fragment.append(child);
          }
        }
        return fragment;
      }
      const key: { key: string; controller: { getCache: (key: string) => any; setCache: (key: string, value: any) => void } } = props?.key;
      const isValideKey = key && typeof key === "object" && key["controller"] && key["controller"]["getCache"] && key["controller"]["setCache"];
      if (isValideKey) {
        const cacheElement = key.controller.getCache(key.key);
        if (cacheElement) return cacheElement;
      }
      const onInit = props?.onInit;
      const style = props?.style;
      const refKey = props?.ref;
      const className = props?.className || props?.class;
 
      delete props?.className;
      delete props?.class;
      delete props?.onInit;
      delete props?.ref;
      delete props?.key;
      if (style) props.style = {};
      const ElementType: { [key: string]: any } = props || {};
      const el = isComponent ? new tag(ElementType) : document.createElement(tag);
      el[parentComponentSymbol] = parentElement;
      if (isValideKey) key.controller.setCache(key.key, el);
      if (style) el.setStyle(style);
      if (className) el.addClassName(className);
      if (refKey) refKey(el);
      Component.applyProps(el, ElementType);
      const appendChild = (parent: Element, child: any) => {
        if (child === null || child === undefined) return;
        if (child instanceof Function) {
          child = child();
        }
        if (child instanceof ref) {
          // @ts-ignore
          parent.append(child);
        } else if (Array.isArray(child)) {
          child.forEach((c) => appendChild(parent, c));
        } else if (child instanceof Node) {
          parent.appendChild(child);
        } else if (child !== null && child !== undefined) {
          parent.appendChild(document.createTextNode(child.toString()));
        }
      };

      children.forEach((c) => appendChild(el, c));
      if (onInit) onInit();
      return el;
    }

    return tag({ ...props, children });
  },
  createFragment: (...children: any[]): DocumentFragment => {
    const fragment = document.createDocumentFragment();
    fragment.append(...children);
    return fragment;
  },
  inject: <T extends new (...args: any[]) => any>(classType: T, type: InjectedType = InjectedType.ROOT, component?: Component, variantName?: string): InstanceType<T> => {
    if (!TypeComposer.injectServices.has(classType)) {
      throw new Error(`Service ${classType.name} is not registered. Please use the @Service decorator to register it.`);
    }
    if (type === InjectedType.ROOT) {
      if (controllerInjects.has(classType)) {
        return controllerInjects.get(classType);
      }
      const instance = new classType();
      controllerInjects.set(classType, instance);
      return instance;
    } else if (type === InjectedType.SELF) {
       const instance = new classType();
       if (component) {
        if (!component[injectService]) {
        component[injectService] = new Map<any, any>();
        }
        component[injectService].set(classType, instance);
       }
       return instance;
    } else {
       const findInject = (comp: Component) => {
        if (!comp) return null;
         const instance = comp[injectService]?.get(classType);
         if (instance) return instance;
         return findInject(comp[parentComponentSymbol]);
      };
      const instance = findInject(component!);
      if (instance && variantName && component) {
       Object.defineProperty(component, variantName, {
        value: instance,
        writable: false,
        enumerable: true,
        configurable: true,
      });
      }
      return instance;
    }
  },
  deepCopy: deepCopy,
  computed: computed,
  injectTemplate: (element: Component) => {
      if (element && element?.template && typeof element.template === "function") {
          const templateResult = element.template();
          if (templateResult) {
              element.append(templateResult);
          }
      }
  },
  initComponent: function (element: Node, parent: Node) {
     if (element instanceof Node && !element[parentComponentSymbol]) {
        // @ts-ignore
        element[parentComponentSymbol] = parent;
        // @ts-ignore
        element.onCreate?.();
        element.childNodes.forEach((node) => TypeComposer.initComponent(node, element));
    }
  },
  Fragment: "fragment",
  parentComponentSymbol: parentComponentSymbol,
  injectServices: new Set<any>(),
};

(globalThis as any).TypeComposer = TypeComposer;

export type AsyncComponentResolveResult<T = Component> =
  | T
  | {
      default: T;
    };

export type AsyncComponentLoader<T = any> = () => Promise<AsyncComponentResolveResult<T>>;

export const componentProps = Symbol("componentProps");

export class Component extends HTMLElement implements IComponent {
  static readonly TAG: string = "tc-component";

  constructor(props?: ElementType) {
    super();
    Component.initComponent(this, Component, props);
  }

  public static async applyProps<T extends HTMLElement>(element: T, props?: ElementType, ignoreStyle: boolean = false): Promise<void> {
    const hasProxy = Object.hasOwn(element.style, "styleRef");
    if (!hasProxy) {
      const style = element.style;
      // @ts-ignore
      style["styleRef"] = styleRef;
      const customStyle = new Proxy(style, {
        get(target, property: string) {
          const value = Reflect.get(target, property);
          return typeof value === "function" ? value.bind(target) : value;
        },
        set(target, property: string, value: any) {
          if (value instanceof ref) {
            // @ts-ignore
            value.subscribe(target, property);
          } else {
            // @ts-ignore
            Reflect.set(target, property, value);
          }
          return true;
        },
      }) as StyleProperties;
      Object.defineProperty(element, "style", {
        get: () => customStyle,
      });
    }
    if (props) {
      // @ts-ignore
      // const isStyle = props?.style !== undefined;
      for (const [key, propValue] of Object.entries(props)) {
        if (propValue === undefined || propValue === null) continue;
        switch (key) {
          case "key":
            (element as any).key = propValue;
            break;
          case "onInit":
            if (typeof propValue === "function") {
              (element as any).onInit = () => propValue();
            }
            break;
          case "style":
            (element as any).setStyle(propValue as StyleProperties);
            break;
          case "itemLoading":
            (element as any).setAttribute("item-loading", propValue as string);
            break;
          case "children":
            if (Array.isArray(propValue)) (element as any).append(...(propValue.filter(Boolean) as any));
            else (element as any).append(propValue as any);
            break;
          case "for":
            (element as any).setAttribute("for", propValue as string);
            break;
          case "className":
            element.addClassName(propValue as string);
            break;
          case "text":
            element.innerText = propValue as string;
            break;
          case "html":
            element.innerHTML = propValue as string;
            break;
          case "style":
            for (const [styleKey, styleValue] of Object.entries(propValue as StyleProperties)) {
              (element.style as any)[styleKey] = styleValue;
            }
            break;
          default:
            if (key in element && propValue) {
              try {
                (element as any)[key] = propValue;
                if (propValue === undefined) (element as any).removeAttribute(key);
              } catch {}
            }
        }
      }
    }
  }

  public static initComponent(thisObj: any, constructorObj: any, props?: ElementType): void {
    if (thisObj.constructor === constructorObj) {
      Component.applyProps(thisObj, thisObj[componentProps] || props);
      // if (thisObj?.template && typeof thisObj.template === "function") {
      //   const templateResult = thisObj.template();
      //   if (templateResult) {
      //     thisObj.append(templateResult);
      //   }
      // }
      thisObj?.onInit();
      if (thisObj[componentProps]) delete thisObj[componentProps];
      return;
    } else if (props) {
      thisObj[componentProps] = props;
    }
    Component.applyProps(thisObj, props);
  }

  public static createElement(html: string): HTMLElement {
    const element = document.createElement("div");
    element.innerHTML = html;
    return (element?.children[0] || element) as HTMLElement;
  }

  public static setVariant(element: ComponentType, variant: string, apply: (element: IComponent) => void): void {
    if (!variants.has(element)) {
      variants.set(element, new Map());
    }
    const map = variants.get(element);
    if (map) {
      map.set(variant, apply);
    }
  }

  public static getVariant(element: ComponentType, variant: string): ((element?: IComponent) => void) | undefined {
    const map = variants.get(element);
    let action: any = undefined;
    if (map) {
      action = map.get(variant);
    }
    if (!action) {
      const v = mergeVariants.get(element);
      if (!v) return action;
      const varia = v.get(variant) || v.get(variantAll);
      if (varia) return Component.getVariant(varia, variant);
    }
    return action;
  }

  public static getVariants(element: ComponentType): string[] {
    const map = variants.get(element);
    if (!map) return [];
    return Array.from(map.keys());
  }

  public static removeVariant(element: ComponentType, variant: string): void {
    const map = variants.get(element);
    if (map) {
      map.delete(variant);
    }
  }

  public static mergeVariant(element: ComponentType, src: ComponentType, ...variant: string[]) {
    if (!mergeVariants.has(element)) {
      mergeVariants.set(element, new Map());
    }
    const map = mergeVariants.get(element);
    if (map) {
      if (variant && variant.length) {
        for (const v of variant) map.set(v, src);
      } else map.set(variantAll, src);
    }
  }

  /**
   * 
   * @param source 
   * @param options
   * @example  Component.lazyLoad(() => import("./MyComponent"), { props: { foo: "bar" } });
   * @returns 
   */
  public static lazyLoad<T extends any>(
    source: AsyncComponentLoader<T>,
    options?: {
      props?: { [key: string]: any };
      fallback?: Component;
    }
  ): Component {
    const component = options?.fallback || new Component();
    source().then((module) => {
      // @ts-ignore
      const TestLazy = module.default;
      const parent = component.parentElement as HTMLElement;
      if (parent) {
        parent.replaceChild(new TestLazy(options?.props), component);
      }
    });
    return component;
  }
}

(globalThis as any).Component = Component;
TypeComposer.defineElement(Component.TAG, Component);

const isValideRef = (value: any) =>
  value &&
  typeof value === "object" &&
  (value instanceof RefString ||
    value instanceof RefNumber ||
    value instanceof RefBoolean ||
    value instanceof RefList ||
    value instanceof RefMap ||
    value instanceof RefSet);
const consolecheck = (callback: (message: any, ...optionalParams: any[]) => void, message?: any, ...optionalParams: any[]) => {
  if (isValideRef(message)) message = message.valueOf();
  for (let i = 0; i < optionalParams.length; i++) {
    if (isValideRef(optionalParams[i])) {
      optionalParams[i] = optionalParams[i].valueOf();
    }
  }
  callback(message, ...optionalParams);
};
const originalConsoleLog = console.log;
console.log = function (message?: any, ...optionalParams: any[]) {
  consolecheck(originalConsoleLog, message, ...optionalParams);
};

const originalConsoleError = console.error;
console.error = function (message?: any, ...optionalParams: any[]) {
  consolecheck(originalConsoleError, message, ...optionalParams);
};

const originalConsoleWarn = console.warn;
console.warn = function (message?: any, ...optionalParams: any[]) {
  consolecheck(originalConsoleWarn, message, ...optionalParams);
};

const originalConsoleInfo = console.info;
console.info = function (message?: any, ...optionalParams: any[]) {
  consolecheck(originalConsoleInfo, message, ...optionalParams);
};

WeakRef.prototype.equals = function (value: WeakRef<any>) {
  return this.deref() === value.deref();
};

Object.defineProperty(Element.prototype, "onInit", {
  value: function () {},
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "getElementById", {
  value: function (id: string): HTMLElement | null {
    return this.querySelector(`#${id}`);
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

function basePrototypeRefInjection<ElementPrototype>(prototype: ElementPrototype) {
  Object.defineProperty(prototype, "value", {
    get: function () {
      return this.valueOf();
    },
    set: function (value) {
      this.valueOf(value);
    },
  });
  Object.defineProperty(prototype, "subscribe", {
    value: function (target: (arg: string) => void): undefined {
      return undefined;
    },
  });
  Object.defineProperty(prototype, "unsubscribe", {
    value: function (target: (arg: string) => void): undefined {
      return undefined;
    },
  });
}

basePrototypeRefInjection(String.prototype);
basePrototypeRefInjection(Number.prototype);
basePrototypeRefInjection(Boolean.prototype);
basePrototypeRefInjection(Array.prototype);
basePrototypeRefInjection(Map.prototype);
basePrototypeRefInjection(Set.prototype);

function componentInjectionValue<ElementPrototype>(prototype: ElementPrototype) {
  const original = Object.getOwnPropertyDescriptor(prototype, "value");
  if (!original) return;
  Object.defineProperty(prototype, "value", {
    set: function (value: refString) {
      if (value instanceof ref) {
        // @ts-ignore
        const onInput = () => (value.value = this.value);
        this.addEventListener("input", onInput);
        value.subscribe(this, "value", () => this.removeEventListener("input", onInput));
      } else {
        original.set.call(this, value);
      }
    },
  });
}

function componentInjectionChecked<ElementPrototype>(prototype: ElementPrototype) {
  const original = Object.getOwnPropertyDescriptor(prototype, "checked");
  if (!original) return;
  Object.defineProperty(prototype, "checked", {
    set: function (value: refBoolean) {
      if (value instanceof ref) {
        const onInput = () => (value.value = this.checked);
        this.addEventListener("input", onInput);
        this.subscribe(this, "checked", () => this.removeEventListener("input", onInput));
      } else {
        original.set.call(this, value);
      }
    },
  });
}

function componentInjectionDisabled<ElementPrototype>(prototype: ElementPrototype) {
  Object.defineProperty(prototype, "disabled", {
    get: function () {
      return this.hasAttribute("disabled");
    },
    set: function (value: refBoolean) {
      if (value instanceof ref) value.subscribe(this, "disabled");
      else {
        if (value) this.setAttribute("disabled", "");
        else this.removeAttribute("disabled");
      }
    },
  });
}

function componentInjectionHidden<ElementPrototype>(prototype: ElementPrototype) {
  Object.defineProperty(prototype, "hidden", {
    get: function () {
      return this.hasAttribute("hidden");
    },
    set: function (value: refBoolean) {
      if (value instanceof ref) value.subscribe(this, "hidden");
      else {
        if (value) this.setAttribute("hidden", "");
        else this.removeAttribute("hidden");
      }
    },
  });
}

function isWritable(descriptor) {
  if (!descriptor || typeof descriptor?.value == "function") {
    return false;
  }

  if ("value" in descriptor) {
    return !!descriptor.writable;
  }

  if ("get" in descriptor || "set" in descriptor) {
    return typeof descriptor.set === "function";
  }

  return false;
}

function componentInjectionVariableController<ElementPrototype>(prototype: ElementPrototype, propertyName: PropertyKey) {
  const original = getOwnPropertyDescriptor(prototype, propertyName);
  if (!isWritable(original)) return;
  Object.defineProperty(prototype, propertyName, {
    set: function (value: any) {
      if (value instanceof ref) {
        (value as ref).subscribe(this, propertyName?.toString());
      } else original.set.call(this, value?.valueOf());
    },
  });
}

function getOwnPropertyDescriptor(prototype: any, propertName: PropertyKey): PropertyDescriptor | undefined {
  if (prototype == null) return undefined;
  const d = Object.getOwnPropertyDescriptor(prototype, propertName) || getOwnPropertyDescriptor(Object.getPrototypeOf(prototype), propertName);
  return d;
}

function componentInjectionController<ElementPrototype>(prototype: ElementPrototype, propertNames?: PropertyKey[]) {
  if (propertNames == undefined) propertNames = Object.getOwnPropertyNames(prototype);
  if (!propertNames.includes("disabled")) componentInjectionDisabled(prototype);
  if (!propertNames.includes("hidden")) componentInjectionHidden(prototype);
  for (const propertName of propertNames) {
    if (propertName == "value") componentInjectionValue(prototype);
    else if (propertName == "checked") componentInjectionChecked(prototype);
    else componentInjectionVariableController(prototype, propertName);
  }
}

componentInjectionController(Element.prototype);
componentInjectionController(HTMLElement.prototype);
componentInjectionController(HTMLButtonElement.prototype);
componentInjectionController(HTMLInputElement.prototype);
componentInjectionController(HTMLTextAreaElement.prototype);
componentInjectionController(HTMLImageElement.prototype);

Object.defineProperty(Element.prototype, "variant", {
  get: function () {
    return this.getAttribute("variant") || "default";
  },
  set: function (v: "default" | string) {
    // @ts-ignore
    if (v instanceof ref) {
      // @ts-ignore
      v.subscribe(this, "variant");
    } else {
      v = v?.toString()?.trim() || "default";
      if (v == "default" || v == undefined || v.trim().length == 0) this.removeAttribute("variant");
      else {
        this.setAttribute("variant", v);
      }
      Component.getVariant(this.constructor as ComponentType, v)?.(this);
    }
  },
});

Object.defineProperty(Element.prototype, "connectedCallback", {
  value: function () {
    this.dispatchEvent(new CustomEvent("onConnected", { bubbles: false, cancelable: true }));
    this?.onConnected();
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "disconnectedCallback", {
  value: function () {
    this.dispatchEvent(new CustomEvent("onDisconnected", { bubbles: false, cancelable: true }));
    this?.onDisconnected();
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(window, "scoped", {
  value: function (target: any): any {},
  writable: true,
  configurable: true,
  enumerable: true,
});

try {
  const originalButton = Object.getOwnPropertyDescriptor(HTMLButtonElement.prototype, "type").set;

  Object.defineProperty(HTMLButtonElement.prototype, "onfile", {
    value: function (this: HTMLButtonElement, fileList: FileList) {},
    writable: true,
    configurable: true,
    enumerable: true,
  });

  Object.defineProperty(HTMLButtonElement.prototype, "accept", {
    get: function () {
      return this.getAttribute("accept") || "";
    },
    set: function (value: string) {
      this.setAttribute("accept", value);
    },
  });

  Object.defineProperty(HTMLButtonElement.prototype, "multiple", {
    get: function () {
      return this.hasAttribute("multiple");
    },
    set: function (value: boolean) {
      if (value) this.setAttribute("multiple", "");
      else this.removeAttribute("multiple");
    },
  });

  Object.defineProperty(HTMLButtonElement.prototype, "type", {
    set: function (value: "submit" | "reset" | "button" | "file") {
      if (this.__onButtonFile__) {
        if (this.__input_file__) this.removeChild(this.__input_file__);
        this.__input_file__ = undefined;
        this.removeEventListener("click", this.__onButtonFile__);
      }
      if (value == "file") {
        this.__input_file__ = new InputElement({ type: "file", style: { display: "none" } });
        this.__input_file__.onchange = (event: any) => {
          this.onfile(event.target.files);
          event.stopPropagation();
          event.preventDefault();
        };
        this.__input_file__.onclick = (event: any) => {
          this.removeChild(this.__input_file__);
          event.stopPropagation();
        };
        this.__onButtonFile__ = () => {
          this.__input_file__.accept = this.accept;
          this.__input_file__.multiple = this.multiple;
          this.appendChild(this.__input_file__);
          this.__input_file__.click();
        };
        this.addEventListener("click", this.__onButtonFile__);
      }
      originalButton.call(this, value);
    },
  });
} catch (__) {}

Object.defineProperty(Element.prototype, "onInit", {
  value: function () {},
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "getParent", {
  value: function (): HTMLElement | null {
    return this.parentElement;
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "onConnected", {
  value: function () {},
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "onDisconnected", {
  value: function () {},
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "onCreate", {
  value: function () {},
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "addClassName", {
  value: function (...names: string[]) {
    for (const name of names) {
      const strs = name.match(/\S+/g) || [];
      if (strs.length > 0) this.classList.add(...strs);
    }
  },
  writable: true,
  configurable: true,
  enumerable: true,
});
// remove class
Object.defineProperty(Element.prototype, "removeClassName", {
  value: function (...names: string[]) {
    for (const name of names) {
      const strs = name.match(/\S+/g) || [];
      if (strs.length > 0) this.classList.remove(...strs);
    }
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "setStyle", {
  value: function (style: StyleProperties) {
    for (const [key, value] of Object.entries(style)) {
      (this.style as any)[key] = value;
    }
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "onEvent", {
  value: function (type: string, listener: EventHandler, options?: boolean | AddEventListenerOptions | undefined): void {
    EventComponent.addEventListener(this, type, listener, options);
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "createEvent", {
  value: function (type: string, ...data: any[]): boolean {
    return EventComponent.createEvent(type, ...data);
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "removeEvent", {
  value: function (type: string): void {
    EventComponent.removeEventListener(this, type);
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "removeEvents", {
  value: function (): void {
    EventComponent.removeEventListeners(this);
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "emitEvent", {
  value: function (type: string, ...params: any[]): boolean {
    return EventComponent.emitEvent(type, ...params);
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperty(Element.prototype, "deleteEvent", {
  value: function (type: string): void {
    EventComponent.deleteEvent(type);
  },
  writable: true,
  configurable: true,
  enumerable: true,
});

function replaceElements(parentNode: HTMLElement, start: Comment, end: Comment, newElements: (HTMLElement | string)[]): void {
  const childNodes = Array.from(parentNode.childNodes);
  const startIndex = childNodes.indexOf(start);
  const endIndex = childNodes.indexOf(end);
  if (!Array.isArray(newElements)) newElements = [newElements];
  // @ts-ignore
  newElements = newElements.filter(Boolean).map((e) => (e instanceof Node ? e : document.createTextNode(e?.toString() || e)));
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return;

  const existingElements = childNodes.slice(startIndex + 1, endIndex);
  const removeElements = existingElements.filter((e) => !newElements.find((ne) => ne === e));
  const keepElements = existingElements.filter((e) => newElements.find((ne) => ne === e));
  const actions: { element: HTMLElement; action: "keep" | "insert"; before: any }[] = [];
  for (const element of removeElements) element.remove();
  for (const [index, element] of newElements.entries()) {
    if (!element) continue;
    // const indexInKeep = getIndexInKeepElements(element, keepElements);
    // const indexInNew = newElements.length - newElements.indexOf(element);
    actions.unshift({
      element: element as HTMLElement,
      action: keepElements[index] === element ? "keep" : "insert",
      before: newElements[index + 1] ? newElements[index + 1] : end,
    });
  }
  for (const action of actions) {
    const { element, action: act, before } = action;
    if (act === "keep") continue;
    if (act === "insert") parentNode.insertBefore(element, before);
  }
}
const originalAppend = Element.prototype.append;
// append
Element.prototype.append = function (...nodes: (Node | string | ref)[]) {
  for (const node of nodes) {
    if (this.isConnected && node instanceof Node && !node[parentComponentSymbol]) {
        // @ts-ignore
        node[parentComponentSymbol] = this;
        // @ts-ignore
        node.onCreate?.();
    }
  }
  const isRef = nodes.find((node) => node instanceof ref);
  if (isRef) {
    for (const n of nodes) {
      if (n instanceof ref) {
        const r: ref<HTMLElement[]> = n as ref<HTMLElement[]>;
        const start = new Comment(`ref:${r.id}:start`);
        const end = new Comment(`ref:${r.id}:end`);
        originalAppend.call(this, start, end);
        r.subscribe((value) => replaceElements(this, start, end, value));
      } else {
        originalAppend.call(this, n as any);
      }
    }
  } else originalAppend.call(this, ...nodes);
};

const originalAppendFragment = DocumentFragment.prototype.append;
DocumentFragment.prototype.append = function (...nodes: (Node | string | ref)[]) {
  for (const node of nodes) {
    if (this.isConnected && node instanceof Node && !node[parentComponentSymbol]) {
      // @ts-ignore
      node[parentComponentSymbol] = this;
      // @ts-ignore
      node.onCreate?.();
    }
  }
 originalAppendFragment.call(this, ...nodes);
};

const originalPrependFragment = DocumentFragment.prototype.prepend;
DocumentFragment.prototype.prepend = function (...nodes: (Node | string | ref)[]) {
  for (const node of nodes) {
    if (this.isConnected && node instanceof Node && !node[parentComponentSymbol]) {
      // @ts-ignore
      node[parentComponentSymbol] = this;
      // @ts-ignore
      node.onCreate?.();
    }
  }
  originalPrependFragment.call(this, ...nodes);
};

const originalPrepend = Element.prototype.prepend;
Element.prototype.prepend = function (...nodes: (Node | string | ref)[]) {
  for (const node of nodes) {
    if (this.isConnected && node instanceof Node && !node[parentComponentSymbol]) {
      // @ts-ignore
      node[parentComponentSymbol] = this;
      // @ts-ignore
      node.onCreate?.();
    }
  }
  originalPrepend.call(this, ...nodes);
};

const originalAppendChild = Element.prototype.appendChild;

Element.prototype.appendChild = function <T extends Node>(node: T): T {
  if (node instanceof Element && !node[parentComponentSymbol]) {
    // @ts-ignore
    node[parentComponentSymbol] = this;
    // @ts-ignore
    node.onCreate?.();
  }
  return originalAppendChild.call(this, node);
}

const originalInsertBefore = Element.prototype.insertBefore;

Element.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
  if (newNode instanceof Element && !newNode[parentComponentSymbol]) {
    // @ts-ignore
    newNode[parentComponentSymbol] = this;
    // @ts-ignore
    newNode.onCreate?.();
  }
  return originalInsertBefore.call(this, newNode, referenceNode);
};

//replaceChild
const originalReplaceChild = Element.prototype.replaceChild;
// @ts-ignore
Element.prototype.replaceChild = function <T extends Node>(newChild: T, oldChild: Node): T {
  if (newChild instanceof Element && !newChild[parentComponentSymbol]) {
    // @ts-ignore
    newChild[parentComponentSymbol] = this;
    // @ts-ignore
    newChild.onCreate?.();
  }
  return originalReplaceChild.call(this, newChild, oldChild);
}

// replaceWith
const originalReplaceWith = Element.prototype.replaceWith;
Element.prototype.replaceWith = function (...nodes: (Node | string | ref)[]) {
  for (const node of nodes) {
    if (this.isConnected && node instanceof Node && !node[parentComponentSymbol]) {
      // @ts-ignore
      node[parentComponentSymbol] = this.parentElement;
      // @ts-ignore
      node.onCreate?.();
    }
  }
  originalReplaceWith.call(this, ...nodes);
};

// insertBefore
const originalInsertAdjacentElement = Element.prototype.insertAdjacentElement;
Element.prototype.insertAdjacentElement = function (position: InsertPosition, element: Element): Element | null {
  if (this.isConnected && element instanceof Node && !element[parentComponentSymbol]) {
    // @ts-ignore
    element[parentComponentSymbol] = this;
    // @ts-ignore
    element.onCreate?.();
  }
  return originalInsertAdjacentElement.call(this, position, element);
};

// before
const originalBefore = Element.prototype.before;
Element.prototype.before = function (...nodes: (Node | string | ref)[]) {
  for (const node of nodes) {
    if (this.isConnected && node instanceof Node && !node[parentComponentSymbol]) {
      // @ts-ignore
      node[parentComponentSymbol] = this.parentElement;
      // @ts-ignore
      node.onCreate?.();
    }
  }
  originalBefore.call(this, ...nodes);
}

// after
const originalAfter = Element.prototype.after;
Element.prototype.after = function (...nodes: (Node | string | ref)[]) {
  for (const node of nodes) {
    if (this.isConnected && node instanceof Node && !node[parentComponentSymbol]) {
      // @ts-ignore
      node[parentComponentSymbol] = this.parentElement;
      // @ts-ignore
      node.onCreate?.();
    }
  }
  originalAfter.call(this, ...nodes);
};

Window.prototype.getTheme = function (): string {
  return localStorage.getItem("theme") || "light";
};

Window.prototype.setTheme = function (theme: string): void {
  const html = document.querySelector("html");
  html?.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

Array.prototype.clear = function () {
  this.length = 0;
};

{
  Object.defineProperty(SVGElement.prototype, "complete", {
    value: false,
    writable: true,
    configurable: true,
    enumerable: true,
  });

  Object.defineProperty(SVGElement.prototype, "src", {
    get: function () {
      return this.getAttribute("src") || "";
    },
    set: function (value: string) {
      if (value) this.setAttribute("src", value);
      else this.removeAttribute("src");
    },
  });
}

export interface HTMLComponent {
  style?: StyleProperties;
  ref?: HTMLElement;
  children?: Node[];
  className?: string | ref<string>;
  onabort?: (event: UIEvent) => void;
  onauxclick?: (event: MouseEvent) => void;
  onbeforeinput?: (event: InputEvent) => void;
  onblur?: (event: FocusEvent) => void;
  oncanplay?: (event: Event) => void;
  oncanplaythrough?: (event: Event) => void;
  onchange?: (event: Event) => void;
  onclick?: (event: MouseEvent) => void;
  onclose?: (event: Event) => void;
  oncontextmenu?: (event: MouseEvent) => void;
  oncopy?: (event: ClipboardEvent) => void;
  oncuechange?: (event: Event) => void;
  oncut?: (event: ClipboardEvent) => void;
  ondblclick?: (event: MouseEvent) => void;
  ondrag?: (event: DragEvent) => void;
  ondragend?: (event: DragEvent) => void;
  ondragenter?: (event: DragEvent) => void;
  ondragleave?: (event: DragEvent) => void;
  ondragover?: (event: DragEvent) => void;
  ondragstart?: (event: DragEvent) => void;
  ondrop?: (event: DragEvent) => void;
  ondurationchange?: (event: Event) => void;
  onemptied?: (event: Event) => void;
  onended?: (event: Event) => void;
  onerror?: (event: Event) => void;
  onfocus?: (event: FocusEvent) => void;
  onformdata?: (event: FormDataEvent) => void;
  oninput?: (event: InputEvent) => void;
  oninvalid?: (event: Event) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  onkeypress?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;
  onload?: (event: Event) => void;
  onloadeddata?: (event: Event) => void;
  onloadedmetadata?: (event: Event) => void;
  onloadstart?: (event: Event) => void;
  onmousedown?: (event: MouseEvent) => void;
  onmouseenter?: (event: MouseEvent) => void;
  onmouseleave?: (event: MouseEvent) => void;
  onmousemove?: (event: MouseEvent) => void;
  onmouseout?: (event: MouseEvent) => void;
  onmouseover?: (event: MouseEvent) => void;
  onmouseup?: (event: MouseEvent) => void;
  onpaste?: (event: ClipboardEvent) => void;
  onpause?: (event: Event) => void;
  onplay?: (event: Event) => void;
  onplaying?: (event: Event) => void;
  onprogress?: (event: ProgressEvent) => void;
  onratechange?: (event: Event) => void;
  onreset?: (event: Event) => void;
  onresize?: (event: UIEvent) => void;
  onscroll?: (event: Event) => void;
  onsecuritypolicyviolation?: (event: SecurityPolicyViolationEvent) => void;
  onseeked?: (event: Event) => void;
  onseeking?: (event: Event) => void;
  onselect?: (event: Event) => void;
  onslotchange?: (event: Event) => void;
  onstalled?: (event: Event) => void;
  onsubmit?: (event: SubmitEvent) => void;
  onsuspend?: (event: Event) => void;
  ontimeupdate?: (event: Event) => void;
  ontoggle?: (event: Event) => void;
  onvolumechange?: (event: Event) => void;
  onwaiting?: (event: Event) => void;
  onwheel?: (event: WheelEvent) => void;
  [key: string]: any;
}

// const Fetch: {
// 	defaultHeaders?: HeadersInit | (() => HeadersInit);
// 	defaultCredentials?: RequestCredentials;
// 	//interceptors?: {
// 	//	request?: (request: Request) => Request;
// 	//	response?: (response: Response) => Response;
// 	//};
// 	invalidateCache: (key: string) => void;
// } = {
// 	defaultHeaders: undefined,
// 	invalidateCache(key: string) {
// 		if (key) {
// 			localStorage.removeItem(key);
// 		}
// 	}
// };

// (globalThis as any).Fetch = Fetch;
// (window as any).Fetch = Fetch;

// const orinalFetch = window.fetch;
// // @ts-ignore
// window.fetch = async (input: RequestInfo | ref<string>, init?: RequestInit): Promise<Response> => {
// 	const cache: { type: RequestCache | "localstorage" } = {
// 		type: init?.cache || "default",
// 	}
// 	if (input instanceof ref) {
// 		const _ref = input as ref<string>;
// 		_ref.subscribe((endpoint) => {
// 			endpoint && fetch(endpoint, init);
// 		})
// 		return null;
// 	}
// 	if (cache.type === "localstorage")
// 		delete init.cache;
// 	if (init?.params) {
// 		const params = new URLSearchParams();
// 		for (const key in init.params) {
// 			params.append(key, init.params[key]);
// 		}
// 		if (input instanceof Request) {
// 			input = new Request(input, { ...init, params });
// 		} else if (typeof input === "string") {
// 			input = new Request(`${input}${params.size ? '?' : ''}${params.toString()}`, init);
// 		}
// 	}

// 	const headers = Fetch?.defaultHeaders ? typeof Fetch.defaultHeaders === "function" ? Fetch?.defaultHeaders() : Fetch.defaultHeaders : {};
// 	const response = await orinalFetch(input, { headers: headers, credentials: Fetch?.defaultCredentials, ...(init || {}) });

// 	const { refKey } = init || {};
// 	if (refKey && response.ok) {
// 		const clone = response.clone();
// 		const contentType = response.headers.get('content-type');
// 		let data = "";
// 		if (contentType && contentType.includes('application/json')) {
// 			data = await clone.json();
// 		} else {
// 			data = await clone.text();
// 		}
// 		data = init.transform ? init.transform(data) : data;
// 		if (cache.type === "localstorage") {
// 			localStorage.setItem(input.toString(), data);
// 		}
// 		const _ref: ref = Ref.get(refKey);
// 		if (!_ref) {
// 			ref(data, refKey);
// 		} else {
// 			_ref.value = data;
// 		}
// 		// @ts-ignore
// 		Ref.getStatus(refKey).value = clone.status.toString();
// 	}
// 	return response;
// };

String.prototype.toNumber = function (): number {
  // @ts-ignore
  return new Number(this).valueOf();
};

String.prototype.toInt = function (radix?: number): number {
  // @ts-ignore
  return parseInt(this, radix);
};

String.prototype.toDate = function (): Date {
  // @ts-ignore
  return new Date(this);
};

import { __App__ } from "./app";
export * from "../core/ref";

export type App = __App__;
export const App = new __App__();

export {};
