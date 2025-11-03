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
 * @default InjectedType.ROOT
 */
export function Inject(type: InjectedType = InjectedType.ROOT): PropertyDecorator {
  return (target, propertyKey) => {};
}
