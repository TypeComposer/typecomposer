import { RefString } from ".";

export function refProperty(value?: string, propertyName?: string): RefString;
export function refProperty(value?: string, propertyName?: string, target?: HTMLElement) {
  if (!target) throw new Error("refProperty: needs to be inside a component");
  const ref = new RefString(value || target?.getAttribute(propertyName) || "");
  // @ts-ignore
  ref.propertyName = propertyName;
  ref.subscribe((value) => {
    // @ts-ignore
    if (target?.getAttribute(ref.propertyName) === value) return;
    // @ts-ignore
    target.setAttribute(ref.propertyName, value || "");
  });
  createObserver(target, ref);
  return ref;
}

Object.defineProperty(refProperty, Symbol.hasInstance, {
  value: function (instance: any): boolean {
    return !!instance && (instance instanceof RefString);
  },
});

function createObserver(target: HTMLElement, ref: RefString): MutationObserver {
  if (target["___observer___"]) {
    const ___refs___: RefString[] = target["___observer___"]["___refs___"];
    ___refs___.push(ref);
    return target["___observer___"];
  }
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const items = observer["___refs___"];
      if (mutation.attributeName) {
        for (const ref of items) {
          if (mutation.attributeName === ref.propertyName) {
            ref.value = target.getAttribute(ref.propertyName) || "";
          }
        }
      }
    });
  });
  observer["___refs___"] = [ref];
  observer.observe(target, { attributes: true });
  target["___observer___"] = observer;
  return observer;
}

export type refProperty = (value?: string, propertyName?: string) => RefString;