export { Register } from "./RegisterComponent";
export type { ComponentDefinitionOptions } from "./RegisterComponent";
export { StyleLink } from "./StyleLink";

export function Inject(): PropertyDecorator {
  return (target, propertyKey) => {};
}
