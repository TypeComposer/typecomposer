import { Component, ref, refBoolean, refNumber, refString } from "../";
import type * as CSS from "csstype";

export type Variant = "default" | "outline" | "solo" | "standard" | "underlined";

export type StyleProperties = {
  [K in keyof CSS.Properties]?: CSS.Properties[K] | ref<CSS.Properties[K]> | ref<string>;
} & {
  [K in keyof CSS.PropertiesHyphen]?: CSS.PropertiesHyphen[K] | ref<CSS.PropertiesHyphen[K]> | ref<string>;
};

export type ComponentMethods<T> = Omit<
  Partial<{
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K] | undefined;
  }>,
  | "style"
  | "className"
  | "toString"
  | "id"
  | "title"
  | "text"
  | "html"
  | "readOnly"
  | "hidden"
  | "variant"
  | "itemLoading"
  | "disabled"
  | "innerText"
  | "children"
  | "translate"
  | "contentEditable"
  | "parentElement"
  | "parentNode"
> & {
  id?: refString;
  title?: refString;
  key?: string | symbol;
  className?: refString;
  text?: refString | refNumber | refBoolean;
  html?: refString | refNumber | refBoolean;
  readOnly?: refBoolean | boolean;
  hidden?: refBoolean | boolean;
  variant?: refString;
  itemLoading?: boolean;
  disabled?: refBoolean;
  children?: (Node | null | undefined)[] | Node | string | undefined;
  innerHTML?: refString | refNumber | refBoolean | Node;
  innerText?: refString | refNumber | refBoolean | Node;
  ref?: HTMLElement;
  onInit?: () => void;
  onCreate?: () => void;
};

export type ElementType<T = HTMLElement, K extends keyof any = ""> = Omit<{ style?: StyleProperties } & ComponentMethods<T>, K>;

interface StylePropertiesMethods {
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/getPropertyPriority) */
  getPropertyPriority(property: string): refString;
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/getPropertyValue) */
  getPropertyValue(property: string): refString;
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/item) */
  item(index: number): refString;
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/removeProperty) */
  removeProperty(property: string): refString;
  /** [MDN reference](https://developer.mozilla.org/docs/Web/API/CSSStyleDeclaration/setProperty) */
  setProperty(property: string, value: refString | null, priority?: string): void;
  [index: number]: refString;

  hasOwnProperty(key: string): boolean;
}

export type CSSStyleDeclarationRef = StyleProperties & StylePropertiesMethods;

const removePropertyOriginal = CSSStyleDeclaration.prototype.removeProperty;

Object.defineProperty(CSSStyleDeclaration.prototype, "removeProperty", {
  value: function (property: string) {
    removePropertyOriginal.call(this, property);
  },
  writable: true,
  configurable: true,
});

const setPropertyOriginal = CSSStyleDeclaration.prototype.setProperty;

Object.defineProperty(CSSStyleDeclaration.prototype, "setProperty", {
  value: function (property: string, value: refString | null, priority?: string) {
    if (value instanceof ref) value.subscribe(this, property);
    else setPropertyOriginal.call(this, property, value, priority);
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(CSSStyleDeclaration.prototype, "hasOwnProperty", {
  value: function (key: string) {
    return Object.prototype.hasOwnProperty.call(this, key);
  },
  writable: true,
  configurable: true,
});
