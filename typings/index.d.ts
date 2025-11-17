import type * as CSS from "csstype";
import { refString } from "src";

type ref<T = any> = {
  value: refObject<T>;
  subscribe(target: (arg: T) => void): boolean;
  subscribe(target: (arg: T) => void, onUnsubscribe?: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe?: Function): boolean;
  subscribe(target: object | refFunction<T>, propertyName: string | symbol | Function, onUnsubscribe?: Function): boolean;
  unsubscribe(target: refFunction<T>): boolean;
  unsubscribe(target: object, propertyName: string | symbol): boolean;
  unsubscribe(target: object | refFunction<T>, propertyName: string | symbol): boolean;
  valueOf(): T;
  toString(): string;
  toJSON(): DynamicJSON<T>;
};

interface BaseRef<T> {
  value: T;
  subscribe(target: (arg: T) => void): boolean;
  subscribe(target: (arg: T) => void, onUnsubscribe?: Function): boolean;
  subscribe(target: object, propertyName: string | symbol): boolean;
  subscribe(target: object, propertyName: string | symbol, onUnsubscribe?: Function): boolean;
  subscribe(target: object | refFunction<T>, propertyName: string | symbol | Function, onUnsubscribe?: Function): boolean;
  unsubscribe(target: refFunction<T>): boolean;
  unsubscribe(target: object, propertyName: string | symbol): boolean;
  unsubscribe(target: object | refFunction<T>, propertyName: string | symbol): boolean;
  valueOf(): T;
  toString(): string;
  toJSON(): DynamicJSON<T>;
}

type StyleProperties = {
  [K in keyof CSS.Properties]?: CSS.Properties[K] | Ref<CSS.Properties[K]>;
} & {
  [K in keyof CSS.PropertiesHyphen]?: CSS.PropertiesHyphen[K] | Ref<CSS.PropertiesHyphen[K]>;
};

interface StylePropertiesMethods {
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/getPropertyPriority) */
  getPropertyPriority(property: string): string | ref<string>;
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/getPropertyValue) */
  getPropertyValue(property: string): string | ref<string>;
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/item) */
  item(index: number): string | ref<string>;
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/removeProperty) */
  removeProperty(property: string): string | ref<string>;
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/setProperty) */
  setProperty(property: string, value: string | ref<string> | null, priority?: string): void;
  [index: number]: string | ref<string>;
  hasOwnProperty(key: string): boolean;
}

declare global {
  const TypeComposer: {
    createElement: (tag: (props: T) => any, props: { T; test: string }, ...children: any[]) => any;
    createFragment: (...children: any[]) => DocumentFragment;
    defineElement(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): void;
    deepCopy: <T>(value: T) => T;
    inject: <T extends new (...args: any[]) => any>(classType: T) => InstanceType<T>;
    Fragment: string;
  };

  type TypeComposer = typeof TypeComposer;

  function C(fn: TemplateStringsArray, ...values: any[]): refString;

  interface HTMLComponent {
    style?: StyleProperties;
    ref?: HTMLElement;
    children?: HTMLElement[] | HTMLElement | string | ref<string>;
    className?: string | ref<string>;
    [key: string]: any;
    onInit?: () => void;
    onCreate?: () => void;
    onclick?: (event: MouseEvent) => void;
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
  }

  function forEach<T = any>(items: refList<T>, callbackfn: (value: T, index: number) => HTMLElement): HTMLFragment;

  interface Fragment {
    public static forEach<T = any>(items: refList<T>, callbackfn: (value: T, index: number) => HTMLElement): Fragment;
    public static condition(condition: () => any, references: any[]): HTMLElement;
  }

  type JSXElementConstructor<P> =
    | ((
      props: P,
      /**
       * @deprecated
       *
       * @see {@link https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-stateless-function-components React Docs}
       */
      deprecatedLegacyContext?: any
    ) => ReactNode)
    | (new (
      props: P,
      /**
       * @deprecated
       *
       * @see {@link https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods React Docs}
       */
      deprecatedLegacyContext?: any
    ) => Component<any, any>);

  interface TypecomposerElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: string | null;
  }

  namespace JSX {
    type Element = HTMLElement;

    interface Component extends TypecomposerElement<any, any> { }

    interface IntrinsicElements {
      [elemName: string]: HTMLComponent;
      fragment: { onCreate?: () => void; onInit?: () => void; };
    }
  }

  type CSSStyleDeclarationRef = StyleProperties &
    StylePropertiesMethods & {
      readonly parentElement: HTMLElement;
    };

  var CSSStyleDeclarationRef: {
    prototype: CSSStyleDeclarationRef;
    new(): CSSStyleDeclarationRef;
  };

  interface CSSStyleDeclaration {
    parentElement: HTMLElement;
  }

  interface ComponentEvent extends Event { }

  interface RouterEvent extends ComponentEvent {
    payload: Error;
    url: string;
  }

  interface ComponentEventMap {
    "router:beforeLeave": RouterEvent;
    "router:beforeEnter": RouterEvent;
    "router:beforeUpdate": RouterEvent;
    "router:watch": RouterEvent;
  }

  interface HTMLElementEventMap extends ElementEventMap, GlobalEventHandlersEventMap {
    onConnected: ComponentEvent;
    onDisconnected: ComponentEvent;
  }

  interface SVGElement {
    readonly complete: boolean;
    src?: string;
  }

  interface Array<T> {
    clear(): void;
  }

  interface Event {
    detail: any;
  }

  function scoped(target: any): any;

  function deepCopy<T>(value: T): T;

  interface Window {
    getTheme(): string;
    setTheme(theme: string): void;
  }

  interface ExtendedStyleToken {
    add(tag: string): void;
    remove(tag: string): void;
    has(tag: string): boolean;
    toggle(tag: string): void;
    clear(): void;
    getReferences(): CustomElementConstructor[];
    toString(): string;
  }

  interface Element {
    innerHTML: refString | refNumber | IComponent;
    innerText: refString | string | refNumber | number;
    style: CSSStyleDeclarationRef;
    variant: refString | undefined;
    disabled: refBoolean | boolean;
    className: refString | string;
    hidden: refBoolean | boolean;
    key: string | symbol;
    readonly extendedStyle: ExtendedStyleToken;
    onInit(): void;
    onCreate(): void;
    template(): HTMLElement;
    append(...nodes: (Node | string | ref)[]): void;
    addClassName(...names: string[]): void;
    removeClassName(...names: string[]): void;
    setStyle(styles: StyleProperties): void;
    onConnected(): void;
    onDisconnected(): void;
    onEvent<K extends string>(type: K | keyof ComponentEventMap, listener: EventHandler, options?: boolean | AddEventListenerOptions | undefined): void;
    createEvent<K extends string>(type: K | keyof ComponentEventMap, ...data: any[]): boolean;
    removeEvent<K extends string>(type: K | keyof ComponentEventMap): void;
    removeEvents(): void;
    emitEvent<K extends string>(type: K | keyof ComponentEventMap, ...params: any[]): boolean;
    deleteEvent<K extends string>(type: K | keyof ComponentEventMap): void;
    getParent<T extends Element = HTMLElement>(): T | null;
  }

  interface HTMLElement extends Element {
    innerHTML: refString | refNumber | IComponent;
  }

  interface IComponent extends HTMLElement {
    innerHTML: refString | refNumber | IComponent;
    onCreate(): void;
    onInit(): void;
    template(): HTMLElement;
  }

  interface IComponentConstructor {
    readonly TAG: string;
    new(...args: any[]): IComponent;
  }

  type ComponentType = typeof HTMLElement;

  interface HTMLButtonElement extends HTMLElement {
    // @ts-ignore
    type: "submit" | "reset" | "button" | "file";
    accept: string;
    multiple: refBoolean;
    onfile: ((this: GlobalEventHandlers, file: FileList) => any) | null;
  }

  interface WeakRef<T> {
    equals<K extends WeakKey>(value: WeakRef<K>): boolean;
  }

  interface HTMLInputElement {
    public value?: string | refString;
    checked: boolean | ref<boolean>;
  }

  interface InputElement extends HTMLInputElement {
    public value?: string | refString;
  }

  interface HTMLTextAreaElement {
    public value?: string | refString;
  }

  interface TextAreaElement extends HTMLTextAreaElement {
    public value?: string | refString;
  }

  interface HTMLImageElement {
    src: string | ref<string>;
    alt: string | ref<string>;
  }

  interface String extends BaseRef<string> {
    toNumber(): number;
    toInt(radix?: number): number;
    toDate(): Date;
  }
  interface Number extends BaseRef<number> { }
  interface Boolean extends BaseRef<boolean> { }
  interface Array<T> extends BaseRef<T[]> { }
  interface Map<K, V> extends BaseRef<Map<K, V>> { }
  interface Set<T> extends BaseRef<Set<T>> { }

  interface RequestInit {
    /** A string to set request's priority. */
    refKey?: string;
    /** A function to parse the response. */
    transform?: (data: any) => any;
    /** A function to parse the response. */
    params?: Record<string, any>;
    cache?: RequestCache | "localstorage" | "session-storage" | "cookie";
  }

  function fetch(input: RequestInfo | URL | ref<string>, init?: RequestInit): Promise<Response>;

  const Fetch: {
    defaultHeaders?: HeadersInit | (() => HeadersInit);
    defaultCredentials?: RequestCredentials;
  };

  type Fetch = typeof Fetch;
}

// @data-start;
declare const Translation: {};

type Translation = typeof Translation;
// @data-end;

declare module "*.svg" {
  const createSvgElement: (props: ElementType) => SVGElement;
  export default createSvgElement;
}

export { };
