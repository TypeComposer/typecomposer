export { Register } from "./RegisterComponent";
export type { ComponentDefinitionOptions } from "./RegisterComponent";
export { StyleLink } from "./StyleLink";

export enum InjectedType {
  ROOT = 0,
  SELF = 1,
  PARENT = 2
}

/**
 * Property decorator to inject a service into a component.
 * @param type The type of injection (ROOT, SELF, PARENT).
 * @type {InjectedType} ROOT - Injects the service from the root component.
 * @type {InjectedType} SELF - Injects the service from the current component.
 * @type {InjectedType} PARENT - Injects the service from the parent component.
 * @default InjectedType.ROOT
 */
export function Inject(type: InjectedType = InjectedType.ROOT): PropertyDecorator {
  return (target, propertyKey) => {};
}

/** 
 * Class decorator to mark a class as a service.
 * @param constructor The constructor of the service class.
 */
export function Service(constructor: Function) {
  // @ts-ignore
  TypeComposer.injectServices.add(constructor);
}